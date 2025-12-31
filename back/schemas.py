from pydantic import BaseModel

class PlaceBase(BaseModel):
    name: str
    description: str | None = None
    category: str
    location: str
    icon: str = "🍽️"
    lat: float
    lon: float

class PlaceCreate(PlaceBase):
    pass

class Place(PlaceBase):
    id: int

    class Config:
        from_attributes = True

class MenuItemBase(BaseModel):
    name: str
    description: str | None = None
    category: str  | None = None
    price: float

class MenuItem(MenuItemBase):
    id: int
    cafe_id: int

    class Config:
        from_attributes = True

