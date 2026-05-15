import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

async def main():
    if not MONGODB_URI:
        print("No MONGODB_URI found.")
        return
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.research_analyzer
    papers = await db.papers.find().to_list(10)
    for p in papers:
        print(f"Paper: {p}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
