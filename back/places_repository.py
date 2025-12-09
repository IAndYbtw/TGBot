from sqlalchemy import select
from database import new_session, CafeOrm
from schemas import PlaceCreate

class PlacesRepository:
    @classmethod
    async def add_one(cls, data: PlaceCreate) -> int:
        async with new_session() as session:
            place_dict = data.model_dump()
            place = CafeOrm(**place_dict)
            session.add(place)
            await session.flush()
            await session.commit()
            return place.id

    @classmethod
    async def find_all(cls):
        async with new_session() as session:
            query = select(CafeOrm)
            result = await session.execute(query)
            places = result.scalars().all()
            return places

    @classmethod
    async def find_by_id(cls, place_id: int):
        async with new_session() as session:
            query = select(CafeOrm).where(CafeOrm.id == place_id)
            result = await session.execute(query)
            place = result.scalar_one_or_none()
            return place

