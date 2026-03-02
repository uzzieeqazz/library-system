"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Shield, ChevronDown } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isAdmin = (session?.user as any)?.role === "admin";

    return (
        <nav
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0,
                zIndex: 100,
                height: "68px",
                display: "flex",
                alignItems: "center",
                // Always visible: solid cream with bottom border, stronger on scroll
                background: scrolled
                    ? "rgba(250,247,242,0.97)"
                    : "rgba(250,247,242,0.92)",
                borderBottom: scrolled
                    ? "1px solid var(--border-2)"
                    : "1px solid var(--border)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: scrolled ? "0 2px 24px rgba(30,18,8,0.10)" : "none",
                transition: "box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease",
            }}
        >
            <div className="navbar__inner">
                {/* Logo */}
                <Link href="/" style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    fontFamily: "var(--font-display)", fontSize: "1.35rem",
                    fontWeight: 700, letterSpacing: "-0.03em",
                    color: "var(--espresso)", textDecoration: "none",
                }}>
                    <span style={{
                        width: "30px", height: "30px",
                        background: "var(--burgundy)",
                        borderRadius: "4px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-serif)", fontStyle: "italic",
                        fontSize: "0.95rem", color: "#fff", lineHeight: 1,
                        flexShrink: 0,
                    }}>§</span>
                    Кітапхана
                </Link>

                {/* Links */}
                <ul style={{ display: "flex", alignItems: "center", gap: "2.25rem", listStyle: "none", margin: 0, padding: 0 }}>
                    {[
                        { href: "/", label: "Басты бет" },
                        { href: "/catalog", label: "Каталог" },
                        ...(session ? [{ href: "/orders", label: "Тапсырыстар" }] : []),
                        ...(isAdmin ? [{ href: "/admin", label: "Әкімші" }] : []),
                    ].map(({ href, label }) => {
                        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <li key={href}>
                                <Link href={href} style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: active ? "var(--burgundy)" : "var(--text-muted)",
                                    textDecoration: "none",
                                    transition: "color 0.25s ease",
                                    paddingBottom: "2px",
                                    borderBottom: active ? "1.5px solid var(--burgundy)" : "1.5px solid transparent",
                                    display: "inline-block",
                                }}>
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {session ? (
                        <div
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                position: "relative", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "7px",
                                padding: "7px 14px",
                                border: "1.5px solid var(--border-2)",
                                borderRadius: "100px",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                fontFamily: "var(--font-sans)",
                                fontWeight: 500,
                                transition: "all 0.25s ease",
                                background: menuOpen ? "var(--burgundy-dim)" : "transparent",
                                borderColor: menuOpen ? "var(--burgundy)" : "var(--border-2)",
                            }}
                        >
                            <User size={13} />
                            <span>{session.user?.name?.split(" ")[0]}</span>
                            {isAdmin && <Shield size={11} style={{ color: "var(--burgundy)" }} />}
                            <ChevronDown size={12} style={{ opacity: 0.5, marginLeft: "2px" }} />

                            {menuOpen && (
                                <div style={{
                                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                                    background: "var(--white)", border: "1.5px solid var(--border)",
                                    borderRadius: "var(--radius)", padding: "0.4rem",
                                    minWidth: "170px", zIndex: 200,
                                    boxShadow: "0 8px 32px rgba(30,18,8,0.14)",
                                    animation: "scaleIn 0.18s ease both",
                                }}>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                                            display: "flex", alignItems: "center", gap: "8px",
                                            padding: "9px 12px", borderRadius: "6px",
                                            fontSize: "0.83rem", color: "var(--text-muted)",
                                            textDecoration: "none", transition: "background 0.2s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "var(--cream-2)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Shield size={13} style={{ color: "var(--burgundy)" }} /> Әкімші панелі
                                        </Link>
                                    )}
                                    <button onClick={() => signOut()} style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        width: "100%", padding: "9px 12px",
                                        background: "none", border: "none", cursor: "pointer",
                                        color: "var(--text-muted)", fontSize: "0.83rem",
                                        borderRadius: "6px", transition: "background 0.2s",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--cream-2)")}
                                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                                    >
                                        <LogOut size={13} /> Шығу
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth/login" style={{
                            display: "inline-flex", alignItems: "center",
                            padding: "9px 22px",
                            background: "var(--espresso)",
                            color: "#fff",
                            borderRadius: "var(--radius)",
                            fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em",
                            textTransform: "uppercase", textDecoration: "none",
                            transition: "background 0.25s ease",
                            fontFamily: "var(--font-sans)",
                        }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--burgundy)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--espresso)")}
                        >
                            Кіру
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
