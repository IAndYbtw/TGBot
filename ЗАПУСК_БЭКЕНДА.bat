@echo off
echo ====================================
echo   Запуск бэкенда TGBot
echo ====================================
echo.

cd back

echo Запускаем сервер...
echo.
echo Сервер будет доступен на:
echo   - http://127.0.0.1:8000
echo   - http://localhost:8000
echo.
echo API Документация:
echo   - http://127.0.0.1:8000/docs
echo.
echo API Endpoints:
echo   - http://127.0.0.1:8000/api/places
echo.
echo ВАЖНО: Оставьте это окно открытым!
echo Для остановки нажмите Ctrl+C
echo.

python main.py

pause

