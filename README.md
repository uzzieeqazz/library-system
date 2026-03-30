# 📚 Кітапхана — Цифрлық кітапхана жүйесі

Кітапханашылар мен оқырмандарға арналған толыққанды веб-қосымша. Пайдаланушылар кітаптарды шолып, тапсырыс бере алады. Әкімші кітаптарды және тапсырыстарды басқара алады.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.40-green)

---

## ✨ Мүмкіндіктер

- 🔍 **Каталог** — кітаптарды іздеу, санат, автор бойынша сүзу, pagination
- 📖 **Кітап беті** — толық ақпарат, автор туралы, ұқсас кітаптар
- 🛒 **Тапсырыс беру** — кітапты тапсырысқа алу, қайтару мерзімін белгілеу
- 👤 **Аутентификация** — тіркелу, кіру (JWT + bcrypt)
- 🛡️ **Рөлдер** — `reader` (оқырман) және `admin` (әкімші) рөлдері
- ⚙️ **Әкімші панелі** — кітап қосу/жою, тапсырыстар күйін өзгерту

---

## 🛠️ Технологиялар

| Қабат | Технология |
|-------|-----------|
| Фронтенд | Next.js 15, React 19, TypeScript |
| Стиль | Vanilla CSS (CSS Variables) |
| Аутентификация | NextAuth.js v4 (JWT стратегиясы) |
| ORM | Drizzle ORM |
| Дерекқор | PostgreSQL 16 |
| Валидация | Zod |
| Иконкалар | Lucide React |

---

## 🚀 Жергілікті іске қосу

### 1. Репозиторийді клондау

```bash
git clone https://github.com/your-username/library-system.git
cd library-system
```

### 2. Тәуелділіктерді орнату

```bash
pnpm install
```

### 3. Орта айнымалыларын баптау

`.env.local` файлын жасап, мынаны толтырыңыз:

```env
# PostgreSQL байланысы
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/library_system

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Дерекқорды дайындау

```bash
# Миграциялар
pnpm run db:migrate

# Тест деректерін жүктеу (кітаптар, категориялар)
pnpm run db:seed
```

### 5. Серверді іске қосу

```bash
pnpm run dev
```

Браузерде ашыңыз: [http://localhost:3000](http://localhost:3000)

### Тест аккаунты

```
Email: admin@library.kz
Құпия сөз: admin123
```

---

## 📡 API Эндпоинттері

### Кітаптар

| Метод | URL | Сипаттама | Auth |
|-------|-----|-----------|------|
| `GET` | `/api/books` | Кітаптар тізімі (сүзу, pagination) | Жоқ |
| `GET` | `/api/books/:id` | Жеке кітаптың толық ақпараты | Жоқ |
| `POST` | `/api/admin/books` | Жаңа кітап қосу | Admin |
| `DELETE` | `/api/admin/books?id=X` | Кітапты жою | Admin |

### Тапсырыстар

| Метод | URL | Сипаттама | Auth |
|-------|-----|-----------|------|
| `GET` | `/api/orders` | Өзімнің тапсырыстарым | Пайдаланушы |
| `GET` | `/api/orders?all=true` | Барлық тапсырыстар | Admin |
| `POST` | `/api/orders` | Жаңа тапсырыс беру | Пайдаланушы |
| `PATCH` | `/api/orders/:id` | Тапсырыс күйін өзгерту | Admin |

### Анықтама

| Метод | URL | Сипаттама |
|-------|-----|-----------|
| `GET` | `/api/categories` | Санаттар тізімі |
| `GET` | `/api/authors` | Авторлар тізімі |

**Сұрау параметрлері** (`GET /api/books`):
- `q` — іздеу сөзі
- `category` — санат ID
- `author` — автор ID
- `available=true` — тек қолжетімді кітаптар
- `page`, `limit` — pagination

---

## 🗃️ Дерекқор схемасы

```
users         — пайдаланушылар (id, name, email, password, role)
books         — кітаптар (id, titleKz, authorId, categoryId, isbn, year, copies)
authors       — авторлар (id, name, bio)
categories    — санаттар (id, nameKz)
orders        — тапсырыстар (id, userId, bookId, status, orderedAt, dueDate)
```

---

## 📁 Жоба құрылымы

```
library-system/
├── app/
│   ├── api/           # REST API маршруттары
│   ├── auth/          # Кіру / тіркелу беттері
│   ├── books/[id]/    # Кітап беті
│   ├── catalog/       # Каталог беті
│   ├── orders/        # Тапсырыстар беті
│   ├── admin/         # Әкімші панелі
│   └── page.tsx       # Басты бет
├── components/        # Қайта қолданылатын компоненттер
├── lib/
│   ├── auth.ts        # NextAuth конфигурациясы
│   └── db/            # Drizzle ORM схемасы, сұраулар
└── scripts/           # Дерекқор скриптері
```

---

## 📄 Лицензия

MIT © 2024 Кітапхана
