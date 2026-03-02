"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) { setError("Email немесе құпия сөз дұрыс емес"); setLoading(false); }
        else router.push("/");
    };

    return (
        <div className="auth-page">
            <div className="auth-page__visual">
                <div className="auth-page__visual-grid" />
                {/* Decorative book spines */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", display: "flex", alignItems: "flex-end", padding: "0 2rem", gap: "6px", zIndex: 0 }}>
                    {[
                        { h: 160, w: 32, bg: "#2C1A0E", sp: "#C4962A" },
                        { h: 200, w: 40, bg: "#1A1A2E", sp: "#8B2635" },
                        { h: 140, w: 28, bg: "#0D2B1A", sp: "#C4962A" },
                        { h: 185, w: 36, bg: "#2A1A0A", sp: "#8B2635" },
                        { h: 168, w: 32, bg: "#1A0A1A", sp: "#C4962A" },
                        { h: 195, w: 38, bg: "#0A1A2A", sp: "#8B2635" },
                        { h: 150, w: 30, bg: "#1E1208", sp: "#C4962A" },
                        { h: 178, w: 34, bg: "#12183A", sp: "#8B2635" },
                    ].map((b, i) => (
                        <div key={i} style={{ width: b.w, height: b.h, background: b.bg, borderLeft: `4px solid ${b.sp}`, flexShrink: 0, opacity: 0.6 }} />
                    ))}
                </div>

                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <h2 className="auth-page__visual-title">
                        Оқу —<br /><em>жарық</em><br />жол
                    </h2>
                    <p className="auth-page__visual-sub">Кітапхана мүшелері кітап тапсырыс берip, сүйікті кітаптарын қорда сақтай алады</p>
                    <div className="auth-page__visual-badge">
                        <BookOpen size={12} style={{ display: "inline", marginRight: "6px" }} />
                        20+ кітап қорда
                    </div>
                </div>
            </div>

            <div className="auth-page__form-wrap">
                <div className="auth-form animate-fade-up">
                    <div className="auth-form__header">
                        <div className="auth-form__eyebrow">Кіру</div>
                        <h1 className="auth-form__title">Қош келдіңіз</h1>
                    </div>

                    {error && <div className="alert alert--error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email мекенжайы</label>
                            <input className="form-input" type="email" placeholder="siz@example.kz"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Құпия сөз</label>
                            <div style={{ position: "relative" }}>
                                <input className="form-input" type={showPw ? "text" : "password"}
                                    placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)} required
                                    style={{ paddingRight: "48px" }} />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)" }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn--primary btn--full" type="submit" disabled={loading} style={{ marginTop: "1.5rem" }}>
                            {loading ? "Кірілуде..." : "Кіру"}
                        </button>
                    </form>

                    <div style={{ margin: "1.5rem 0", borderTop: "1px solid var(--border)" }} />
                    <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Тіркелмеген бе?{" "}
                        <Link href="/auth/register" style={{ color: "var(--burgundy)", fontWeight: "600" }}>Тіркелу</Link>
                    </p>

                    <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--cream-3)", borderRadius: "var(--radius)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        <strong style={{ color: "var(--text-muted)" }}>Тест аккаунт:</strong><br />
                        admin@library.kz / admin123
                    </div>
                </div>
            </div>
        </div>
    );
}
