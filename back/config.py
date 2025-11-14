from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from aiogram import Bot, Dispatcher
from fastapi import FastAPI
from tortoise import Tortoise
from typing import AsyncGenerator

ROOT_DIR = Path(__file__).parent.parent

class Config(BaseSettings):
    BOT_TOKEN: SecretStr
    DB_URL: SecretStr

    WEBHOOK_URL: str = ""
    WEBAPP_URL: str = ""

    APP_HOST: str = "localhost"
    APP_HOST: int = 8080

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / "back" / ".env",
        env_file_encoding="utf-8"
    )\
    

async def lifespan(app: FastAPI) -> AsyncGenerator:
    await bot.set_webhook(
        url=f"{config.WEBAPP_URL}/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )

    await Tortoise.init(TORTOISE_ORM)



config =  Config()

bot = Bot(Config.BOT_TOKEN.get_secret_value())
dp = Dispatcher()
app = FastAPI(lifespan=lifespan)

TORTOISE_ORM = {
    "connections": {"default": config.DB_URL.get_secret_value()},
    "apps": {
        "models": {
            "models": ["db.models.user", "aerich.models"],
            "default_connection": "default",
        },
    },
}
