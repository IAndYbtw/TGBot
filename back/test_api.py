"""
Простой скрипт для проверки работы API
"""
import requests

def test_api():
    try:
        # Проверяем корневой endpoint
        response = requests.get('http://localhost:8000/')
        print("✅ Сервер работает!")
        print(f"Ответ: {response.json()}")
        print()
        
        # Проверяем endpoint с местами
        response = requests.get('http://localhost:8000/api/places')
        if response.status_code == 200:
            places = response.json()
            print(f"✅ API возвращает {len(places)} мест:")
            for place in places:
                print(f"  - {place['icon']} {place['name']} ({place['category']}) - {place['location']}")
        else:
            print(f"❌ Ошибка: {response.status_code}")
    except Exception as e:
        print(f"❌ Не могу подключиться к серверу: {e}")
        print("\nПроверьте:")
        print("1. Запущен ли сервер: python main.py")
        print("2. Доступен ли http://localhost:8000")

if __name__ == "__main__":
    test_api()

