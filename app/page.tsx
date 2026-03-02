"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, ChevronRight, BookHeart, Rocket, Landmark, BrainCircuit, Feather, Lightbulb, Search as SearchIcon, Baby, ArrowRightIcon } from "lucide-react";

const BOOK_COLORS = [
  { bg: "#2C1A0E", spine: "#8B2635" },
  { bg: "#1A1A2E", spine: "#C4962A" },
  { bg: "#0D2B1A", spine: "#8B2635" },
  { bg: "#2A1A0A", spine: "#556B2F" },
  { bg: "#1A0A1A", spine: "#C4962A" },
  { bg: "#0A1A2A", spine: "#8B2635" },
  { bg: "#1E1208", spine: "#D4A853" },
  { bg: "#12183A", spine: "#8B2635" },
  { bg: "#2A0F0F", spine: "#C4962A" },
  { bg: "#0F2A1A", spine: "#8B2635" },
  { bg: "#1A2A0F", spine: "#C4962A" },
  { bg: "#2A1F0A", spine: "#8B2635" },
];

const SHELF_HEIGHTS = [
  { h: 160, w: 38 }, { h: 180, w: 44 }, { h: 140, w: 36 },
  { h: 200, w: 48 }, { h: 165, w: 40 }, { h: 185, w: 42 },
  { h: 150, w: 36 }, { h: 195, w: 46 }, { h: 170, w: 40 },
  { h: 155, w: 38 }, { h: 190, w: 44 }, { h: 175, w: 42 },
];

const TICKER_ITEMS = [
  "Фёдор Достоевский", "Лев Толстой", "Маркес Гарсия", "Джордж Оруэлл",
  "Франц Кафка", "Эрнест Хемингуэй", "Альбер Камю", "Антуан де Сент-Экзюпери",
  "Джейн Остин", "Харпер Ли",
];

const BOOK_NAMES = ["Қылмыс пен жаза", "Соғыс және бейбітшілік", "Жалғыздықтың жүз жылы", "Тоқсан төрт", "Айналу", "Кішкентай ханзада"];

// Fallback shown while the real books are loading from the API
const STATIC_FLOATING_BOOKS = [
  { titleKz: "Қылмыс пен жаза", authorName: "Ф. Достоевский", coverUrl: null },
  { titleKz: "Жалғыздықтың жүз жылы", authorName: "Г. Маркес", coverUrl: null },
  { titleKz: "Соғыс және бейбітшілік", authorName: "Л. Толстой", coverUrl: null },
  { titleKz: "Тоқсан төрт", authorName: "Дж. Оруэлл", coverUrl: null },
  { titleKz: "Кішкентай ханзада", authorName: "А. Сент-Экзюпери", coverUrl: null },
];
const CATEGORY_ICONS = [BookHeart, Rocket, Landmark, BrainCircuit, Feather, Lightbulb, SearchIcon, Baby];
const CATEGORY_NAMES = ["Роман", "Ғылыми-фантастика", "Тарих", "Философия", "Поэзия", "Психология", "Детектив", "Балалар"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [mosaicBooks, setMosaicBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredBook, setFeaturedBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/books?limit=20").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([booksData, catsData]) => {
      setBooks(booksData.books || []);
      setFeaturedBook((booksData.books || [])[0]);
      setCategories(catsData || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Separate fetch for the mosaic — uses all books so admin-added books
    // with covers automatically appear without changing any code
    fetch("/api/books?limit=100")
      .then(r => r.json())
      .then(d => setMosaicBooks((d.books || []).filter((b: any) => b.coverUrl)))
      .catch(() => { });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : "/catalog");
  };

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__left">
          <div className="hero__eyebrow animate-fade-in">
            <span className="hero__eyebrow-ornament">§</span>
            Әлемдік әдебиет классикасы
          </div>

          <h1 className="hero__title animate-fade-up delay-1">
            Білімнің <br />
            <em>далалық</em>
            архиві
          </h1>

          <p className="hero__desc animate-fade-up delay-2">
            Достоевскийден Маркеске дейін — әлем мойындаған шедеврлер,
            20 000-нан астам кітап, бір платформада.
          </p>

          <form className="hero__search animate-fade-up delay-3" onSubmit={handleSearch}>
            <input
              className="hero__search-input"
              type="text"
              placeholder="Кітап атауы, автор немесе ISBN..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="hero__search-btn">
              <Search size={17} />
            </button>
          </form>

          <div className="hero__tags animate-fade-up delay-4">
            {CATEGORY_NAMES.slice(0, 5).map(name => (
              <button key={name} className="hero__tag" onClick={() => router.push(`/catalog?q=${name}`)}>
                {name}
              </button>
            ))}
          </div>

          <div className="hero__scroll-hint animate-fade-in delay-8">
            <BookOpen size={14} />
            <span>Төмен айналдырыңыз</span>
          </div>
        </div>

        {/* Cover mosaic panel */}
        <div className="hero__right">
          <div className="hero__right-pattern" />
          <div className="cover-mosaic">
            {([0, 1, 2, 3, 4] as const).map(colIdx => {
              // Each column gets every 5th book — so all 5 columns show different covers
              // When mosaicBooks grows (admin adds books), they automatically spread across columns
              const src = mosaicBooks.length >= 5
                ? mosaicBooks.filter((_, i) => i % 5 === colIdx)
                : Array.from({ length: 5 }, (_, i) => ({
                  id: colIdx * 5 + i,
                  coverUrl: null,
                  titleKz: "",
                }));
              // Duplicate so the seamless-loop animation works
              const items = [...src, ...src];
              return (
                <div key={colIdx} className={`cover-mosaic__col cover-mosaic__col--${colIdx}`}>
                  {items.map((book: any, i: number) => (
                    <div key={i}
                      className={`cover-mosaic__item${!book.coverUrl ? " cover-mosaic__item--ph" : ""}`}
                      style={!book.coverUrl ? { background: BOOK_COLORS[(colIdx * 5 + i) % BOOK_COLORS.length].bg } : undefined}
                    >
                      {book.coverUrl && <img src={book.coverUrl} alt={book.titleKz} loading="lazy" />}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="cover-mosaic__vignette-top" />
          <div className="cover-mosaic__vignette-bottom" />
          <div className="cover-mosaic__vignette-left" />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker__item">
              <span className="ticker__dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-bar animate-fade-in">
        <div className="container">
          <div className="stats-bar__grid">
            {[
              { num: "20+", label: "Кітаптар" },
              { num: "10", label: "Авторлар" },
              { num: "8", label: "Санаттар" },
              { num: "14", label: "Күн тегін" },
            ].map((s, i) => (
              <div key={i} className={`stat-item animate-fade-up delay-${i + 1}`}>
                <span className="stat-item__num">{s.num}</span>
                <span className="stat-item__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED BOOK ── */}
      {featuredBook && (
        <section className="section" style={{ padding: "5rem 0" }}>
          <div className="container">
            <div className="section-header animate-fade-up">
              <div>
                <div className="section-header__label">Редактор таңдауы</div>
                <h2 className="section-header__title">Ай кітабы</h2>
              </div>
            </div>
            <Link href={`/books/${featuredBook.id}`} className="feature-book" style={{ textDecoration: "none" }}>
              <div className="feature-book__cover" style={featuredBook.coverUrl ? { padding: 0, overflow: "hidden" } : {}}>
                {featuredBook.coverUrl ? (
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.titleKz}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <>
                    <div className="feature-book__spine" />
                    <div className="feature-book__cover-title">{featuredBook.titleKz}</div>
                    <div className="feature-book__cover-author">{featuredBook.authorName}</div>
                  </>
                )}
              </div>
              <div className="feature-book__info">
                <div className="feature-book__tag">{featuredBook.categoryName}</div>
                <div className="feature-book__title">{featuredBook.titleKz}</div>
                <div className="feature-book__author">{featuredBook.authorName}</div>
                <div className="feature-book__desc">{featuredBook.descriptionKz}</div>
                <span className="btn btn--gold btn--lg" style={{ width: "fit-content", display: "inline-flex" }}>
                  Толығырақ <ChevronRight size={18} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "5rem 0", background: "var(--cream-2)" }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <div>
              <div className="section-header__label">Жанрлар</div>
              <h2 className="section-header__title">Санаттар</h2>
            </div>
            <Link href="/catalog" className="section-header__link">
              Каталог <ArrowRight size={14} />
            </Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat: any, i: number) => {
              const Icon = CATEGORY_ICONS[i] || BookOpen;
              return (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.id}`}
                  className={`category-card animate-fade-up delay-${Math.min((i % 8) + 1, 8)}`}
                >
                  <div className="category-card__icon-wrap">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="category-card__label">{cat.nameKz}</div>
                  <div className="category-card__count">
                    Санатқа өту <ArrowRightIcon size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOOKSHELF ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <div>
              <div className="section-header__label">Жаңа түскен</div>
              <h2 className="section-header__title">Кітап сөресі</h2>
            </div>
            <Link href="/catalog" className="section-header__link">
              Барлығы <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bookshelf">
            <div className="bookshelf__track">
              {books.map((book: any, i: number) => {
                const c = BOOK_COLORS[i % BOOK_COLORS.length];
                return (
                  <Link key={book.id} href={`/books/${book.id}`} className="shelf-book">
                    <div className="shelf-book__cover" style={book.coverUrl ? {} : { background: c.bg }}>
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.titleKz}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "2px" }}
                        />
                      ) : (
                        <>
                          <div className="shelf-book__spine" style={{ background: c.spine }} />
                          <div className="shelf-book__cover-title">{book.titleKz}</div>
                        </>
                      )}
                    </div>
                    <div className="shelf-book__label">{book.titleKz}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-section__text animate-fade-up">
            "Ғылым таппай мақтанба, орын таппай баптанба"
          </div>
          <div className="quote-ornament" />
          <div className="quote-section__author animate-fade-up delay-2">
            — <span>Абай Құнанбаев</span>, Өлеңдер
          </div>
        </div>
      </section>

      {/* ── POPULAR BOOKS ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <div>
              <div className="section-header__label">Ұсынылады</div>
              <h2 className="section-header__title">Танымал кітаптар</h2>
            </div>
            <Link href="/catalog" className="section-header__link">
              Барлығы <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton">
                  <div className="skeleton__cover" />
                  <div className="skeleton__body">
                    <div className="skeleton__line skeleton__line--short" />
                    <div className="skeleton__line skeleton__line--long" />
                    <div className="skeleton__line skeleton__line--medium" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="books-grid">
              {books.map((book: any, i: number) => (
                <BookCard key={book.id} book={book} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <div className="footer__logo">Кітапхана</div>
              <div className="footer__tagline">
                Әлем классикасы мен қазіргі заман шедеврлерін бір платформада жинаған кітап қоры.
              </div>
            </div>
            <div>
              <div className="footer__col-title">Беттер</div>
              <ul className="footer__links">
                <li><Link href="/">Басты бет</Link></li>
                <li><Link href="/catalog">Каталог</Link></li>
                <li><Link href="/orders">Тапсырыстар</Link></li>
                <li><Link href="/auth/login">Кіру</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer__col-title">Санаттар</div>
              <ul className="footer__links">
                {CATEGORY_NAMES.map(n => (
                  <li key={n}><Link href={`/catalog?q=${n}`}>{n}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span className="footer__copy">© 2024 Кітапхана — Барлық құқықтар қорғалған</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BookCard({ book, idx }: { book: any; idx: number }) {
  const FALLBACK_BG = ["#2C1A0E", "#1A1A2E", "#0D2B1A", "#2A1A0A", "#1A0A1A", "#0A1A2A", "#1E1208", "#12183A"];
  const fallbackBg = FALLBACK_BG[idx % FALLBACK_BG.length];
  const available = book.availableCopies > 0;

  return (
    <Link
      href={`/books/${book.id}`}
      className={`book-card animate-fade-up delay-${Math.min(idx + 1, 8)}`}
    >
      <div className="book-card__cover">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.titleKz}
          />
        ) : (
          <div className="book-card__cover-ph" style={{ background: fallbackBg }}>
            <div className="book-card__cover-spine" />
            <span className="book-card__cover-ornament">§</span>
            <span className="book-card__cover-title">{book.titleKz}</span>
            <span className="book-card__cover-author">{book.authorName}</span>
            <span className="book-card__cover-line" />
          </div>
        )}
      </div>
      <div className="book-card__body">
        <div className="book-card__category">{book.categoryName}</div>
        <div className="book-card__title">{book.titleKz}</div>
        <div className="book-card__author">{book.authorName}</div>
        <div className="book-card__footer">
          <span className="book-card__year">{book.year}</span>
          <span className={`badge ${available ? "badge--available" : "badge--unavailable"}`}>
            <span className="badge__dot" />
            {available ? "Қолжетімді" : "Жоқ"}
          </span>
        </div>
      </div>
    </Link>
  );
}
