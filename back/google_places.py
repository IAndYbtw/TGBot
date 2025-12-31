import os
import httpx
from typing import List, Dict, Optional

GUU_LATITUDE = 55.714611629700215
GUU_LONGITUDE = 37.814250788295936
RADIUS = 1000 

async def fetch_places_from_google(api_key: Optional[str] = None) -> List[Dict]:
    """
    Получает кафе рядом с ГУУ через Google Places API
    
    Если API ключ не указан, возвращает пустой список
    """
    if not api_key:
        api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    
    if not api_key:
        print("⚠️ GOOGLE_PLACES_API_KEY не установлен. Пропускаем загрузку кафе из Google Places.")
        return []
    
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    
    params = {
        "location": f"{GUU_LATITUDE},{GUU_LONGITUDE}",
        "radius": RADIUS,
        "type": "restaurant|cafe|food",
        "key": api_key,
        "language": "ru"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "OK":
                print(f"⚠️ Ошибка Google Places API: {data.get('status')}")
                return []
            
            places = []
            for place in data.get("results", []):
                places.append({
                    "name": place.get("name", ""),
                    "description": None,
                    "category": ", ".join(place.get("types", []))[:50] if place.get("types") else "Кафе",
                    "location": place.get("vicinity", ""),
                    "icon": "🍽️",
                    "google_place_id": place.get("place_id"),
                    "rating": place.get("rating"),
                    "price_level": place.get("price_level")
                })
            
            print(f"✅ Загружено {len(places)} кафе из Google Places API")
            return places
            
    except Exception as e:
        print(f"❌ Ошибка при загрузке кафе из Google Places: {e}")
        return []


async def fetch_places_from_yandex(api_key: Optional[str] = None) -> List[Dict]:
    """
    Получает кафе рядом с ГУУ через Yandex Maps API (альтернатива)
    """
    if not api_key:
        api_key = os.getenv("YANDEX_MAPS_API_KEY")
    
    if not api_key:
        print("⚠️ YANDEX_MAPS_API_KEY не установлен. Пропускаем загрузку кафе из Yandex Maps.")
        return []
    
    # Yandex Geocoder API для поиска организаций
    url = "https://search-maps.yandex.ru/v1/"
    
    params = {
        "text": "кафе, ресторан, еда",
        "ll": f"{GUU_LONGITUDE},{GUU_LATITUDE}",
        "spn": "0.01,0.01", 
        "type": "biz",
        "apikey": api_key,
        "lang": "ru_RU",
        "results": 20
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            places = []
            for feature in data.get("features", []):
                properties = feature.get("properties", {})
                company_meta = properties.get("CompanyMetaData", {})
                
                places.append({
                    "name": properties.get("name", ""),
                    "description": company_meta.get("description"),
                    "category": ", ".join(company_meta.get("Categories", []))[:50] if company_meta.get("Categories") else "Кафе",
                    "location": company_meta.get("address", ""),
                    "icon": "🍽️",
                    "yandex_id": properties.get("id"),
                    "rating": company_meta.get("rating")
                })
            
            print(f"✅ Загружено {len(places)} кафе из Yandex Maps API")
            return places
            
    except Exception as e:
        print(f"❌ Ошибка при загрузке кафе из Yandex Maps: {e}")
        return []

