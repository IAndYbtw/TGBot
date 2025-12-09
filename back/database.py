from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase,Mapped

engine = create_async_engine(
    "sqlite+aiosqlite:///tasks.db"
)
new_session = async_sessionmaker(engine, expire_on_commit = False)

class Model(DeclarativeBase):
    pass

class TaskOrm(Model):
    __tablename__ = "tasks"

    id: Mapped[int] =  mapped_column(primary_key=True)
    name:Mapped[str]
    description:Mapped[str | None]

class CafeOrm(Model):
    __tablename__ = "cafes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str | None]
    category: Mapped[str]
    location: Mapped[str]
    icon: Mapped[str]

class MenuItemOrm(Model):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    cafe_id: Mapped[int] = mapped_column()
    name: Mapped[str]
    description: Mapped[str | None]
    price: Mapped[float]

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)


async def delete_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.drop_all)