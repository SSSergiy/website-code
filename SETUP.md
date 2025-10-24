# Настройка статического сайта

## 1. Создайте файл `.env` в корне проекта:

```env
# R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-a6698d33e75a45ebb75c9b00d0c3ce2a.r2.dev

# Client Configuration
CLIENT_ID=user_34EvUVHa2Fv9rbrXKRzHCbR7791
```

## 2. Установите зависимости:

```bash
npm install
```

## 3. Запустите разработку:

```bash
npm run dev
```

## 4. Соберите для продакшена:

```bash
npm run build
```

## Как это работает:

1. **Загрузка данных**: Система загружает `content.json` из R2 для указанного `CLIENT_ID`
2. **Обработка секций**: Секции из `content.json` преобразуются в формат, понятный шаблонам
3. **Рендеринг**: Eleventy генерирует статический HTML на основе данных из R2

## Поддерживаемые типы секций:

- **hero**: Главная секция с заголовком, подзаголовком, кнопкой и фоновым изображением
- **text**: Текстовая секция с выравниванием
- **image**: Секция с изображением и подписью
- **features**: Секция с карточками функций

## Структура данных в content.json:

```json
{
  "pages": {
    "home": {
      "id": "home",
      "title": "Главная страница",
      "slug": "/",
      "status": "published",
      "sections": [
        {
          "id": "hero-1",
          "type": "hero",
          "values": {
            "title": "Заголовок",
            "subtitle": "Подзаголовок",
            "backgroundImage": "url",
            "buttonText": "Кнопка",
            "buttonLink": "/link"
          }
        }
      ]
    }
  }
}
```
