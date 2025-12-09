@echo off
echo ====================================
echo   Запуск фронтенда TGBot
echo ====================================
echo.

cd front

echo Проверка зависимостей...
if not exist "node_modules" (
    echo Устанавливаем зависимости...
    call npm install
)

echo.
echo Запускаем фронтенд...
echo Откроется браузер на http://localhost:4200
echo.
echo ВАЖНО: Оставьте это окно открытым!
echo Для остановки нажмите Ctrl+C
echo.

call npm start

pause

