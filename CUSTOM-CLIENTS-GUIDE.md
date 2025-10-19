# 🎨 Руководство по кастомным дизайнам для клиентов

## 📁 Структура проекта

```
website-code/
├─ src/
│  ├─ clients.njk              ← Основной файл (использует default шаблон)
│  ├─ clients/                 ← Кастомные клиентские сайты
│  │  └─ user_ABC123.njk       ← Пример кастомного сайта
│  └─ _includes/
│     ├─ layouts/
│     │  ├─ default/           ← Шаблон по умолчанию (для всех)
│     │  │  └─ base.njk
│     │  └─ clients/           ← Кастомные шаблоны
│     │     └─ user_ABC123/    ← Кастомный layout для клиента
│     │        ├─ base.njk
│     │        └─ custom.css
│     └─ components/
│        ├─ default/           ← Компоненты по умолчанию
│        │  ├─ header.njk
│        │  ├─ hero.njk
│        │  └─ footer.njk
│        └─ clients/           ← Кастомные компоненты
│           └─ user_ABC123/    ← Кастомные компоненты для клиента
│              ├─ header.njk
│              ├─ hero.njk
│              └─ footer.njk
```

---

## 🚀 Как создать кастомный дизайн для клиента

### **Шаг 1: Узнай userId клиента**

Клиент регистрируется → получает `userId` (например: `user_2abc123xyz`)

В админке или в R2 смотришь его папку: `clients/user_2abc123xyz/`

---

### **Шаг 2: Создай кастомный файл**

**Вариант А: Полностью кастомный (рекомендуется)**

Создай файл: `src/clients/user_2abc123xyz.njk`

```njk
---
pagination:
  data: clients
  size: 1
  alias: client
  filter:
    - id: "user_2abc123xyz"
permalink: "/{{ client.id }}/index.html"
layout: layouts/clients/user_2abc123xyz/base.njk
---

{# Твоя кастомная разметка здесь #}
{% set site = client.site %}

<div class="custom-design">
  <h1>{{ site.title }}</h1>
  <p>{{ site.description }}</p>
  
  {# Твой уникальный дизайн #}
</div>
```

---

### **Шаг 3: Создай кастомный layout**

Создай: `src/_includes/layouts/clients/user_2abc123xyz/base.njk`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ site.title }}</title>
  
  <!-- Твой кастомный CSS -->
  <style>
    body {
      background: linear-gradient(to right, #667eea, #764ba2);
      color: white;
      font-family: 'Arial', sans-serif;
    }
    
    .custom-design {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
  </style>
</head>
<body>
  {% include "components/clients/user_2abc123xyz/header.njk" %}
  
  <main>
    {{ content | safe }}
  </main>
  
  {% include "components/clients/user_2abc123xyz/footer.njk" %}
</body>
</html>
```

---

### **Шаг 4: Создай кастомные компоненты (опционально)**

Создай: `src/_includes/components/clients/user_2abc123xyz/header.njk`

```html
<header class="custom-header">
  <h1>{{ site.title }}</h1>
  <nav>
    <a href="#about">О нас</a>
    <a href="#services">Услуги</a>
    <a href="#contact">Контакты</a>
  </nav>
</header>
```

Создай: `src/_includes/components/clients/user_2abc123xyz/footer.njk`

```html
<footer class="custom-footer">
  <p>&copy; 2025 {{ site.title }}</p>
</footer>
```

---

## ⚡ Быстрый способ (копирование default)

### **1. Скопируй default структуру:**

```bash
# Из корня website-code:
cp -r src/_includes/layouts/default src/_includes/layouts/clients/user_ABC123
cp -r src/_includes/components/default src/_includes/components/clients/user_ABC123
```

### **2. Создай файл клиента:**

`src/clients/user_ABC123.njk`:
```njk
---
pagination:
  data: clients
  size: 1
  alias: client
  filter:
    - id: "user_ABC123"
permalink: "/{{ client.id }}/index.html"
layout: layouts/clients/user_ABC123/base.njk
---

{% set site = client.site %}
{% set hero = client.hero or {} %}

{% include "components/clients/user_ABC123/hero.njk" %}

<!-- Весь остальной контент как в clients.njk -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  {% if client.pages %}
  {% for page in client.pages %}
  {% if page.published %}
  <section id="{{ page.slug }}" class="mb-16">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ page.title }}</h2>
    <div class="prose prose-lg max-w-none">
      {{ page.content | safe }}
    </div>
  </section>
  {% endif %}
  {% endfor %}
  {% endif %}
</div>
```

### **3. Редактируй кастомные файлы:**

Теперь можешь редактировать:
- `layouts/clients/user_ABC123/base.njk` - главный layout
- `components/clients/user_ABC123/header.njk` - хедер
- `components/clients/user_ABC123/hero.njk` - hero секция
- `components/clients/user_ABC123/footer.njk` - футер

---

## 🎯 Как это работает

### **Обычный клиент (без кастомного дизайна):**
```
clients.njk → layouts/default/base.njk → components/default/*
→ Стандартный дизайн ✅
```

### **Кастомный клиент (user_ABC123):**
```
clients/user_ABC123.njk → layouts/clients/user_ABC123/base.njk → components/clients/user_ABC123/*
→ Уникальный дизайн ✅
```

### **Результат:**
- Клиент 1 (обычный): `yoursite.com/user_111/` → стандартный дизайн
- Клиент 2 (обычный): `yoursite.com/user_222/` → стандартный дизайн
- Клиент 3 (кастомный): `yoursite.com/user_ABC123/` → уникальный дизайн ✨

---

## 📝 Важные моменты

1. **Фильтр в pagination обязателен**
   - Иначе кастомный файл будет генерировать страницы для ВСЕХ клиентов

2. **Permalink должен совпадать**
   - `permalink: "/{{ client.id }}/index.html"` - одинаковый для всех

3. **Git коммиты**
   - Каждое изменение для кастомного клиента коммить отдельно
   - Так легче откатить изменения если что-то сломается

4. **Тестирование локально**
   - `npm run build` - билдит все сайты (включая кастомные)
   - Проверяй `_site/user_ABC123/` перед публикацией

---

## 🔥 Пример реального workflow

### **Клиент хочет уникальный дизайн:**

```bash
# 1. Создаешь структуру
mkdir -p src/_includes/layouts/clients/user_ABC123
mkdir -p src/_includes/components/clients/user_ABC123

# 2. Копируешь default как базу
cp src/_includes/layouts/default/base.njk src/_includes/layouts/clients/user_ABC123/
cp -r src/_includes/components/default/* src/_includes/components/clients/user_ABC123/

# 3. Создаешь кастомный файл
nano src/clients/user_ABC123.njk

# 4. Верстаешь уникальный дизайн
nano src/_includes/layouts/clients/user_ABC123/base.njk

# 5. Тестируешь
npm run build
# Проверяешь: _site/user_ABC123/index.html

# 6. Коммитишь
git add src/_includes/layouts/clients/user_ABC123/
git add src/_includes/components/clients/user_ABC123/
git add src/clients/user_ABC123.njk
git commit -m "Add custom design for user_ABC123"
git push origin dev

# 7. GitHub Actions билдит и деплоит
# Клиент видит свой уникальный сайт! ✨
```

---

## 💡 Советы

- Начинай с копирования `default/` - быстрее стартовать
- Для простых изменений (цвета, шрифты) - используй CSS переменные
- Для сложных (структура) - кастомный layout
- Храни бэкапы кастомных дизайнов отдельно

---

**Готово! Теперь можешь создавать уникальные дизайны для VIP клиентов! 🎨**

