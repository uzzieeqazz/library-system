# Инструкция по установке — Кітапхана (Библиотечная система)

---

## Что вам понадобится

### Вариант A — через Docker (рекомендуется, проще)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — одна программа, всё остальное внутри

### Вариант B — без Docker (ручная установка)
- [Node.js 20+](https://nodejs.org/) — среда выполнения
- [PostgreSQL 15+](https://www.postgresql.org/download/) — база данных
- [Git](https://git-scm.com/) — для клонирования репозитория

---

## Вариант A — Через Docker (рекомендуется)

> Данная система автоматически запустит и приложение, и базу данных.  
> Данные базы данных **сохраняются** на диске и не пропадают при перезапуске.

### Шаг 1 — Установить Docker Desktop

1. Перейдите на [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Скачайте и установите Docker Desktop для Windows
3. После установки перезагрузите компьютер
4. Запустите Docker Desktop и дождитесь пока иконка в трее станет зелёной

### Шаг 2 — Получить код проекта

Откройте **PowerShell** или **Командную строку** и выполните:

```bash
git clone <ссылка-на-репозиторий>
cd library-system
```

### Шаг 3 — Создать файл с настройками

Создайте файл `.env.local` в папке проекта со следующим содержимым:

```
DATABASE_URL=postgresql://postgres:1234@db:5432/library
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=library-secret-key-2024-very-secure
```

> Обратите внимание: в `DATABASE_URL` написано `@db:5432` (не `localhost`) — так Docker находит базу данных внутри своей сети.

### Шаг 4 — Запустить проект

```bash
docker compose up --build
```

Первый запуск займёт 3–5 минут (скачивание образов, установка зависимостей).

### Шаг 5 — Заполнить базу данных начальными данными

Откройте **второй терминал** (первый оставьте работать) и выполните:

```bash
docker compose exec app npm run db:push
docker compose exec app npm run db:seed
```

### Шаг 6 — Открыть сайт

Перейдите в браузере на: **http://localhost:3000**

### Готовые аккаунты для входа

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@library.kz | admin123 |
| Читатель | reader@library.kz | reader123 |

### Остановить / Запустить снова

```bash
# Остановить
docker compose down

# Запустить снова (данные сохранены)
docker compose up
```

---

## Вариант B — Без Docker (ручная установка)

### Шаг 1 — Установить программы

1. Скачайте и установите [Node.js 20+](https://nodejs.org/)
2. Скачайте и установите [PostgreSQL 15+](https://www.postgresql.org/download/)
   - При установке запомните пароль для пользователя `postgres`

### Шаг 2 — Создать базу данных

Откройте **pgAdmin** (устанавливается вместе с PostgreSQL) или **psql** и выполните:

```sql
CREATE DATABASE library;
```

### Шаг 3 — Получить код проекта

```bash
git clone <ссылка-на-репозиторий>
cd library-system
```

### Шаг 4 — Создать файл с настройками

Создайте файл `.env.local` в папке проекта:

```
DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/library
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=library-secret-key-2024-very-secure
```

> Замените `ВАШ_ПАРОЛЬ` на пароль который вы задали при установке PostgreSQL.

### Шаг 5 — Установить зависимости и настроить БД

```bash
npm install
npm run db:push
npm run db:seed
```

### Шаг 6 — Запустить проект

```bash
npm run dev
```

Перейдите в браузере на: **http://localhost:3000**

---

## Структура проекта (для справки)

```
library-system/
├── app/               # Страницы и API (Next.js)
├── components/        # React-компоненты
├── lib/db/            # Схема БД, seed-данные
├── public/            # Статические файлы
├── .env.local         # Настройки (создать вручную!)
├── docker-compose.yml # Конфигурация Docker
└── package.json       # Зависимости проекта
```

---

## Частые проблемы

**Порт 3000 занят**
```bash
# Узнать что занимает порт
netstat -ano | findstr :3000
# Или изменить порт в NEXTAUTH_URL на 3001 и запустить: npm run dev -- -p 3001
```

**Docker не запускается**
- Убедитесь что Docker Desktop запущен и иконка в трее зелёная
- На Windows убедитесь что включена виртуализация в BIOS

**Ошибка подключения к БД**
- Проверьте что в `.env.local` правильный пароль
- Убедитесь что PostgreSQL запущен (Вариант B)
