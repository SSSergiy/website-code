# 🎨 Быстрый старт: Кастомные дизайны для клиентов

## 📦 Что изменилось?

Теперь структура проекта поддерживает **отдельные дизайны** для каждого клиента:

```
✅ ВСЕ клиенты → используют default/ шаблон (стандартный дизайн)
✅ VIP клиенты → создаешь кастомный дизайн в clients/
✅ Изоляция → изменения в одном клиенте НЕ затронут других
```

---

## 🚀 Быстрый старт

### **Обычный клиент (стандартный дизайн)**

Ничего делать не нужно! 🎉

1. Клиент регистрируется → получает `userId`
2. Загружает контент через админку
3. Публикует → сайт билдится с `default/` шаблоном
4. Готово! ✅

---

### **VIP клиент (уникальный дизайн)**

**Шаг 1:** Узнай `userId` клиента (например: `user_2abc123xyz`)

**Шаг 2:** Скопируй пример:

```bash
# Создай папки
mkdir -p src/_includes/layouts/clients/user_2abc123xyz
mkdir -p src/_includes/components/clients/user_2abc123xyz

# Скопируй default как базу
cp src/_includes/layouts/default/base.njk src/_includes/layouts/clients/user_2abc123xyz/
cp src/_includes/components/default/* src/_includes/components/clients/user_2abc123xyz/

# Создай кастомный файл клиента
cp src/clients/client-001.njk.example src/clients/user_2abc123xyz.njk

# Отредактируй userId в файле:
nano src/clients/user_2abc123xyz.njk
# Замени "client-001" на "user_2abc123xyz"
```

**Шаг 3:** Верстай уникальный дизайн:

```bash
# Редактируй layout:
nano src/_includes/layouts/clients/user_2abc123xyz/base.njk

# Редактируй компоненты:
nano src/_includes/components/clients/user_2abc123xyz/header.njk
nano src/_includes/components/clients/user_2abc123xyz/hero.njk
nano src/_includes/components/clients/user_2abc123xyz/footer.njk
```

**Шаг 4:** Тестируй локально:

```bash
npm run build
# Проверь: _site/user_2abc123xyz/index.html
```

**Шаг 5:** Публикуй:

```bash
git add .
git commit -m "Add custom design for user_2abc123xyz"
git push origin dev
```

GitHub Actions задеплоит → клиент увидит уникальный сайт! 🎨

---

## 📁 Структура

```
website-code/src/
├─ clients.njk                    ← Для ВСЕХ обычных клиентов
├─ clients/                       ← Кастомные клиенты
│  └─ user_ABC123.njk            ← Кастомный файл для VIP клиента
└─ _includes/
   ├─ layouts/
   │  ├─ default/                ← Шаблон по умолчанию (все клиенты)
   │  │  └─ base.njk
   │  └─ clients/                ← Кастомные layouts
   │     └─ user_ABC123/         ← Layout для VIP клиента
   │        └─ base.njk
   └─ components/
      ├─ default/                ← Компоненты по умолчанию
      │  ├─ header.njk
      │  ├─ hero.njk
      │  └─ footer.njk
      └─ clients/                ← Кастомные компоненты
         └─ user_ABC123/         ← Компоненты для VIP клиента
            ├─ header.njk
            ├─ hero.njk
            └─ footer.njk
```

---

## 💰 Ценообразование (пример)

```
Стандартный дизайн (default)   → $100-200 (быстро)
Кастомный дизайн (clients/)    → $500-1000 (уникально)
```

**Профит:**
- Обычные клиенты → default шаблон → быстро и дешево
- VIP клиенты → кастомный дизайн → дорого и уникально

---

## 🔥 Примеры

Смотри файлы с расширением `.example`:
- `src/clients/client-001.njk.example`
- `src/_includes/layouts/clients/client-001/base.njk.example`
- `src/_includes/components/clients/client-001/*.njk.example`

Это готовые примеры кастомного дизайна (фиолетовая тема)!

---

## ❓ FAQ

**Q: Что если забуду создать кастомный файл для клиента?**  
A: Ничего! Он будет использовать `default/` шаблон автоматически.

**Q: Можно ли изменить default шаблон?**  
A: Да! Изменения в `default/` применятся ко ВСЕМ клиентам (кроме кастомных).

**Q: Как обновить кастомный дизайн клиента?**  
A: Просто редактируй файлы в `clients/user_XXX/` и пушь → автодеплой.

**Q: Можно ли переиспользовать компоненты?**  
A: Да! Можешь include компоненты из `default/` или других клиентов.

---

**Подробная инструкция:** `CUSTOM-CLIENTS-GUIDE.md`

**Готово! Теперь можешь создавать уникальные сайты! 🚀**

