"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, X, RotateCcw, Trash2, Plus, RefreshCw, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    pending: { label: "Күтуде", cls: "badge--pending" },
    approved: { label: "Бекітілді", cls: "badge--approved" },
    returned: { label: "Қайтарылды", cls: "badge--returned" },
    cancelled: { label: "Бас тартылды", cls: "badge--cancelled" },
};

const EMPTY_FORM = {
    titleKz: "", authorName: "", authorBio: "", categoryId: "",
    year: "", isbn: "", coverUrl: "", descriptionKz: "", totalCopies: "3",
};

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAdmin = (session?.user as any)?.role === "admin";

    const [tab, setTab] = useState<"orders" | "books">("orders");

    // ── ORDERS ──
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    // ── BOOKS ──
    const [books, setBooks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
        if (status === "authenticated" && !isAdmin) router.push("/");
    }, [status, isAdmin, router]);

    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/orders?all=true").then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setOrdersLoading(false); }).catch(() => setOrdersLoading(false));
        fetch("/api/categories").then(r => r.json()).then(setCategories);
        loadBooks();
    }, [status]);

    const loadBooks = useCallback(() => {
        fetch("/api/books?limit=100").then(r => r.json()).then(d => setBooks(d.books || []));
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        setUpdating(id);
        try {
            const res = await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
            if (!res.ok) throw new Error();
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch { alert("Қате орын алды"); } finally { setUpdating(null); }
    };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true); setFormError(""); setFormSuccess("");
        const res = await fetch("/api/admin/books", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const data = await res.json();
        setSubmitting(false);
        if (!res.ok) { setFormError(data.error || "Қате орын алды"); return; }
        setFormSuccess(`«${data.titleKz}» сәтті қосылды`);
        setForm(EMPTY_FORM);
        loadBooks();
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`«${title}» кітабын жою керек пе?`)) return;
        setDeleting(id);
        await fetch(`/api/admin/books?id=${id}`, { method: "DELETE" });
        setDeleting(null);
        loadBooks();
    };

    if (status === "loading") return null;

    const filteredBooks = books.filter(b =>
        b.titleKz?.toLowerCase().includes(search.toLowerCase()) ||
        b.authorName?.toLowerCase().includes(search.toLowerCase())
    );

    const tabStyle = (t: string) => ({
        padding: "0.55rem 1.25rem", border: "none", cursor: "pointer",
        fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600,
        letterSpacing: "0.07em", textTransform: "uppercase" as const,
        borderRadius: "100px", transition: "all 0.2s",
        background: tab === t ? "var(--espresso)" : "transparent",
        color: tab === t ? "#fff" : "var(--text-muted)",
    });

    return (
        <main style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: "84px" }}>
            {/* Header */}
            <div style={{ background: "var(--espresso)", padding: "1.75rem 0" }}>
                <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Shield size={24} style={{ color: "var(--gold)" }} />
                    <div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#fff", margin: 0 }}>Әкімші панелі</h1>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", margin: "0.2rem 0 0", fontFamily: "var(--font-sans)" }}>
                            {(session?.user as any)?.name}
                        </p>
                    </div>
                    <Link href="/" style={{ marginLeft: "auto", color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", textDecoration: "none", fontFamily: "var(--font-sans)" }}>← Басты бетке</Link>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: "1px solid var(--border)", background: "var(--white)" }}>
                <div className="container" style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 2rem" }}>
                    <button style={tabStyle("orders")} onClick={() => setTab("orders")}>
                        Тапсырыстар ({orders.length})
                    </button>
                    <button style={tabStyle("books")} onClick={() => setTab("books")}>
                        Кітаптар ({books.length})
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: "2rem 2rem" }}>

                {/* ── ORDERS TAB ── */}
                {tab === "orders" && (
                    <div style={{ overflowX: "auto" }}>
                        {ordersLoading ? (
                            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Жүктелуде...</div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Кітап</th><th>Оқырман</th>
                                        <th>Тапсырыс күні</th><th>Мерзімі</th><th>Күй</th><th>Әрекет</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 && (
                                        <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-dim)" }}>Тапсырыстар жоқ</td></tr>
                                    )}
                                    {orders.map((order: any) => {
                                        const st = STATUS_MAP[order.status] || { label: order.status, cls: "" };
                                        const isUpdating = updating === order.id;
                                        return (
                                            <tr key={order.id}>
                                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-dim)" }}>#{order.id}</td>
                                                <td>{order.book?.titleKz || "—"}</td>
                                                <td style={{ fontSize: "0.85rem" }}>{order.user?.name || order.userId}</td>
                                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{new Date(order.orderedAt).toLocaleDateString("kk-KZ")}</td>
                                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{order.dueDate ? new Date(order.dueDate).toLocaleDateString("kk-KZ") : "—"}</td>
                                                <td><span className={`badge ${st.cls}`}><span className="badge__dot" />{st.label}</span></td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        {order.status === "pending" && (
                                                            <>
                                                                <button className="btn btn--sm" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(39,174,96,0.2)" }} onClick={() => updateStatus(order.id, "approved")} disabled={isUpdating}><Check size={13} /> Бекіту</button>
                                                                <button className="btn btn--sm btn--outline" style={{ color: "var(--red)", borderColor: "rgba(192,57,43,0.3)" }} onClick={() => updateStatus(order.id, "cancelled")} disabled={isUpdating}><X size={13} /> Бас тарту</button>
                                                            </>
                                                        )}
                                                        {order.status === "approved" && (
                                                            <button className="btn btn--sm btn--outline" onClick={() => updateStatus(order.id, "returned")} disabled={isUpdating}><RotateCcw size={13} /> Қайтарылды</button>
                                                        )}
                                                        {(order.status === "returned" || order.status === "cancelled") && (
                                                            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ── BOOKS TAB ── */}
                {tab === "books" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }}>

                        {/* List */}
                        <section>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--espresso)", margin: 0 }}>
                                    Каталог <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>({books.length})</span>
                                </h2>
                                <button onClick={loadBooks} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", fontFamily: "var(--font-sans)" }}>
                                    <RefreshCw size={13} /> Жаңарту
                                </button>
                            </div>
                            <input
                                placeholder="Кітап немесе автор бойынша іздеу..."
                                value={search} onChange={e => setSearch(e.target.value)}
                                style={{ width: "100%", padding: "0.6rem 1rem", marginBottom: "0.75rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", background: "var(--white)", color: "var(--espresso)", outline: "none", boxSizing: "border-box" as const }}
                            />
                            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--white)" }}>
                                {filteredBooks.length === 0 ? (
                                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Кітаптар табылмады</div>
                                ) : filteredBooks.map((book, i) => (
                                    <div key={book.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", borderBottom: i < filteredBooks.length - 1 ? "1px solid var(--border)" : "none" }}>
                                        <div style={{ width: "28px", height: "42px", borderRadius: "3px", overflow: "hidden", flexShrink: 0, background: "#2C1A0E" }}>
                                            {book.coverUrl && <img src={book.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Link href={`/books/${book.id}`} style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", color: "var(--espresso)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {book.titleKz}
                                            </Link>
                                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)", marginTop: "1px" }}>
                                                {book.authorName} · {book.categoryName || "—"} · {book.availableCopies}/{book.totalCopies}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(book.id, book.titleKz)} disabled={deleting === book.id}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: deleting === book.id ? "var(--text-muted)" : "var(--burgundy)", padding: "4px", borderRadius: "4px", flexShrink: 0, opacity: deleting === book.id ? 0.5 : 1 }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Add form */}
                        <aside style={{ position: "sticky", top: "6rem", maxHeight: "calc(100vh - 8rem)", overflowY: "auto" }}>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--espresso)", margin: "0 0 1rem" }}>Кітап қосу</h2>
                            <form onSubmit={handleAddBook} style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                {([
                                    { key: "titleKz", label: "Кітап атауы (қаз.) *", req: true, ph: "Соғыс және бейбітшілік" },
                                    { key: "authorName", label: "Автор *", req: true, ph: "Лев Толстой" },
                                    { key: "authorBio", label: "Автор туралы", req: false, ph: "Орыс жазушысы..." },
                                    { key: "year", label: "Жылы", req: false, ph: "1869", type: "number" as const },
                                    { key: "isbn", label: "ISBN", req: false, ph: "978-..." },
                                    { key: "coverUrl", label: "Обложка URL", req: false, ph: "https://covers.openlibrary.org/..." },
                                    { key: "totalCopies", label: "Дана саны *", req: true, ph: "3", type: "number" as const },
                                ]).map(({ key, label, req, ph, type = "text" }) => (
                                    <div key={key}>
                                        <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem", fontFamily: "var(--font-sans)", fontWeight: 600 }}>{label}</label>
                                        <input type={type} required={req} placeholder={ph} value={(form as any)[key]}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                            style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", fontFamily: "var(--font-sans)", fontSize: "0.82rem", background: "var(--cream)", color: "var(--espresso)", outline: "none", boxSizing: "border-box" as const }} />
                                    </div>
                                ))}

                                {/* Category */}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Санат</label>
                                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                        style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", fontFamily: "var(--font-sans)", fontSize: "0.82rem", background: "var(--cream)", color: "var(--espresso)", outline: "none", boxSizing: "border-box" as const }}>
                                        <option value="">— Таңдаңыз —</option>
                                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameKz}</option>)}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Сипаттама</label>
                                    <textarea rows={3} placeholder="Кітап туралы қысқаша..." value={form.descriptionKz}
                                        onChange={e => setForm(f => ({ ...f, descriptionKz: e.target.value }))}
                                        style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", fontFamily: "var(--font-sans)", fontSize: "0.82rem", background: "var(--cream)", color: "var(--espresso)", outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
                                </div>

                                {/* Cover preview */}
                                {form.coverUrl && (
                                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", padding: "0.6rem", background: "var(--cream-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                                        <img src={form.coverUrl} alt="preview" style={{ width: "36px", height: "54px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Алдын ала қарау</span>
                                    </div>
                                )}

                                {formError && <div style={{ padding: "0.6rem 0.9rem", background: "rgba(139,38,53,0.08)", border: "1px solid rgba(139,38,53,0.2)", borderRadius: "var(--radius)", fontSize: "0.8rem", color: "var(--burgundy)", fontFamily: "var(--font-sans)" }}>{formError}</div>}
                                {formSuccess && <div style={{ padding: "0.6rem 0.9rem", background: "rgba(39,174,96,0.08)", border: "1px solid rgba(39,174,96,0.2)", borderRadius: "var(--radius)", fontSize: "0.8rem", color: "#1a7a45", fontFamily: "var(--font-sans)" }}>{formSuccess}</div>}

                                <button type="submit" disabled={submitting} className="btn btn--primary" style={{ marginTop: "0.25rem" }}>
                                    <Plus size={14} />{submitting ? "Қосылуда..." : "Кітап қосу"}
                                </button>
                            </form>
                        </aside>
                    </div>
                )}
            </div>

            <footer className="footer">
                <div className="container">
                    <div className="footer__bottom"><span className="footer__copy">© 2024 Кітапхана</span></div>
                </div>
            </footer>
        </main>
    );
}
