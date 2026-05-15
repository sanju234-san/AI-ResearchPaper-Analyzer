import os
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

MONGODB_URI = os.getenv("MONGODB_URI")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-dev")
ALGORITHM = "HS256"

# These are set from main.py lifespan (avoids deprecated router.on_event)
client = None
db = None

def connect_db():
    """Called from main.py lifespan on startup."""
    global client, db
    if MONGODB_URI:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.research_analyzer
        print("✅ Connected to MongoDB Atlas!")
    else:
        print("⚠️  WARNING: MONGODB_URI not set. MongoDB features disabled.")

def disconnect_db():
    """Called from main.py lifespan on shutdown."""
    global client
    if client:
        client.close()

# --- Pydantic Models ---
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuth(BaseModel):
    email: EmailStr
    name: str
    google_id: str
    avatar_url: str = None

# --- Helper Functions ---
def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Auth Routes ---
@router.post("/signup")
async def signup(user: UserSignup):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict['password'] = get_password_hash(user_dict['password'])
    user_dict['created_at'] = datetime.utcnow()
    user_dict['auth_provider'] = 'local'

    await db.users.insert_one(user_dict)
    token = create_access_token({"sub": user.email, "name": user.name})
    return {"success": True, "token": token, "user": {"name": user.name, "email": user.email}}


@router.post("/login")
async def login(user: UserLogin):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    db_user = await db.users.find_one({"email": user.email})
    if not db_user or db_user.get('auth_provider') != 'local':
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(user.password, db_user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_user['email'], "name": db_user['name']})
    return {"success": True, "token": token, "user": {"name": db_user['name'], "email": db_user['email']}}


@router.post("/google-auth")
async def google_auth(auth: GoogleAuth):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    db_user = await db.users.find_one({"email": auth.email})

    if not db_user:
        new_user = auth.dict()
        new_user['created_at'] = datetime.utcnow()
        new_user['auth_provider'] = 'google'
        await db.users.insert_one(new_user)
        name = auth.name
    else:
        name = db_user.get('name', auth.name)

    token = create_access_token({"sub": auth.email, "name": name})
    return {"success": True, "token": token, "user": {"name": name, "email": auth.email}}


@router.get("/me")
async def get_me(authorization: str = Header(None)):
    """Verify token and return user info."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        name = payload.get("name")
        return {"success": True, "user": {"name": name, "email": email}}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/papers")
async def get_papers(authorization: str = Header(None)):
    """Fetch all analysis reports from MongoDB for the logged-in user."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    user_email = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload.get("sub")
        except:
            pass

    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    papers_cursor = db.papers.find({"user_email": user_email}).sort("created_at", -1)
    papers = []
    async for paper in papers_cursor:
        papers.append({
            "id": str(paper.get("_id", "")),
            "doc_id": paper.get("doc_id", ""),
            "filename": paper.get("filename", ""),
            "user_email": paper.get("user_email", ""),
            "text_length": paper.get("text_length", 0),
            "extracted_text": paper.get("extracted_text", ""),
            "summary": paper.get("summary", ""),
            "keywords": paper.get("keywords", []),
            "rag_stats": paper.get("rag_stats", {}),
            "plagiarism": paper.get("plagiarism"),
            "answer": paper.get("answer"),
            "created_at": paper.get("created_at", "").isoformat() if paper.get("created_at") else None,
        })

    return {"success": True, "papers": papers, "count": len(papers)}

