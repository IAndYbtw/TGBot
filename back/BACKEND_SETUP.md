# 🚀 Настройка бэкенда для TGBot

## 📋 Что нужно добавить

### 1. Создайте файл `schemas.py`

```python
from pydantic import BaseModel

class PlaceBase(BaseModel):
    name: str
    description: str | None = None
    category: str
    location: str
    icon: str = "🍽️"

class PlaceCreate(PlaceBase):
    pass

class Place(PlaceBase):
    id: int

    class Config:
        from_attributes = True

class MenuItemBase(BaseModel):
    name: str
    description: str | None = None
    price: float

class MenuItem(MenuItemBase):
    id: int
    cafe_id: int

    class Config:
        from_attributes = True
```

---

### 2. Обновите `database.py`

Измените модель `CafeOrm`:

```python
class CafeOrm(Model):
    __tablename__ = "cafes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str | None]  # ДОБАВИТЬ
    category: Mapped[str]              # ДОБАВИТЬ
    location: Mapped[str]              # вместо address
    icon: Mapped[str]                  # ДОБАВИТЬ
```

---

### 3. Создайте файл `places_repository.py`

```python
from sqlalchemy import select
from database import new_session, CafeOrm, MenuItemOrm
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
```

---

### 4. Обновите `main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import delete_tables, create_tables, CafeOrm
from schemas import Place, PlaceCreate
from places_repository import PlacesRepository

@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print("База очищена")
    await create_tables()
    print("База готова")
    
    # Добавляем тестовые данные
    await add_test_data()
    
    yield
    print('Выключение')

async def add_test_data():
    """Добавляем тестовые кафе"""
    test_places = [
        PlaceCreate(
            name="Пандасад",
            description="Вкусная азиатская кухня с большим выбором блюд. Здесь вы найдете лапшу, рис, супы и многое другое.",
            category="Азиатская кухня",
            location="Учебный корпус",
            icon="🍜"
        ),
        PlaceCreate(
            name="Пицца Хот",
            description="Свежая горячая пицца на любой вкус. Готовим быстро, доставляем горячей!",
            category="Итальянская кухня",
            location="ПА, 2 этаж",
            icon="🍕"
        ),
        PlaceCreate(
            name="FEIN",
            description="Лучший кофе в кампусе! Также большой выбор чая, смузи и других напитков.",
            category="Кофейня",
            location="ЛК, 1 этаж",
            icon="☕"
        ),
        PlaceCreate(
            name="Картошка",
            description="Аппетитная картошечка в различных вариациях. Фри, по-деревенски, драники и многое другое!",
            category="Фастфуд",
            location="3 этаж, переход ЛК → УК",
            icon="🥔"
        ),
    ]
    
    for place_data in test_places:
        await PlacesRepository.add_one(place_data)
    print("Тестовые данные добавлены")

app = FastAPI(lifespan=lifespan)

# CORS для связи с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API endpoints для кафе
@app.get("/api/places", response_model=list[Place])
async def get_places():
    """Получить все места"""
    places = await PlacesRepository.find_all()
    return places

@app.get("/api/places/{place_id}", response_model=Place)
async def get_place(place_id: int):
    """Получить место по ID"""
    place = await PlacesRepository.find_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Место не найдено")
    return place

@app.post("/api/places", response_model=Place)
async def create_place(place: PlaceCreate):
    """Создать новое место"""
    place_id = await PlacesRepository.add_one(place)
    created_place = await PlacesRepository.find_by_id(place_id)
    return created_place
```

---

## 🚀 Запуск бэкенда

```bash
cd back
python main.py
```

Бэкенд будет доступен на `http://localhost:8000`

---

## 📡 API Endpoints

- `GET /api/places` - Получить все места
- `GET /api/places/{id}` - Получить место по ID
- `POST /api/places` - Создать новое место

---

## 🔧 Настройка фронтенда

В файле `front/src/app/services/places.service.ts` измените URL на адрес вашего бэкенда:

```typescript
private apiUrl = 'http://localhost:8000/api/places';
```

Если бэкенд развернут на другом порту или домене, укажите правильный адрес.

---

## ✅ Проверка работы

1. Запустите бэкенд
2. Откройте в браузере: http://localhost:8000/docs
3. Проверьте API через Swagger UI
4. Запустите фронтенд и проверьте загрузку данных

---

## 🐛 Отладка

Если фронтенд не загружает данные:

1. Проверьте, что бэкенд запущен
2. Проверьте консоль браузера на наличие CORS ошибок
3. Убедитесь, что URL в сервисе правильный
4. Проверьте, что CORS middleware добавлен в main.py

Если увидите в консоли сообщение "используются тестовые данные" - это значит, что фронтенд не может подключиться к бэкенду и использует fallback данные.

