"""
Application configuration.

Loads settings from .env file. Import `settings` anywhere:
    from app.config import settings
    print(settings.mongodb_uri)
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # --- MongoDB ---
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "bharatmcp"

    # --- Redis ---
    redis_url: str = "redis://localhost:6379/0"

    # --- Gemini AI ---
    gemini_api_key: str = ""

    # --- JWT Auth ---
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    # --- Server ---
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    # --- CORS ---
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        """Split comma-separated origins into a list."""
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton — import this everywhere
settings = Settings()