"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import type { PandaProfile } from '@/lib/panda-types';

export default function PandasListingPage() {
  const [pandas, setPandas] = useState<PandaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    api.getPandas()
      .then((data) => {
        if (active) { setPandas(data as PandaProfile[]); setLoading(false); setRegistered(new URLSearchParams(window.location.search).get('registered') === '1'); }
      })
      .catch((err) => {
        if (active) { setError(err instanceof Error ? err.message : 'Could not load Pandas.'); setLoading(false); }
      });
    return () => { active = false; };
  }, [reload]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ padding: "3rem 1rem", minHeight: "100vh" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-dev)", fontSize: "2.5rem", color: "var(--red)" }}>हमारे पांडा जी</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>विंध्याचल धाम के अनुभवी पांडा जी से जुड़ें</p>
            </div>
            <Link href="/pandas/register" className="btn btn-primary">
              पांडा के रूप में रजिस्टर करें
            </Link>
          </div>

          {registered && <p role="status" className="alert alert-info">Your Panda profile is saved and listed below. KYC verification is pending.</p>}
          {error && <p role="alert" className="alert alert-error">{error} <button onClick={() => { setLoading(true); setError(''); setReload(n => n + 1); }}>Retry</button></p>}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
              <div className="spinner" style={{ width: 48, height: 48 }}></div>
            </div>
          ) : pandas.length === 0 ? (
            <div className="card text-center" style={{ padding: "4rem" }}>
              <h3 style={{ fontFamily: "var(--font-dev)", color: "var(--text-muted)" }}>अभी कोई पांडा जी पंजीकृत नहीं हैं।</h3>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {pandas.map((panda) => (
                <Link href={`/pandas/${panda.id}`} key={panda.id} className="card hover-lift" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "200px", background: "var(--cream)", position: "relative" }}>
                    <img
                      src={panda.photoUrl || "/placeholder-panda.svg"}
                      alt={panda.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                        (e.target as HTMLImageElement).style.objectFit = 'contain';
                        (e.target as HTMLImageElement).style.padding = '2rem';
                      }}
                    />
                  </div>
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "var(--font-dev)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{panda.name}</h3>
                    
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      {panda.experience != null && <span>📅 अनुभव: {panda.experience} वर्ष</span>}
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {panda.bio || "विंध्याचल धाम में आपकी सेवा में।"}
                    </p>

                    <div style={{ marginTop: "auto" }}>
                      <p>{panda.languages.join(', ')}</p><p>{panda.specialities.join(' · ')}</p>
                      <p>KYC: {panda.vendor?.verificationStatus || 'PENDING'}</p>
                      <span className="btn btn-secondary" style={{ width: "100%", textAlign: "center" }}>
                        प्रोफ़ाइल देखें
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
