from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel

from database import delete_tables, create_tables
from schemas import Place, PlaceCreate
from places_repository import PlacesRepository
from fill_sample_data import load_sample_data
from google_places import fetch_places_from_google, fetch_places_from_yandex
from ai_search import search_food_by_query

@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print("База очищена")
    await create_tables()
    print("База готова")
    
    await load_sample_data()
    
    # Пытаемся загрузить кафе из API
    try:
        google_places = await fetch_places_from_google()
        if not google_places:
            google_places = await fetch_places_from_yandex()
        
        if google_places:
            existing_places = await PlacesRepository.find_all()
            loaded_count = 0
            for place_data in google_places:
                place_exists = any(
                    p.name == place_data["name"] and p.location == place_data["location"]
                    for p in existing_places
                )
                if not place_exists:
                    place_create = PlaceCreate(**{k: v for k, v in place_data.items() if k not in ["google_place_id", "yandex_id", "rating", "price_level"]})
                    await PlacesRepository.add_one(place_create)
                    loaded_count += 1
            if loaded_count > 0:
                print(f"✅ Загружено {loaded_count} кафе из API")
    except Exception as e:
        print(f"⚠️ Не удалось загрузить кафе из API: {e}")
    
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
    from database import new_session, MenuItemOrm
    from sqlalchemy import select
    
    place = await PlacesRepository.find_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Место с ID {place_id} не найдено")
    
    async with new_session() as session:
        query = select(MenuItemOrm).where(MenuItemOrm.cafe_id == place_id)
        result = await session.execute(query)
        menu_items = result.scalars().all()
        
        return [
                {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "category":item.category,
                    "price": float(item.price)  
                }
                for item in menu_items
        ]

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


class ChatQuery(BaseModel):
    query: str


@app.post("/api/chat/search-food")
async def search_food(query: ChatQuery):
    """ИИ-поиск еды по запросу пользователя"""
    result = await search_food_by_query(query.query)
    if not result:
        raise HTTPException(status_code=404, detail="Не удалось найти подходящие блюда")
    return result


@app.post("/api/places/fetch-from-api")
async def fetch_places_from_api():
    """Загрузить кафе из Google Places API и сохранить в базу"""
    try:
        # Пробуем загрузить из Google Places
        google_places = await fetch_places_from_google()
        
        # Если Google не сработал, пробуем Yandex
        if not google_places:
            google_places = await fetch_places_from_yandex()
        
        if not google_places:
            return {
                "message": "Не удалось загрузить кафе. Убедитесь, что установлен GOOGLE_PLACES_API_KEY или YANDEX_MAPS_API_KEY",
                "loaded": 0
            }
        
        # Сохраняем кафе в базу
        loaded_count = 0
        for place_data in google_places:
            # Проверяем, не существует ли уже такое кафе
            existing_places = await PlacesRepository.find_all()
            place_exists = any(
                p.name == place_data["name"] and p.location == place_data["location"]
                for p in existing_places
            )
            
            if not place_exists:
                place_create = PlaceCreate(**{k: v for k, v in place_data.items() if k not in ["google_place_id", "yandex_id", "rating", "price_level"]})
                await PlacesRepository.add_one(place_create)
                loaded_count += 1
        
        return {
            "message": f"Успешно загружено {loaded_count} новых кафе",
            "loaded": loaded_count,
            "total_found": len(google_places)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке кафе: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Запуск сервера на http://localhost:8000")
    print("📚 Документация доступна на http://localhost:8000/docs")
    print("📋 Данные загружаются из fill_sample_data.py")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
