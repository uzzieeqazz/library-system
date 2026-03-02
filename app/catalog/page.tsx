"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

const BOOK_COLORS = [
    "#2C1A0E", "#1A1A2E", "#0D2B1A", "#2A1A0A",
    "#1A0A1A", "#0A1A2A", "#1E1208", "#12183A",
];

function BookCard({ book, idx }: { book: any; idx: number }) {
    const bg = BOOK_COLORS[idx % BOOK_COLORS.length];
    const available = book.availableCopies > 0;
    return (
        <Link href={`/books/${book.id}`} className={`book-card animate-fade-up delay-${Math.min((idx % 8) + 1, 8)}`}>
            <div className="book-card__cover">
                {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.titleKz} />
                ) : (
                    <div className="book-card__cover-ph" style={{ background: bg }}>
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

function CatalogContent() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [categoryId, setCategoryId] = useState(searchParams.get("category") || "");
    const [authorId, setAuthorId] = useState("");
    const [available, setAvailable] = useState("");
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const limit = 12;

    useEffect(() => {
        Promise.all([
            fetch("/api/categories").then(r => r.json()),
            fetch("/api/authors").then(r => r.json()),
        ]).then(([cats, auths]) => { setCategories(cats); setAuthors(auths); });
    }, []);

    const fetchBooks = useCallback(() => {
        setLoading(true);
        const p = new URLSearchParams();
        if (query) p.set("q", query);
        if (categoryId) p.set("category", categoryId);
        if (authorId) p.set("author", authorId);
        if (available) p.set("available", available);
        p.set("page", String(page));
        p.set("limit", String(limit));
        fetch(`/api/books?${p.toString()}`)
            .then(r => r.json())
            .then(d => { setBooks(d.books || []); setTotal(d.total || 0); setLoading(false); })
            .catch(() => setLoading(false));
    }, [query, categoryId, authorId, available, page]);

    useEffect(() => { fetchBooks(); }, [fetchBooks]);

    const totalPages = Math.ceil(total / limit);

    return (
        <main>
            <div className="container">
                <div className="page-header">
                    <div className="page-header__eyebrow">Кітапхана қоры</div>
                    <h1 className="page-header__title">Каталог</h1>
                </div>

                {/* Toolbar */}
                <div className="catalog-toolbar">
                    <div className="search-field" style={{ flex: 1, minWidth: 260, position: "relative" }}>
                        <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" }} />
                        <input
                            className="search-field__input"
                            type="text"
                            placeholder="Кітап атауын іздеңіз..."
                            value={query}
                            onChange={e => { setQuery(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select className="select-field" value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1); }}>
                        <option value="">Барлық санат</option>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameKz}</option>)}
                    </select>
                    <select className="select-field" value={authorId} onChange={e => { setAuthorId(e.target.value); setPage(1); }}>
                        <option value="">Барлық автор</option>
                        {authors.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <select className="select-field" value={available} onChange={e => { setAvailable(e.target.value); setPage(1); }}>
                        <option value="">Барлығы</option>
                        <option value="true">Қолжетімді ғана</option>
                    </select>
                </div>

                {/* Count */}
                <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <SlidersHorizontal size={14} style={{ color: "var(--text-dim)" }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                        {loading ? "Іздеу..." : `${total} кітап табылды`}
                    </span>
                </div>

                {/* Category chips */}
                {categories.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
                        <button className={`chip ${categoryId === "" ? "active" : ""}`} onClick={() => { setCategoryId(""); setPage(1); }}>
                            Барлығы
                        </button>
                        {categories.map((c: any) => (
                            <button key={c.id} className={`chip ${categoryId === String(c.id) ? "active" : ""}`}
                                onClick={() => { setCategoryId(String(c.id)); setPage(1); }}>
                                {c.nameKz}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="loading-grid">
                        {Array.from({ length: 12 }).map((_, i) => (
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
                ) : books.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><Search size={48} /></div>
                        <div className="empty-state__title">Кітап табылмады</div>
                        <div className="empty-state__sub">Іздеу параметрлерін өзгертіп көріңіз</div>
                    </div>
                ) : (
                    <div className="books-grid">
                        {books.map((book: any, i: number) => <BookCard key={book.id} book={book} idx={i} />)}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="pagination__btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} className={`pagination__btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                                {p}
                            </button>
                        ))}
                        <button className="pagination__btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <footer className="footer">
                <div className="container">
                    <div className="footer__bottom">
                        <span className="footer__copy">© 2024 Кітапхана</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}

export default function CatalogPage() {
    return <Suspense><CatalogContent /></Suspense>;
}
