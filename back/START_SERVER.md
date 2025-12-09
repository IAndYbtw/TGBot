# 🚀 Запуск бэкенда

## Шаг 1: Установите зависимости (если еще не сделали)

```bash
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic python-multipart
```

## Шаг 2: Запустите сервер

### Вариант 1: Через Python
```bash
python main.py
```

### Вариант 2: Через uvicorn напрямую
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ✅ Проверка работы

После запуска вы должны увидеть:
```
База очищена
База готова
✅ Тестовые данные добавлены: 4 места
🚀 Запуск сервера на http://localhost:8000
📚 Документация доступна на http://localhost:8000/docs
```

Откройте в браузере:
- **API Docs**: http://localhost:8000/docs
- **API Places**: http://localhost:8000/api/places
- **Root**: http://localhost:8000

## 🐛 Если есть ошибки

### ModuleNotFoundError
```bash
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic
```

### Порт занят
Измените порт в `main.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

### База данных заблокирована
Удалите файл `tasks.db` и запустите снова:
```bash
del tasks.db  # Windows
rm tasks.db   # Linux/Mac
```

## 📡 Тестирование API

### PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:8000/api/places
```

### CMD
```cmd
curl http://localhost:8000/api/places
```

### Браузер
Просто откройте: http://localhost:8000/api/places

