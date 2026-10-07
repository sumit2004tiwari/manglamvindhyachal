"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
}

function VendorListingsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Pooja",
    price: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "VENDOR") {
        router.push("/");
        return;
      }
      fetchMyListings();
    }
  }, [user, authLoading, router]);

  async function fetchMyListings() {
    try {
      const res = await api.getMyVendorProfile() as { listings: Listing[] };
      if (res && res.listings) {
        setListings(res.listings);
      }
    } catch (error) {
      console.error("Failed to load listings", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createListing({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        type: "SERVICE",
        priceType: "FIXED"
      });
      setIsAdding(false);
      setFormData({ title: "", description: "", category: "Pooja", price: "" });
      fetchMyListings(); // Refresh list
    } catch (error) {
      console.error("Failed to create listing", error);
      alert("Failed to add listing.");
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <Navbar />
      <div className="container" style={{ padding: "2rem 1rem", maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-dev)", fontSize: "2rem", color: "var(--text-dark)" }}>मेरी सेवाएं (Listings)</h1>
          <button className="btn btn-secondary btn-sm" onClick={() => router.push("/vendor/dashboard")}>
            डैशबोर्ड पर लौटें
          </button>
        </div>

        {isAdding ? (
          <div className="card-white" style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--red)", fontFamily: "var(--font-dev)" }}>नई सेवा जोड़ें</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">सेवा का नाम</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. सत्यनारायण कथा"
                />
              </div>
              <div>
                <label className="form-label">विवरण</label>
                <textarea
                  className="form-input"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">श्रेणी</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Pooja">पूजा</option>
                    <option value="Darshan">दर्शन</option>
                    <option value="Mundan">मुंडन</option>
                    <option value="Other">अन्य</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">मूल्य (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="उदा. 1100"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary">सुरक्षित करें</button>
                <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>रद्द करें</button>
              </div>
            </form>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)} style={{ marginBottom: "2rem" }}>
            + नई सेवा जोड़ें
          </button>
        )}

        <h3 style={{ marginBottom: "1rem", color: "var(--text-dark)", fontFamily: "var(--font-dev)" }}>आपकी वर्तमान सेवाएं</h3>
        {listings.length === 0 ? (
          <div className="card-white" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            कोई सेवा नहीं जोड़ी गई है।
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {listings.map((l) => (
              <div key={l.id} className="card-white" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ color: "var(--red)", marginBottom: "0.25rem", fontFamily: "var(--font-dev)" }}>{l.title}</h4>
                  <p style={{ color: "var(--text-mid)", fontSize: "0.9rem" }}>{l.description}</p>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <span>श्रेणी: {l.category}</span>
                    <span>मूल्य: ₹{l.price}</span>
                    <span>स्थिति: {l.status === 'ACTIVE' ? 'सक्रिय' : 'निष्क्रिय'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VendorListingsPage() {
  return (
    <>
      <VendorListingsContent />
    </>
  );
}
