import asyncio
from database import CafeOrm, MenuItemOrm, new_session, create_tables

async def main():
    # Создать таблицы, если их ещё нет
    await create_tables()

    async with new_session() as session:
        # Добавим кафе
        cafe = CafeOrm(name="Cafe Example", address="ул. Примерная, 1")
        session.add(cafe)
        await session.flush()  # получим cafe.id

        # Добавим несколько блюд для этого кафе
        menu_items = [
            MenuItemOrm(cafe_id=cafe.id, name="Борщ", description="Традиционный русский суп", price=200.0),
            MenuItemOrm(cafe_id=cafe.id, name="Пельмени", description="Домашние пельмени", price=250.0),
            MenuItemOrm(cafe_id=cafe.id, name="Чай", description="Черный чай", price=50.0)
        ]
        session.add_all(menu_items)
        await session.commit()
    print("Sample data inserted!")

if __name__ == "__main__":
    asyncio.run(main())
