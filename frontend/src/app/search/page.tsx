"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

const CATEGORIES = [
  "pind_daan", "mundan", "satyanarayan_puja", "ganga_aarti",
  "vivah_puja", "namkaran", "griha_pravesh", "shraddh",
  "rudrabhishek", "navgraha_puja",
];

interface Vendor {
  id: string;
  bio?: string;
  yearsExperience?: number;
  languages: string[];
  specializations: string[];
  avgRating?: number;
  verificationStatus: string;
  user: { name?: string };
  listings: { title: string; price: number; priceType: string }[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= Math.round(rating) ? "var(--color-accent)" : "var(--color-text-muted)", fontSize: "0.875rem" }}>
          ★
        </span>
      ))}
      <span style={{ color: "var(--color-text-secondary)", marginLeft: "4px", fontSize: "0.8rem" }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const t = useTranslations("Vendor");
  const ts = useTranslations("Search");
  const firstListing = vendor.listings?.[0];
  const name = vendor.user?.name || "पांडा जी";
  const initials = name.charAt(0).toUpperCase();

  return (
    <div className="card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div className="vendor-avatar-placeholder">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-devanagari)", fontSize: "1.1rem", fontWeight: 700 }}>
              {name}
            </h3>
            {vendor.verificationStatus === "VERIFIED" && (
              <span className="badge badge-verified">{t("verified_badge")}</span>
            )}
          </div>
          {vendor.avgRating && (
            <StarRating rating={vendor.avgRating} />
          )}
          {vendor.yearsExperience && (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-devanagari)" }}>
              {t("experience", { years: vendor.yearsExperience })}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {vendor.bio && (
        <p style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-devanagari)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {vendor.bio}
        </p>
      )}

      {/* Languages */}
      {vendor.languages?.length > 0 && (
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {vendor.languages.map((lang) => (
            <span key={lang} className="badge badge-primary">{lang}</span>
          ))}
        </div>
      )}

      {/* First listing price */}
      {firstListing && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-devanagari)" }}>
              {ts("per_puja")}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--color-primary-light)" }}>
              ₹{firstListing.price.toLocaleString("hi-IN")}
            </div>
          </div>
          <Link href={`/vendors/${vendor.id}`} className="btn btn-primary btn-sm">
            {ts("view_profile")}
          </Link>
        </div>
      )}
    </div>
  );
}

function SearchContent() {
  const t = useTranslations("Search");
  const tc = useTranslations("Category");
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minRating, setMinRating] = useState("");
  const [language, setLanguage] = useState("");

  const fetchVendors = async () => {
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (minRating) params.minRating = minRating;
      if (language) params.language = language;
      const data = await api.searchVendors(params) as Vendor[];
      setVendors(data);
      setError('');
    } catch {
      setError(t("no_results"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.searchVendors(category ? { category } : {}).then(data => {
      if (active) { setVendors(data as Vendor[]); setError(''); }
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load search results.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category]);

  return (
    <div style={{ padding: "2rem 0" }}>
      <div className="container">
        <h1 style={{ fontFamily: "var(--font-devanagari)", marginBottom: "2rem", fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
          {t("title")}
        </h1>

        {/* Filters */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          {/* Category Pills */}
          <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", minWidth: "max-content" }}>
              <button
                className={`category-pill ${category === "" ? "active" : ""}`}
                onClick={() => { if (category) { setLoading(true); setCategory(''); } }}
              >
                {tc("all")}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${category === cat ? "active" : ""}`}
                  onClick={() => { if (category !== cat) { setLoading(true); setCategory(cat); } }}
                >
                  {tc(cat as Parameters<typeof tc>[0])}
                </button>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Advanced filters */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div className="input-group" style={{ flex: 1, minWidth: "160px" }}>
              <label className="label">{t("filter_language")}</label>
              <select
                className="input select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">सभी भाषाएं</option>
                <option value="हिंदी">हिंदी</option>
                <option value="भोजपुरी">भोजपुरी</option>
                <option value="अवधी">अवधी</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: "160px" }}>
              <label className="label">{t("filter_rating")}</label>
              <select
                className="input select"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">कोई भी</option>
                <option value="4">4★ से ऊपर</option>
                <option value="4.5">4.5★ से ऊपर</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button className="btn btn-primary" onClick={() => { setLoading(true); fetchVendors(); }}>
                {t("apply_filters")}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : error ? (
          <div className="alert alert-info" style={{ fontFamily: "var(--font-devanagari)" }}>
            {error}
          </div>
        ) : (
          <>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem", fontFamily: "var(--font-devanagari)" }}>
              {vendors.length} पांडा जी मिले
            </p>
            <div className="vendor-grid">
              {vendors.map((vendor, i) => (
                <div key={vendor.id} style={{ animationDelay: `${i * 50}ms` }}>
                  <VendorCard vendor={vendor} />
                </div>
              ))}
            </div>
            {vendors.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)", fontFamily: "var(--font-devanagari)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p>{t("no_results")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <Suspense fallback={<div className="container" style={{ padding: "4rem", textAlign: "center" }}><div className="spinner" style={{ margin: "auto", width: 40, height: 40 }} /></div>}>
          <SearchContent />
        </Suspense>
      </div>
    </>
  );
}
