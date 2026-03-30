<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/book-open.svg" width="60" alt="LibrarySystem Logo"/>
  <h1>Library System</h1>
  <p>Кітапхананы басқаруға арналған смарт веб-платформа</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </div>
</div>

<br/>

**Library System** — бұл сандық кітапхана ортасын басқаруға, оқырмандарға кітаптарды ыңғайлы іздеуге және уақытша жалға алуға (borrow) мүмкіндік беретін кешенді веб-қосымша. 

## Системалық Архитектура

| Деңгей | Технология | Мақсаты / Қызметі |
| :--- | :--- | :--- |
| **Фронтенд** | Next.js 16 (App Router), React 19 | Оңтайландырылған пайдаланушы интерфейсі (UI) |
| **Стильдеу** | Vanilla CSS, Lucide Icons | Таза әрі мінімсіз (minimalist) дизайн |
| **Бэкенд** | Next.js API Routes | Кітаптарды алу, қайтару және каталогты басқару логикасы |
| **Дерекқор** | PostgreSQL (Neon) | Пайдаланушылар мен кітап қорларын сенімді сақтау |
| **ORM** | Drizzle | Дерекқор үлгілерін (schema) тип жағынан қауіпсіз басқару |
| **Қауіпсіздік** | NextAuth.js | Пайдаланушыларды тіркеу, сессияларды сақтау |

## Негізгі Мүмкіндіктер

### Оқырмандар үшін
*   **Смарт Каталог:** Кітаптарды авторлары, жанры бойынша іздеп табу. Әр кітаптың нақты қоймадағы қолжетімділігін көру.
*   **Кітап алу жүйесі (Borrowing):** Оқырман кітапты белгілі бір мерзімге жалға ала алады. Қайтару мерзімі мен күйі (status) жеке кабинетте сақталады.
*   **Тарих және Статистика:** Бұрын оқылған және қазір оқылып жатқан кітаптар тізіміне қол жеткізу.

### Әкімшілер (Admin) үшін
*   **Кітап қорын басқару:** Жаңа кітаптар қосу, ескіргендерін өшіру және сипаттамаларын редакциялау.
*   **Қарыздарды бақылау (Tracking):** Қай оқырманның қандай кітап алғанын, қайтару мерзімі өтіп кеткен-кетпегенін бақылау.
*   **Пайдаланушыларды реттеу:** Оқырмандар тізімі мен олардың белсенділігін қадағалау.

## Дерекқор Құрылымы (Schema)

| Кесте атауы | Сипаттамасы | Кілттер мен Байланыстар |
| :--- | :--- | :--- |
| `users` | Жүйедегі оқырмандар мен әкімшілер | `id`, `email`, `role` |
| `books` | Кітапханадағы барлық кітаптар каталогы | `id`, `title`, `author`, `total_copies`, `available_copies` |
| `borrowings` | Кім қандай кітапты алды және қашан қайтаруы тиіс | `user_id`, `book_id`, `borrow_date`, `due_date`, `status` |

## Жобаны Іске Қосу (Local Setup)

Жобаны өз компьютеріңізде іске қосу қадамдары төменде көрсетілген:

### 1. Қажетті құралдар
*   [Node.js](https://nodejs.org/en/) (v20 немесе жаңалау)
*   [pnpm](https://pnpm.io/) 
*   PostgreSQL дерекқоры

### 2. Қоршаған орта айнымалылары
`.env.local` файлын жасап, төмендегідей толтырыңыз:

```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=өз_құпия_сөзіңіз
```

### 3. Орнату және Іске қосу

```bash
# 1. Тәуелділіктерді (dependencies) орнату
pnpm install

# 2. Дерекқорға құрылымды жіберу
pnpm db:push

# 3. Серверді іске қосу
pnpm dev
```
Браузер арқылы [http://localhost:3000](http://localhost:3000) сілтемесіне өтіңіз.

---
*Білімге қол жеткізу — бір батырма қашықтықта.*
