"""
Тестовый скрипт для проверки API меню
"""
import requests
import json

def test_menu_api():
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Тестирование API меню...\n")
    
    # 1. Проверка корневого endpoint
    print("1. Проверка корневого endpoint:")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   ✅ Статус: {response.status_code}")
        print(f"   📄 Ответ: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return
    
    print()
    
    # 2. Проверка списка мест
    print("2. Проверка списка мест:")
    try:
        response = requests.get(f"{base_url}/api/places")
        print(f"   ✅ Статус: {response.status_code}")
        places = response.json()
        print(f"   📄 Найдено мест: {len(places)}")
        if places:
            print(f"   📝 Первое место: {places[0]['name']} (ID: {places[0]['id']})")
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return
    
    print()
    
    # 3. Проверка меню для каждого места
    print("3. Проверка меню для каждого места:")
    for place_id in range(1, 5):  # Проверяем места с ID 1-4
        try:
            url = f"{base_url}/api/places/{place_id}/menu"
            print(f"   Тест {place_id}: {url}")
            response = requests.get(url)
            
            if response.status_code == 200:
                menu_data = response.json()
                print(f"   ✅ Статус: {response.status_code}")
                print(f"   📄 Кафе: {menu_data['place_name']}")
                print(f"   🍽️  Блюд в меню: {len(menu_data['menu'])}")
                if menu_data['menu']:
                    print(f"   📝 Первое блюдо: {menu_data['menu'][0]['name']} - {menu_data['menu'][0]['price']}₽")
            else:
                print(f"   ❌ Статус: {response.status_code}")
                print(f"   📄 Ответ: {response.text}")
        except Exception as e:
            print(f"   ❌ Ошибка: {e}")
        print()
    
    print("✅ Тестирование завершено!")

if __name__ == "__main__":
    test_menu_api()

