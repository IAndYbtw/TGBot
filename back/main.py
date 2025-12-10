from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import delete_tables, create_tables
from schemas import Place, PlaceCreate
from places_repository import PlacesRepository
from fill_sample_data import load_sample_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print("База очищена")
    await create_tables()
    print("База готова")
    
    await load_sample_data()
    
    yield
    print('Выключение')

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Корневой endpoint"""
    return {
        "message": "TGBot API",
        "version": "1.0.0",
        "endpoints": {
            "places": "/api/places",
            "docs": "/docs"
        }
    }


@app.get("/api/places/{place_id}/menu")
async def get_place_menu(place_id: int):
    """Получить меню для конкретного кафе"""
    from database import new_session, MenuItemOrm
    from sqlalchemy import select
    
    place = await PlacesRepository.find_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Место с ID {place_id} не найдено")
    
    async with new_session() as session:
        query = select(MenuItemOrm).where(MenuItemOrm.cafe_id == place_id)
        result = await session.execute(query)
        menu_items = result.scalars().all()
        
        return {
            "place_id": place_id,
            "place_name": place.name,
            "menu": [
                {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "price": float(item.price)  
                }
                for item in menu_items
            ]
        }

@app.get("/api/places/{place_id}", response_model=Place)
async def get_place(place_id: int):
    """Получить место по ID"""
    place = await PlacesRepository.find_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Место не найдено")
    return place

@app.get("/api/places", response_model=list[Place])
async def get_places():
    """Получить все места"""
    places = await PlacesRepository.find_all()
    return places

@app.post("/api/places", response_model=Place)
async def create_place(place: PlaceCreate):
    """Создать новое место"""
    place_id = await PlacesRepository.add_one(place)
    created_place = await PlacesRepository.find_by_id(place_id)
    return created_place

if __name__ == "__main__":
    import uvicorn
    print("🚀 Запуск сервера на http://localhost:8000")
    print("📚 Документация доступна на http://localhost:8000/docs")
    print("📋 Данные загружаются из fill_sample_data.py")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
