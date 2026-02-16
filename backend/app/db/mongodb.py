"""
MongoDB connection.

Uses Motor (async driver) + Beanie (ODM — like Mongoose for Python).

Usage:
    On app startup:   await init_db()
    On app shutdown:  await close_db()
"""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings

# Global client — stays alive for the app's lifetime
_client: AsyncIOMotorClient | None = None


async def init_db():
    """Connect to MongoDB and register all document models."""
    global _client

    _client = AsyncIOMotorClient(settings.mongodb_uri)
    db = _client[settings.mongodb_db_name]

    # Import models here to avoid circular imports
    from app.models.user import User
    from app.models.site import Site
    from app.models.tool import Tool
    from app.models.api_key import APIKey
    from app.models.chat import ChatSession

    await init_beanie(
        database=db,
        document_models=[
            User,
            Site,
            Tool,
            APIKey,
            ChatSession,
        ],
    )

    print(f"✅ MongoDB connected: {settings.mongodb_db_name}")


async def close_db():
    """Close MongoDB connection on shutdown."""
    global _client
    if _client:
        _client.close()
        print("🔌 MongoDB disconnected")