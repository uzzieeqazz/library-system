"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Library } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Тіркеу мүмкін болмады"); }
            router.push("/auth/login");
        } catch (e: any) { setError(e.message); setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__visual">
                <div className="auth-page__visual-grid" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
                    {/* Large decorative § */}
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "28rem", color: "rgba(196,150,42,0.04)", lineHeight: 1, userSelect: "none" }}>§</span>
                </div>
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <h2 className="auth-page__visual-title">
                        Жаңа<br /><em>мүше</em><br />болыңыз
                    </h2>
                    <p className="auth-page__visual-sub">Тіркелген мүшелер 14 күнге кітап тапсырыс беріп, кітапхана қорын пайдалана алады</p>
                    <div className="auth-page__visual-badge">
                        <Library size={12} style={{ display: "inline", marginRight: "6px" }} />
                        Тегін тіркелу
                    </div>
                </div>
            </div>

            <div className="auth-page__form-wrap">
                <div className="auth-form animate-fade-up">
                    <div className="auth-form__header">
                        <div className="auth-form__eyebrow">Тіркелу</div>
                        <h1 className="auth-form__title">Аккаунт жасау</h1>
                    </div>

                    {error && <div className="alert alert--error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Толық аты-жөні</label>
                            <input className="form-input" type="text" placeholder="Аты-жөніңіз"
                                value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email мекенжайы</label>
                            <input className="form-input" type="email" placeholder="siz@example.kz"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Құпия сөз</label>
                            <div style={{ position: "relative" }}>
                                <input className="form-input" type={showPw ? "text" : "password"}
                                    placeholder="Кемінде 6 таңба" value={password} minLength={6}
                                    onChange={e => setPassword(e.target.value)} required style={{ paddingRight: "48px" }} />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)" }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn--primary btn--full" type="submit" disabled={loading} style={{ marginTop: "1.5rem" }}>
                            {loading ? "Тіркелуде..." : "Тіркелу"}
                        </button>
                    </form>

                    <div style={{ margin: "1.5rem 0", borderTop: "1px solid var(--border)" }} />
                    <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Тіркелген бе?{" "}
                        <Link href="/auth/login" style={{ color: "var(--burgundy)", fontWeight: "600" }}>Кіру</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
