"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BOOK_COLORS = [
    "#2C1A0E", "#1A1A2E", "#0D2B1A", "#2A1A0A",
    "#1A0A1A", "#0A1A2A", "#1E1208", "#12183A",
];

export default function BookDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [book, setBook] = useState<any>(null);
    const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dueDate, setDueDate] = useState("");
    const [ordering, setOrdering] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/books/${params.id}`)
            .then(r => r.json())
            .then(d => {
                setBook(d);
                setLoading(false);
                if (d.categoryId) {
                    fetch(`/api/books?category=${d.categoryId}&limit=4`)
                        .then(r => r.json())
                        .then(rd => setRelatedBooks((rd.books || []).filter((b: any) => b.id !== d.id).slice(0, 3)));
                }
            })
            .catch(() => setLoading(false));
        setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
    }, [params.id]);

    const handleOrder = async () => {
        if (!session) { router.push("/auth/login"); return; }
        setOrdering(true); setError("");
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book.id, dueDate }),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
            setSuccess(true);
            setBook((b: any) => ({ ...b, availableCopies: b.availableCopies - 1 }));
        } catch (e: any) {
            setError(e.message);
        } finally { setOrdering(false); }
    };

    if (loading) return (
        <div style={{ paddingTop: "8rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Жүктелуде...
            </div>
        </div>
    );
    if (!book || book.error) return (
        <div style={{ paddingTop: "8rem", textAlign: "center", minHeight: "60vh" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--text-muted)" }}>Кітап табылмады</div>
            <Link href="/catalog" className="btn btn--outline" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
                <ArrowLeft size={16} /> Каталогқа оралу
            </Link>
        </div>
    );

    const available = book.availableCopies > 0;
    const bg = BOOK_COLORS[book.id % BOOK_COLORS.length];

    return (
        <>
            <main>
                {/* Breadcrumb */}
                <div style={{ paddingTop: "84px", background: "var(--cream-2)", borderBottom: "1px solid var(--border)" }}>
                    <div className="container" style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        <Link href="/" style={{ color: "var(--text-dim)" }}>Басты бет</Link>
                        <span>/</span>
                        <Link href="/catalog" style={{ color: "var(--text-dim)" }}>Каталог</Link>
                        <span>/</span>
                        <span style={{ color: "var(--text-muted)" }}>{book.titleKz}</span>
                    </div>
                </div>

                <div className="container">
                    <div className="book-detail">
                        {/* Cover */}
                        <aside className="book-detail__cover animate-slide-left">
                            {book.coverUrl ? (
                                <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xl)", background: "#1A1208" }}>
                                    <Image
                                        src={book.coverUrl}
                                        alt={book.titleKz}
                                        width={400}
                                        height={600}
                                        style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "contain" }}
                                    />
                                </div>
                            ) : (
                                <div className="book-detail__cover-card" style={{ background: bg }}>
                                    <div className="book-detail__cover-spine" />
                                    <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: "var(--font-serif)", fontSize: "3rem", color: "rgba(255,255,255,0.06)", fontStyle: "italic" }}>§</div>
                                    <div className="book-detail__cover-title">{book.titleKz}</div>
                                    <div className="book-detail__cover-line" />
                                    <div className="book-detail__cover-author">{book.authorName}</div>
                                </div>
                            )}

                            {/* Availability */}
                            <div style={{ marginTop: "1.5rem", padding: "1.25rem", background: available ? "rgba(39,174,96,0.06)" : "rgba(139,38,53,0.06)", border: `1.5px solid ${available ? "rgba(39,174,96,0.2)" : "rgba(139,38,53,0.2)"}`, borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: available ? "#1a7a45" : "var(--burgundy)", fontWeight: "700", marginBottom: "0.4rem" }}>
                                    {available ? "Қолжетімді" : "Бос дана жоқ"}
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--espresso)" }}>
                                    {book.availableCopies} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/ {book.totalCopies} дана</span>
                                </div>
                            </div>
                        </aside>


                        {/* Info */}
                        <div className="book-detail__info animate-slide-right">
                            <div className="book-detail__category">{book.categoryName}</div>
                            <h1 className="book-detail__title">{book.titleKz}</h1>
                            <div className="book-detail__author">— {book.authorName}</div>

                            <div className="book-detail__meta">
                                <div className="book-detail__meta-item">
                                    <div className="book-detail__meta-label">Жыл</div>
                                    <div className="book-detail__meta-val">{book.year || "—"}</div>
                                </div>
                                <div className="book-detail__meta-item">
                                    <div className="book-detail__meta-label">Санат</div>
                                    <div className="book-detail__meta-val" style={{ fontSize: "1rem" }}>{book.categoryName}</div>
                                </div>
                                <div className="book-detail__meta-item">
                                    <div className="book-detail__meta-label">Бос дана</div>
                                    <div className="book-detail__meta-val" style={{ color: available ? "#1a7a45" : "var(--burgundy)" }}>
                                        {book.availableCopies}/{book.totalCopies}
                                    </div>
                                </div>
                            </div>

                            <div className="book-detail__isbn">ISBN: {book.isbn || "Белгісіз"}</div>

                            {book.descriptionKz && <div className="book-detail__desc">{book.descriptionKz}</div>}

                            {book.authorBio && (
                                <div className="book-detail__author-box">
                                    <div className="book-detail__author-box-label">Автор туралы</div>
                                    <div className="book-detail__author-box-text">{book.authorBio}</div>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                                <button className="btn btn--primary btn--lg" onClick={() => setDrawerOpen(true)} disabled={!available}>
                                    <BookOpen size={18} />
                                    {available ? "Тапсырыс беру" : "Бос дана жоқ"}
                                </button>
                                <Link href="/catalog" className="btn btn--outline">
                                    <ArrowLeft size={16} /> Каталогқа оралу
                                </Link>
                            </div>

                            {/* Related books */}
                            {relatedBooks.length > 0 && (
                                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
                                    <div style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--burgundy)", fontWeight: "700", marginBottom: "1.25rem" }}>
                                        Ұқсас кітаптар
                                    </div>
                                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                        {relatedBooks.map((rb: any) => (
                                            <Link key={rb.id} href={`/books/${rb.id}`} style={{
                                                display: "flex", gap: "0.75rem", alignItems: "center",
                                                padding: "0.75rem 1rem", background: "var(--cream-2)",
                                                border: "1.5px solid var(--border)", borderRadius: "var(--radius)",
                                                textDecoration: "none", transition: "var(--transition)", flex: "1", minWidth: "200px",
                                            }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--burgundy)"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                                            >
                                                <div style={{ width: "36px", height: "54px", background: BOOK_COLORS[rb.id % BOOK_COLORS.length], borderRadius: "3px", flexShrink: 0, overflow: "hidden", borderLeft: rb.coverUrl ? "none" : "3px solid var(--burgundy)" }}>
                                                    {rb.coverUrl && <Image src={rb.coverUrl} alt={rb.titleKz} width={36} height={54} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--espresso)", marginBottom: "0.15rem" }}>{rb.titleKz}</div>
                                                    <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{rb.authorName}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="footer__bottom">
                            <span className="footer__copy">© 2024 Кітапхана</span>
                        </div>
                    </div>
                </footer>
            </main>

            {/* ORDER DRAWER */}
            <div className={`drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
            <aside className={`drawer ${drawerOpen ? "open" : ""}`}>
                <div className="drawer__header">
                    <h2 className="drawer__title">Тапсырыс беру</h2>
                    <button className="drawer__close" onClick={() => setDrawerOpen(false)}><X size={16} /></button>
                </div>
                <div className="drawer__body">
                    <div className="drawer__book">
                        <div className="drawer__book-title">{book.titleKz}</div>
                        <div className="drawer__book-author">{book.authorName}</div>
                    </div>
                    {success ? (
                        <div className="alert alert--success">
                            Тапсырыс сәтті берілді! Кітапхана бекітуін күтіңіз.
                        </div>
                    ) : (
                        <>
                            {error && <div className="alert alert--error">{error}</div>}
                            <label className="drawer__label">Қайтару мерзімі</label>
                            <input type="date" className="drawer__input" value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]} />
                            <div style={{ padding: "1rem", background: "var(--cream-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                                <strong style={{ color: "var(--espresso)" }}>Тапсырыс ережелері:</strong><br />
                                • Кітапты 14 күнге дейін алуға болады<br />
                                • Мерзімі өткенде ескерту жіберіледі<br />
                                • Кітапхана бекіткеннен кейін алуға болады
                            </div>
                        </>
                    )}
                </div>
                <div className="drawer__footer">
                    {!success ? (
                        <button className="btn btn--primary btn--full" onClick={handleOrder} disabled={ordering}>
                            <Calendar size={16} />
                            {ordering ? "Жіберілуде..." : "Растап тапсырыс беру"}
                        </button>
                    ) : (
                        <button className="btn btn--outline btn--full" onClick={() => { setDrawerOpen(false); setSuccess(false); }}>
                            Жабу
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}
