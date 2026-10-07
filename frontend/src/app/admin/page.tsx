"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

interface Vendor {
  id: string;
  user: { name?: string; phone: string };
  bio?: string;
  yearsExperience?: number;
  languages: string[];
  verificationStatus: string;
  aadhaarDocUrl?: string;
  photoUrl?: string;
  identityType?: string;
  identityLastFour?: string;
  address?: string;
  dateOfBirth?: string;
}

function AdminDashboardContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/auth/login?next=%2Fadmin"); return; }
    if (user.role !== "ADMIN") { router.replace("/"); return; }

    const loadPending = async () => {
      try {
        const data = await api.getPendingVendors();
        setVendors(data as Vendor[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "ADMIN") loadPending();
  }, [user, authLoading, router]);

  const verifyVendor = async (id: string, status: "VERIFIED" | "REJECTED") => {
    setActionLoading(id);
    try {
      await api.verifyVendor(id, status);
      setVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "विफल");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "8rem" }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "1000px" }}>
      <h1 style={{ fontFamily: "var(--font-devanagari)", fontSize: "2rem", marginBottom: "2rem" }}>
        व्यवस्थापक डैशबोर्ड (Admin)
      </h1>

      <h2 style={{ fontFamily: "var(--font-devanagari)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-primary-light)" }}>
        लंबित पांडा सत्यापन ({vendors.length})
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {vendors.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-devanagari)" }}>
            कोई लंबित सत्यापन नहीं है।
          </div>
        )}
        {vendors.map(vendor => (
          <div key={vendor.id} className="card animate-fade-in" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-devanagari)", fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                  {vendor.user.name || "पांडा जी"}
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                  📞 {vendor.user.phone} | 📅 {vendor.yearsExperience} वर्ष का अनुभव
                </p>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", fontFamily: "var(--font-devanagari)", maxWidth: "600px" }}>
                  {vendor.bio}
                </p>
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                  {vendor.languages.map(l => (
                    <span key={l} className="badge badge-primary">{l}</span>
                  ))}
                </div>
                <details style={{ marginTop: '1rem' }}><summary>Review private KYC details</summary>
                  <p>{vendor.identityType} · Last four: {vendor.identityLastFour || 'Not supplied'}</p>
                  <p>Date of birth: {vendor.dateOfBirth?.slice(0, 10) || 'Not supplied'}</p><p>Address: {vendor.address || 'Not supplied'}</p>
                  {vendor.photoUrl && <img src={vendor.photoUrl} alt="Panda profile" style={{ width: 120, height: 120, objectFit: 'cover' }} />}
                  {vendor.aadhaarDocUrl ? <img src={vendor.aadhaarDocUrl} alt="Private identity document" style={{ maxWidth: '100%', maxHeight: 400 }} /> : <p>Identity document not supplied.</p>}
                </details>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column", minWidth: "120px" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => verifyVendor(vendor.id, "VERIFIED")}
                  disabled={actionLoading === vendor.id}
                >
                  {actionLoading === vendor.id ? "..." : "सत्यापित करें"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => verifyVendor(vendor.id, "REJECTED")}
                  disabled={actionLoading === vendor.id}
                  style={{ color: "var(--color-error)" }}
                >
                  अस्वीकार करें
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AdminDashboardContent />
      </div>
    </>
  );
}
