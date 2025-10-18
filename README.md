# Website Code - Static Site Generator

Генератор статических сайтов для клиентов Multi-Tenant CMS.

## Стек технологий

- **11ty (Eleventy)** - статический генератор сайтов
- **Nunjucks** - шаблонизатор
- **Tailwind CSS** - стили
- **AWS SDK v3** - загрузка данных из Cloudflare R2

## Установка

```bash
npm install
```

## Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=multi-tenant-cms-storage
R2_ACCOUNT_ID=your_account_id
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

## Разработка

```bash
npm run dev
```

Это запустит:
- **11ty** на [http://localhost:8080](http://localhost:8080) - сайты клиентов
- **Vite** на [http://localhost:3001](http://localhost:3001) - hot reload для JS/CSS

## Сборка

```bash
npm run build
```

Результат будет в папке `_site/`

Это выполнит:
- Генерацию статических страниц (11ty)
- Оптимизацию изображений (Sharp, ImageMin)
- Минификацию CSS (Autoprefixer, PostCSS)
- Бандлинг JS (Vite)

## Превью продакшн сборки

```bash
npm run preview
```

## Как это работает

1. **Загрузка данных**: Скрипт `src/_data/clients.js` загружает данные всех клиентов из R2
2. **Генерация страниц**: 11ty создает отдельную страницу для каждого клиента по шаблону `src/clients.njk`
3. **Статический экспорт**: Все страницы экспортируются как статические HTML файлы
4. **Деплой**: GitHub Actions автоматически деплоит на Cloudflare Pages

## Структура данных клиента (config.json)

```json
{
  "site": {
    "title": "Название сайта",
    "description": "Описание сайта",
    "logo": "/images/logo.png",
    "email": "contact@example.com",
    "phone": "+7 (999) 123-45-67"
  },
  "hero": {
    "title": "Заголовок Hero секции",
    "description": "Описание",
    "image": "/images/hero.jpg",
    "buttons": [
      {
        "text": "Кнопка 1",
        "url": "#contact",
        "primary": true
      }
    ]
  },
  "pages": [
    {
      "id": "about",
      "title": "О нас",
      "slug": "#about",
      "content": "<p>HTML контент</p>",
      "published": true
    }
  ],
  "features": [
    {
      "icon": "🚀",
      "title": "Преимущество 1",
      "description": "Описание"
    }
  ]
}
```

## URL клиентов

Каждый клиент получает свой URL:
- `https://your-domain.com/{userId}/`

Где `{userId}` - это ID пользователя из Clerk.

