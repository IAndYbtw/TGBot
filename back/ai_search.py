"""
Модуль для ИИ-поиска еды по запросу пользователя
"""
from typing import List, Dict, Optional
from database import new_session, MenuItemOrm, CafeOrm
from sqlalchemy import select
import re


def normalize_query(query: str) -> str:
    """Нормализует запрос пользователя для поиска"""
    query = query.lower().strip()
    # Убираем лишние слова
    stop_words = ['хочу', 'хотел', 'хотела', 'хотел бы', 'хотела бы', 'мне', 'дай', 'дайте', 'найди', 'найти']
    for word in stop_words:
        query = query.replace(word, '')
    return query.strip()


def extract_keywords(query: str) -> List[str]:
    """Извлекает ключевые слова из запроса"""
    keywords = []
    
    # Словарь синонимов и категорий
    food_categories = {
        'острое': ['острый', 'пряный', 'перченый', 'жгучий'],
        'сладкое': ['сладкий', 'десерт', 'торт', 'пирожное'],
        'сытное': ['сытный', 'плотный', 'насыщенный', 'калорийный'],
        'легкое': ['легкий', 'легкое', 'диетический', 'низкокалорийный'],
        'мясное': ['мясо', 'говядина', 'свинина', 'курица', 'стейк', 'шашлык'],
        'рыбное': ['рыба', 'лосось', 'тунец', 'морепродукты'],
        'вегетарианское': ['вегетарианский', 'овощи', 'салат', 'без мяса'],
        'итальянское': ['итальянский', 'паста', 'пицца', 'ризотто'],
        'азиатское': ['азиатский', 'суши', 'роллы', 'лапша', 'рис'],
        'суп': ['суп', 'борщ', 'щи', 'бульон'],
        'салат': ['салат', 'овощи'],
        'напиток': ['напиток', 'кофе', 'чай', 'сок', 'коктейль'],
        'быстрое': ['быстро', 'фастфуд', 'бургер', 'картошка']
    }
    
    query_lower = query.lower()
    
    # Ищем совпадения по категориям
    for category, synonyms in food_categories.items():
        for synonym in synonyms:
            if synonym in query_lower:
                keywords.append(category)
                break
    
    # Извлекаем отдельные слова (существительные)
    words = re.findall(r'\b[а-яё]{4,}\b', query_lower)
    keywords.extend(words)
    
    return list(set(keywords))


async def search_food_by_query(query: str) -> Optional[Dict]:
    """
    Ищет подходящие блюда по запросу пользователя
    
    Возвращает рекомендацию с местом и блюдами
    """
    if not query or not query.strip():
        return None
    
    normalized_query = normalize_query(query)
    keywords = extract_keywords(normalized_query)
    
    if not keywords:
        # Если не удалось извлечь ключевые слова, используем весь запрос
        keywords = [normalized_query]
    
    async with new_session() as session:
        # Получаем все меню из всех кафе
        query_all_items = select(MenuItemOrm, CafeOrm).join(
            CafeOrm, MenuItemOrm.cafe_id == CafeOrm.id
        )
        result = await session.execute(query_all_items)
        all_items = result.all()
        
        if not all_items:
            return None
        
        # Оцениваем релевантность каждого блюда
        scored_items = []
        
        for menu_item, cafe in all_items:
            score = 0
            
            # Проверяем название блюда
            item_name_lower = menu_item.name.lower()
            item_desc_lower = (menu_item.description or "").lower()
            
            # Проверяем совпадения по ключевым словам
            for keyword in keywords:
                if keyword in item_name_lower:
                    score += 3
                if keyword in item_desc_lower:
                    score += 2
                if keyword in cafe.name.lower():
                    score += 1
                if keyword in (cafe.category or "").lower():
                    score += 1
            
            # Проверяем прямое совпадение в запросе
            query_words = normalized_query.split()
            for word in query_words:
                if len(word) > 3 and word in item_name_lower:
                    score += 2
                if len(word) > 3 and word in item_desc_lower:
                    score += 1
            
            if score > 0:
                scored_items.append({
                    'score': score,
                    'item': menu_item,
                    'cafe': cafe
                })
        
        if not scored_items:
            return None
        
        # Сортируем по релевантности
        scored_items.sort(key=lambda x: x['score'], reverse=True)
        
        # Берем топ-3 блюда из лучшего кафе
        best_match = scored_items[0]
        best_cafe = best_match['cafe']
        
        # Группируем блюда по кафе
        cafe_items = {}
        for item_data in scored_items:
            cafe_id = item_data['cafe'].id
            if cafe_id not in cafe_items:
                cafe_items[cafe_id] = {
                    'cafe': item_data['cafe'],
                    'items': [],
                    'total_score': 0
                }
            cafe_items[cafe_id]['items'].append(item_data['item'])
            cafe_items[cafe_id]['total_score'] += item_data['score']
        
        # Выбираем кафе с лучшим общим счетом
        best_cafe_id = max(cafe_items.keys(), key=lambda k: cafe_items[k]['total_score'])
        best_cafe_data = cafe_items[best_cafe_id]
        
        # Берем топ-3 блюда из этого кафе
        top_items = best_cafe_data['items'][:3]
        
        # Формируем причину рекомендации
        reason = f"Подобрал блюда, которые соответствуют вашему запросу '{query}'"
        if keywords:
            reason += f" (ключевые слова: {', '.join(keywords[:3])})"
        
        return {
            "place_name": best_cafe_data['cafe'].name,
            "place_id": best_cafe_data['cafe'].id,
            "items": [
                {
                    "name": item.name,
                    "description": item.description,
                    "price": float(item.price)
                }
                for item in top_items
            ],
            "reason": reason
        }

