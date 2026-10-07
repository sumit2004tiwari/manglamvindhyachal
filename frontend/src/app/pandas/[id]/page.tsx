"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import BookingForm from '@/components/BookingForm';
import type { PandaProfile } from '@/lib/panda-types';

export default function PandaProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [panda, setPanda] = useState<PandaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getPanda(id)
      .then((data) => {
        if (active) { setPanda(data as PandaProfile); setLoading(false); }
      })
      .catch((err) => {
        if (active) { setError(err instanceof Error ? err.message : 'Could not load Panda.'); setLoading(false); }
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", padding: "8rem" }}>
          <div className="spinner" style={{ width: 48, height: 48 }}></div>
        </div>
      </>
    );
  }

  if (!panda) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "8rem", fontFamily: "var(--font-dev)" }}>
          <p>पांडा जी नहीं मिले।</p>
          {error && <p role="alert">{error}</p>}
          <Link href="/pandas" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            वापस लौटें
          </Link>
        </div>
      </>
    );
  }

  const whatsappLink = `https://wa.me/91${panda.phone}?text=${encodeURIComponent(`नमस्ते ${panda.name} जी! मैं आपसे संपर्क करना चाहता/चाहती हूँ।`)}`;

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ padding: "3rem 1rem", minHeight: "100vh", background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ height: "200px", background: "var(--gradient-brand)", position: "relative" }}></div>
            
            <div style={{ padding: "2rem", paddingTop: "0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-60px", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid white", overflow: "hidden", background: "white" }}>
                  <img src={panda.photoUrl || "/placeholder-panda.svg"} alt={panda.name} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-panda.svg'; }} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <a href={`tel:${panda.phone}`} className="btn btn-secondary">
                    📞 कॉल करें
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              <div>
                <h1 style={{ fontFamily: "var(--font-dev)", fontSize: "2.5rem", marginBottom: "0.25rem" }}>{panda.name}</h1>
                <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {panda.experience && <span>📅 {panda.experience} वर्षों का अनुभव</span>}
                </div>
              </div>

                <section id="book" className="card" style={{ padding: '1.5rem' }}>
                  {panda.vendor?.id ? <BookingForm vendorId={panda.vendor.id} pandaName={panda.name} listings={panda.vendor.listings} returnTo={`/pandas/${id}#book`} /> : <p>This profile needs to complete Panda registration before accepting bookings.</p>}
                </section>
              {panda.bio && (
                <div style={{ background: "rgba(0,0,0,0.02)", padding: "1.5rem", borderRadius: "12px" }}>
                  <h3 style={{ fontFamily: "var(--font-dev)", fontSize: "1.2rem", marginBottom: "0.75rem", color: "var(--text-dark)" }}>परिचय</h3>
                  <p style={{ color: "var(--text-mid)", lineHeight: "1.6" }}>{panda.bio}</p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {panda.specialities && panda.specialities.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "var(--font-dev)", fontSize: "1.2rem", marginBottom: "0.75rem", color: "var(--text-dark)" }}>विशेषज्ञता</h3>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {panda.specialities.map((s: string) => (
                        <span key={s} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {panda.languages && panda.languages.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "var(--font-dev)", fontSize: "1.2rem", marginBottom: "0.75rem", color: "var(--text-dark)" }}>भाषाएँ</h3>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {panda.languages.map((l: string) => (
                        <span key={l} className="badge badge-secondary">{l}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
