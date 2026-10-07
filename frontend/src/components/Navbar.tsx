"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { label: "मुख्य पृष्ठ", href: "/" },
    { label: "दर्शन", href: "/#darshan" },
    { label: "पूजा सेवा", href: "/#puja-seva" },
    { label: "पांडा जी", href: "/pandas" },
    { label: "माँ श्रृंगार", href: "/#maa-shringar" },
    { label: "होटल", href: "/#hotel" },
    { label: "भोजन", href: "/#bhojan" },
    { label: "यात्रा / वाहन", href: "/#vahan" },
    { label: "परिचय", href: "/#parichay" },
    { label: "संपर्क", href: "/#sampark" },
  ];

  return (
    <>
      <nav className={`nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
        {/* Top Tier: Logo & Auth/Contact */}
        <div className="nav-top">
          <div className="container nav-content">
            <Link href="/" className="nav-logo" style={{ flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
              <span style={{ fontSize: "1.2rem" }}>🕉️ मंगलम विंध्याचल धाम</span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 400, fontFamily: "var(--font-dev)" }}>
                RAKA Mishra — तीर्थ सहायता
              </span>
            </Link>

            <div className="nav-actions">
              {user ? (
                <>
                  {user.role === "VENDOR" && (
                    <Link href="/vendor/dashboard" className="btn btn-ghost btn-sm">डैशबोर्ड</Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="btn btn-ghost btn-sm">व्यवस्थापक</Link>
                  )}
                  <Link href="/my-bookings" className="btn btn-ghost btn-sm">मेरी बुकिंग</Link>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">लॉगआउट</button>
                </>
              ) : (
                <>
                  <a href="tel:8739000333" className="btn btn-ghost btn-sm desktop-only">📞 8739000333</a>
                  <a href="https://wa.me/918739000333" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm desktop-only">
                    💬 WhatsApp
                  </a>
                  <Link href="/auth/login" className="btn btn-primary btn-sm">लॉगिन / Signup</Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Bottom Tier: Navigation Links (Desktop) */}
        <div className="nav-bottom desktop-only">
          <div className="container" style={{ display: "flex", justifyContent: "center", gap: "1.5rem", padding: "0.5rem 0" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link-item">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          
          <a href="tel:8739000333" className="btn btn-primary btn-md" onClick={() => setMenuOpen(false)} style={{ width: "100%", marginBottom: "0.5rem" }}>
            📞 8739000333 — कॉल करें
          </a>
          <a href="https://wa.me/918739000333" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-md" onClick={() => setMenuOpen(false)} style={{ width: "100%", marginBottom: "0.5rem" }}>
            💬 WhatsApp सहायता
          </a>
        </div>
      )}

      <style>{`
        .nav-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--cream);
          transition: all 300ms ease;
        }
        .nav-wrapper.scrolled {
          box-shadow: var(--shadow-neu);
          background: rgba(242, 235, 225, 0.95);
          backdrop-filter: blur(8px);
        }
        .nav-top {
          border-bottom: 1px solid rgba(166,25,25,0.1);
          padding: 0.75rem 0;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-link-item {
          font-family: var(--font-dev);
          color: var(--text-mid);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: var(--r-sm);
          transition: all 200ms ease;
        }
        .nav-link-item:hover {
          color: var(--red);
          background: rgba(185,43,43,0.05);
        }
        .mobile-drawer {
          position: fixed;
          top: 110px;
          left: 0;
          right: 0;
          background: var(--cream);
          z-index: 99;
          padding: 1.5rem;
          height: calc(100vh - 110px);
          overflow-y: auto;
          box-shadow: var(--shadow-neu);
        }
        .mobile-nav-link {
          display: block;
          padding: 0.75rem 1rem;
          font-family: var(--font-dev);
          color: var(--text-dark);
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: var(--r-md);
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.02);
        }
        .mobile-nav-link:active {
          box-shadow: var(--shadow-neu-pressed);
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--red);
          cursor: pointer;
        }

        @media (max-width: 991px) {
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: block; }
          .nav-wrapper.scrolled {
            box-shadow: var(--shadow-md);
          }
        }
      `}</style>
    </>
  );
}
