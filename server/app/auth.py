import os
import certifi
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, OperationFailure
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

MONGODB_URI = os.getenv("MONGODB_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

# These are set from main.py lifespan (avoids deprecated router.on_event)
client = None
db = None

def connect_db():
    """Called from main.py lifespan on startup."""
    global client, db
    if MONGODB_URI:
        client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
            tlsCAFile=certifi.where(),
        )
        db = client.research_analyzer
        print("✅ MongoDB client initialized (will verify on first query)")
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

    try:
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
    except OperationFailure as e:
        print(f"❌ MongoDB auth error in signup: {e}")
        raise HTTPException(status_code=503, detail="Database authentication failed. Please verify MongoDB Atlas credentials and try again.")
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        print(f"❌ MongoDB connection error in signup: {e}")
        raise HTTPException(status_code=503, detail="Database connection failed. Please check MongoDB Atlas IP whitelist and try again.")


@router.post("/login")
async def login(user: UserLogin):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        db_user = await db.users.find_one({"email": user.email})
        if not db_user or db_user.get('auth_provider') != 'local':
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not verify_password(user.password, db_user['password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": db_user['email'], "name": db_user['name']})
        return {"success": True, "token": token, "user": {"name": db_user['name'], "email": db_user['email']}}
    except HTTPException:
        raise
    except OperationFailure as e:
        print(f"❌ MongoDB auth error in login: {e}")
        raise HTTPException(status_code=503, detail="Database authentication failed. Please verify MongoDB Atlas credentials and try again.")
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        print(f"❌ MongoDB connection error in login: {e}")
        raise HTTPException(status_code=503, detail="Database connection failed. Please check MongoDB Atlas IP whitelist and try again.")


@router.post("/google-auth")
async def google_auth(auth_data: GoogleAuth):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        db_user = await db.users.find_one({"email": auth_data.email})

        if not db_user:
            new_user = auth_data.dict()
            new_user['created_at'] = datetime.utcnow()
            new_user['auth_provider'] = 'google'
            await db.users.insert_one(new_user)
            name = auth_data.name
        else:
            name = db_user.get('name', auth_data.name)

        token = create_access_token({"sub": auth_data.email, "name": name})
        return {"success": True, "token": token, "user": {"name": name, "email": auth_data.email}}
    except OperationFailure as e:
        print(f"❌ MongoDB auth error in google-auth: {e}")
        raise HTTPException(status_code=503, detail="Database authentication failed. Please verify MongoDB Atlas credentials and try again.")
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        print(f"❌ MongoDB connection error in google-auth: {e}")
        raise HTTPException(status_code=503, detail="Database connection failed. Please check MongoDB Atlas IP whitelist and try again.")


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
            "cloudinary_url": paper.get("cloudinary_url", ""),
            "cloudinary_public_id": paper.get("cloudinary_public_id", ""),
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


@router.delete("/papers/{doc_id}")
async def delete_paper(doc_id: str, authorization: str = Header(None)):
    """Delete a paper from MongoDB and remove its file from Cloudinary."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")

    # Authenticate
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Find the paper (must belong to the authenticated user)
    paper = await db.papers.find_one({"doc_id": doc_id, "user_email": user_email})
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Delete from Cloudinary if a public_id exists
    cloudinary_public_id = paper.get("cloudinary_public_id")
    if cloudinary_public_id:
        from app.cloudinary_service import delete_from_cloudinary

        # Determine resource_type from filename
        filename = paper.get("filename", "")
        resource_type = "image" if filename.lower().split(".")[-1] in (
            "png", "jpg", "jpeg", "bmp", "tiff", "webp", "gif"
        ) else "raw"
        await delete_from_cloudinary(cloudinary_public_id, resource_type=resource_type)

    # Delete from MongoDB
    await db.papers.delete_one({"_id": paper["_id"]})

    return {"success": True, "message": f"Paper '{paper.get('filename', doc_id)}' deleted"}
