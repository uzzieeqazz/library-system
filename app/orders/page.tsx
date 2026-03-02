"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    pending: { label: "Күтуде", cls: "badge--pending" },
    approved: { label: "Бекітілді", cls: "badge--approved" },
    returned: { label: "Қайтарылды", cls: "badge--returned" },
    cancelled: { label: "Бас тартылды", cls: "badge--cancelled" },
};

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/orders").then(r => r.json()).then(d => { setOrders(d); setLoading(false); }).catch(() => setLoading(false));
    }, [status]);

    if (status === "loading" || loading) return (
        <div style={{ paddingTop: "8rem", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text-muted)", fontStyle: "italic" }}>Жүктелуде...</div>
        </div>
    );

    return (
        <main>
            <div className="container">
                <div className="page-header">
                    <div className="page-header__eyebrow">Жеке кабинет</div>
                    <h1 className="page-header__title">Менің тапсырыстарым</h1>
                </div>

                {/* Summary cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "3rem" }}>
                    {[
                        { label: "Барлығы", count: orders.length, color: "var(--espresso)" },
                        { label: "Күтуде", count: orders.filter(o => o.status === "pending").length, color: "#7A5C0A" },
                        { label: "Бекітілді", count: orders.filter(o => o.status === "approved").length, color: "#1a7a45" },
                        { label: "Қайтарылды", count: orders.filter(o => o.status === "returned").length, color: "var(--text-muted)" },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: "1.5rem", background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: s.color, lineHeight: 1, marginBottom: "0.4rem" }}>{s.count}</div>
                            <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)" }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><BookOpen size={48} /></div>
                        <div className="empty-state__title">Тапсырыс жоқ</div>
                        <div className="empty-state__sub">
                            <Link href="/catalog" style={{ color: "var(--burgundy)", fontWeight: "600" }}>Каталогтан</Link> кітап тапсырыс беріңіз
                        </div>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order: any) => {
                            const st = STATUS_MAP[order.status] || { label: order.status, cls: "" };
                            return (
                                <div key={order.id} className="order-row animate-fade-up">
                                    <div>
                                        <div className="order-row__book-title">{order.book?.titleKz || "Кітап"}</div>
                                        <div className="order-row__book-author">{order.book?.author?.name || ""}</div>
                                    </div>
                                    <span className={`badge ${st.cls}`}><span className="badge__dot" />{st.label}</span>
                                    <div className="order-row__date">
                                        <div>Берілген: {new Date(order.orderedAt).toLocaleDateString("kk-KZ")}</div>
                                        {order.dueDate && <div style={{ marginTop: "2px" }}>Дейін: {new Date(order.dueDate).toLocaleDateString("kk-KZ")}</div>}
                                    </div>
                                </div>
                            );
                        })}
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
