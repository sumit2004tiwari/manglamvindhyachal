"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { formatBookingTime } from '@/lib/booking-time';
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  status: string;
  scheduledDate: string;
  priceAgreed: number;
  performedOnBehalfOf?: string;
  listing: { title: string; priceType: string };
  vendor: { user: { name?: string } };
  review?: { id: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "प्रतीक्षारत",
  CONFIRMED: "पुष्टि हो गई",
  COMPLETED: "पूर्ण",
  CANCELLED: "रद्द",
  DISPUTED: "विवादित",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-verified",
  COMPLETED: "badge-verified",
  CANCELLED: "badge badge-primary",
  DISPUTED: "badge badge-primary",
};

function MyBookingsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [cancelLoading, setCancelLoading] = useState('');

  // Review state
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading from localStorage
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    api.getMyBookings(user.id)
      .then((data) => setBookings(data as Booking[]))
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load bookings.'))
      .finally(() => setLoading(false));
  }, [user, authLoading, router, reload]);

  const handleSubmitReview = async () => {
    if (!reviewBookingId) return;
    setReviewLoading(true);
    try {
      await api.createReview({ bookingId: reviewBookingId, rating, comment });
      setReviewBookingId(null);
      // Refresh
      const data = await api.getMyBookings(user!.id);
      setBookings(data as Booking[]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "कुछ गलत हुआ");
    } finally {
      setReviewLoading(false);
    }
  };

  async function cancelBooking(id: string) {
    setCancelLoading(id); setError('');
    try { await api.cancelBooking(id); setReload(n => n + 1); }
    catch (err) { setError(err instanceof Error ? err.message : 'Cancellation failed.'); }
    finally { setCancelLoading(''); }
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "8rem" }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    );
  }


  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "var(--font-devanagari)", marginBottom: "2rem", fontSize: "clamp(1.5rem,3vw,2rem)" }}>
        मेरी बुकिंग
      </h1>

      {error && <p role="alert" className="alert alert-error">{error} <button onClick={() => { setError(''); setLoading(true); setReload(n => n + 1); }}>Retry</button></p>}
      {bookings.length === 0 && !error ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-devanagari)" }}>
            आपकी कोई बुकिंग नहीं है।
          </p>
          <Link href="/pandas" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            पांडा जी खोजें
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="card animate-fade-in" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-devanagari)", marginBottom: "0.25rem" }}>
                    {booking.listing?.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontFamily: "var(--font-devanagari)" }}>
                    पांडा: {booking.vendor?.user?.name || "—"}
                  </p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                    📅 {formatBookingTime(booking.scheduledDate)}
                  </p>
                  {booking.performedOnBehalfOf && (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-devanagari)" }}>
                      👤 {booking.performedOnBehalfOf} की ओर से
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${STATUS_COLORS[booking.status] || "badge-primary"}`} style={{ fontFamily: "var(--font-devanagari)", display: "block", marginBottom: "0.5rem" }}>
                    {STATUS_LABELS[booking.status] || booking.status}
                  </span>
                  <div style={{ fontWeight: 700, color: "var(--color-primary-light)" }}>
                    {booking.listing.priceType === 'QUOTE_ONLY' ? 'Price to be agreed' : `₹${booking.priceAgreed.toLocaleString('hi-IN')}`}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {['PENDING', 'CONFIRMED'].includes(booking.status) && <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={() => cancelBooking(booking.id)} disabled={cancelLoading === booking.id}>{cancelLoading === booking.id ? 'Cancelling…' : 'Cancel booking'}</button>}
              {booking.status === "COMPLETED" && !booking.review && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReviewBookingId(booking.id)}
                  >
                    ⭐ समीक्षा लिखें
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setReviewBookingId(null); }}
        >
          <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
            <h2 style={{ fontFamily: "var(--font-devanagari)", marginBottom: "1.5rem" }}>
              समीक्षा लिखें
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label" style={{ marginBottom: "0.5rem", display: "block" }}>रेटिंग दें</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: "2rem",
                        cursor: "pointer",
                        color: star <= rating ? "var(--color-accent)" : "var(--color-text-muted)",
                        transition: "color 0.15s",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="label">अपना अनुभव साझा करें</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="पांडा जी की सेवा कैसी रही?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ resize: "vertical", fontFamily: "var(--font-devanagari)" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                  style={{ flex: 1 }}
                >
                  {reviewLoading ? (
                    <span className="spinner" style={{ width: 18, height: 18 }} />
                  ) : "समीक्षा जमा करें"}
                </button>
                <button className="btn btn-ghost" onClick={() => setReviewBookingId(null)}>
                  रद्द
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <MyBookingsContent />
      </div>
    </>
  );
}
