import asyncio
from database import CafeOrm, MenuItemOrm, new_session, create_tables

async def load_sample_data():

    await create_tables()

    async with new_session() as session:
        cafes = [
            CafeOrm(
                name="Пандасад",
                description="Вкусная азиатская кухня с большим выбором блюд. Лапша, рис, супы и многое другое.",
                category="Азиатская кухня",
                location="Учебный корпус, 1 этаж",
                icon="🍜",
                lat="55.714069",
                lon="37.811555"
            ),
            CafeOrm(
                name="Пицца Хот",
                description="Свежая горячая пицца на любой вкус. Готовим быстро, доставляем горячей!",
                category="Итальянская кухня",
                location="Поточный корпус, 2 этаж",
                icon="🍕",
                lat="55.713434",
                lon="37.815917"
            ),
            CafeOrm(
                name="FENI",
                description="Лучший кофе в кампусе! Также большой выбор чая, смузи и других напитков.",
                category="Кофейня",
                location="Лабораторный корпус, 1 этаж",
                icon="☕",
                lat="55.713469",
                lon="37.815382"
            ),
            CafeOrm(
                name="Картошечка",
                description="Аппетитная картошечка в различных вариациях. Фри, по-деревенски, драники и многое другое!",
                category="Картофельная кухня",
                location="3 этаж, переход из ЛК в Учебный корпус",
                icon="🥔",
                lat="55.713996",
                lon="37.813418"
            )
        ]
        
        session.add_all(cafes)
        await session.flush()  

        menu_items = [
            # Пандасад - Азиатская кухня
            MenuItemOrm(cafe_id=cafes[0].id, name="Кацу с курицей", description="Хрустящая курица в панировке", category="Горячее", price=350.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Том ям с морепродуктами", description="Острый тайский суп", category="Супы", price=350.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Суп сливочный", description="Нежный крем-суп", category="Супы", price=350.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Жареный рис с курицей", description="Классический азиатский рис", category="Горячее", price=300.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Жареный рис с креветками", description="Рис с морепродуктами", category="Горячее", price=350.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Фунчоза с курицей терияки", description="Стеклянная лапша с соусом терияки", category="Горячее", price=350.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Баклажаны с томатами", description="Овощное блюдо", category="Горячее", price=250.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Салат цезарь", description="С курицей и пармезаном", category="Салаты", price=280.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Сендвич с ветчиной", description="Свежий сендвич", category="Сендвичи", price=210.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Сендвич с курицей", description="Сендвич с куриным филе", category="Сендвичи", price=240.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Добрый кола", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Добрый апельсин", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Добрый лимон", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Мохито FRESH", description="Освежающий лимонад", category="Напитки", price=180.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Мохито клубничный FRESH", description="Клубничный лимонад", category="Напитки", price=180.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Мохито виноград-алоэ FRESH", description="Виноградный лимонад", category="Напитки", price=180.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Вода без газа", description="Питьевая вода", category="Напитки", price=100.0),
            MenuItemOrm(cafe_id=cafes[0].id, name="Вода с газом", description="Газированная вода", category="Напитки", price=100.0),

            # Пицца Хот - Итальянская кухня
            MenuItemOrm(cafe_id=cafes[1].id, name="Пицца 4 сыра", description="Моцарелла, пармезан, горгонзола, чеддер", category="Пицца", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Пицца Пепперони", description="С острой салями пепперони", category="Пицца", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Пицца ветчина и сыр", description="Классическая пицца", category="Пицца", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Пицца ветчина и грибы", description="С шампиньонами", category="Пицца", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Пицца Диабола", description="Острая пицца с халапеньо", category="Пицца", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Сендвич с ветчиной", description="Свежий сендвич", category="Сендвичи", price=210.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Сендвич с курицей", description="Сендвич с куриным филе", category="Сендвичи", price=240.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Добрый кола", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Добрый апельсин", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Добрый лимон", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Вода без газа", description="Питьевая вода", category="Напитки", price=100.0),
            MenuItemOrm(cafe_id=cafes[1].id, name="Вода с газом", description="Газированная вода", category="Напитки", price=100.0),

            # FENI - Кофейня
            MenuItemOrm(cafe_id=cafes[2].id, name="LAVANDER", description="анчан/лаванда/саган-дайля/ежевика", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="U R PEACH BOMB", description="тайский чай/бобы тонка/персик", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="HIBISCUS", description="гибискус/малина/мята", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CITRUS MIX", description="габа/цитрусы", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="JASMINE ALOE", description="жасмин/алоэ/крыжовник", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="LONGSLEEVE", description="дян хун/виноград/слива", category="Чай", price=350.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="VERY GRAPEFUL", description="жасмин/виноград/слива/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="PASSION", description="габа/манго/маракуйя/алоэ/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="BEZRAZLYCHNO", description="гибискус/малина/личи/ваниль/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="DRAGONY", description="анчан/лаванда/саган-дайля/черника/питахайя/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="I'M ALIVE", description="дян хун/крыжовник/зеленое яблоко/мята/персик/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="SPEACHLESS", description="тайский чай/розовый персик/бобы тонка/сырный крем", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="APPLE THAI", description="тайский чай/яблоко/персик/сливочное масло", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="GOOD NIGHT,HONEY", description="анчан/лаванда/саган-дайля/черная смородина/маракуйя/имбирь/виноград", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="GM EVERYONE", description="габа/малина/маракуйя/мята", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="SO MANLY OF U", description="дян хун/манго/личи/апельсин/грейпфрут", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="XOXO", description="гибискус/розовый персик/ваниль", category="Bubble Tea", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="JASMINE MATCHA CREAM", description="жасмин/матча/сырный крем/какао тапиока", category="Матча", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="HONGKONG TEA", description="дян хун/молоко/сливки/черный сахар/сырный крем/какао тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CHA THAI", description="тайский чай/сгущеное молоко/сырный крем/какао тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="RASKLAD TARO", description="молоко/таро/черная морковь/жасмин/какао тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="MATCHA LATTE", description="молоко/матча/жасмин/какао тапиока", category="Матча", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="BLACK MATCHA LATTE", description="молоко/черная матча/жасмин/какао тапиока", category="Матча", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="OVSYANKA,SIR", description="овсяное молоко/яблоко/карамель/сырный крем/карамель тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="BERRY BOBBA", description="молоко/малина/ваниль/сырный крем/клубник тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CHOCO BUBBLE", description="молоко/топленый шоколад/сырный крем/ какао топиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CURRANT MOOD", description="молоко/черная смородина/корица/сырный крем/лаванда тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="COCO MANGO", description="кокосовое молоко/манго/грейпфрут/кокосовый крем/кокос тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="PICK ME", description="кокосовое молоко/розовый персик/личи/сырный крем/лаванда тапиока", category="Молочный чай", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CHOCO LATTE", description="молоко/кофе/топленый шоколад/шоколадный топпинг/какао тапиока", category="Кофе", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="HALVA", description="овсяное молоко/халва/кофе/соленая карамель/карамель тапиока", category="Кофе", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="COCOA", description="молоко/топленый шоколаж/шоколажный топпинг/маршмеллоу/какао тапиока", category="Какао", price=450.0),
            MenuItemOrm(cafe_id=cafes[2].id, name="CARAMEL COFFEE", description="молоко/кофе/солёная карамель/карамель тапиока", category="Кофе", price=450.0),

            # Картошечка
            MenuItemOrm(cafe_id=cafes[3].id, name="Картошечка с сыром", description="Запеченная картошка с сыром", category="Картошка", price=180.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Картошечка со сливочным маслом", description="Классическая картошка", category="Картошка", price=180.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Картошечка с растительным маслом", description="Постная картошка", category="Картошка", price=180.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Картошечка с маслом и укропом", description="Ароматная картошка", category="Картошка", price=180.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг куриный жульен", description="Курица в сливочном соусе", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг ветчина-сыр", description="Ветчина с сыром", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг горчица-сосиски", description="Сосиски с горчицей", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг фета-укроп", description="Сыр фета с зеленью", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг соус болоньезе", description="Мясной соус", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Топпинг деревенский", description="С беконом и луком", category="Топпинги", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Салат цезарь", description="С курицей и пармезаном", category="Салаты", price=280.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Сендвич с ветчиной", description="Свежий сендвич", category="Сендвичи", price=210.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Сендвич с курицей", description="Сендвич с куриным филе", category="Сендвичи", price=240.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Добрый апельсин", description="Газированный напиток", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Чай липтон", description="Черный чай", category="Напитки", price=140.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Вода без газа", description="Питьевая вода", category="Напитки", price=100.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Вода с газом", description="Газированная вода", category="Напитки", price=100.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Американо", description="Классический кофе", category="Кофе", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Капучино", description="Кофе с молочной пенкой", category="Кофе", price=150.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Латте", description="Кофе с молоком", category="Кофе", price=160.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Флэт Уайт", description="Двойной эспрессо с молоком", category="Кофе", price=200.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Раф", description="Сливочный кофе", category="Кофе", price=180.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Матча зеленая", description="Японский чай матча", category="Матча", price=160.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Эспрессо", description="Крепкий кофе", category="Кофе", price=90.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Французский раф", description="Раф с лавандой", category="Кофе", price=250.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Сникерс латте", description="Латте с карамелью и орехами", category="Кофе", price=260.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Капучино соленый ирис", description="Капучино с ирисом", category="Кофе", price=250.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Чай черный", description="Классический черный чай", category="Чай", price=100.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Чай зеленый", description="Зеленый чай", category="Чай", price=100.0),
            MenuItemOrm(cafe_id=cafes[3].id, name="Чай фруктовый", description="Фруктовый чай", category="Чай", price=100.0),
        ]
        
        session.add_all(menu_items)
        await session.commit()
        
    print(f"✅ Загружено {len(cafes)} кафе и {len(menu_items)} блюд из fill_sample_data.py")
    return len(cafes)

if __name__ == "__main__":
    asyncio.run(load_sample_data())