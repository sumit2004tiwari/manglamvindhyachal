"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatBookingTime } from '@/lib/booking-time';
import Navbar from '@/components/Navbar';

interface Booking {
  id: string; status: string; scheduledDate: string; customerName?: string; customerPhone?: string;
  location?: string; notes?: string; groupSize: number; performedOnBehalfOf?: string; priceAgreed: number;
  listing: { title: string; priceType: string }; user: { name?: string; phone: string };
}

export default function PandaDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [verification, setVerification] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [reload, setReload] = useState(0);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/auth/login?next=%2Fvendor%2Fdashboard'); return; }
    let active = true;
    async function load() {
      setError('');
      try {
        const profile = await api.getMyVendorProfile() as { verificationStatus: string };
        const rows = await api.getPandaBookings(user!.id) as Booking[];
        if (active) { setVerification(profile.verificationStatus); setBookings(rows); setNow(Date.now()); }
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) { router.replace('/pandas/register'); return; }
        if (active) setError(err instanceof Error ? err.message : 'Could not load bookings.');
      } finally { if (active) setLoading(false); }
    }
    load();
    const timer = window.setInterval(load, 30000);
    window.addEventListener('focus', load);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', load); };
  }, [user, isLoading, router, reload]);
  async function update(id: string, status: string) {
    setAction(id); setError('');
    try { await api.updateBookingStatus(id, status); setReload(n => n + 1); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update booking.'); }
    finally { setAction(''); }
  }
  const sections = [
    { title: 'Upcoming bookings', rows: bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.scheduledDate).getTime() >= now) },
    { title: 'Existing bookings and history', rows: bookings.filter(b => !['PENDING', 'CONFIRMED'].includes(b.status) || new Date(b.scheduledDate).getTime() < now) },
  ];
  return <><Navbar /><main className="page-wrapper container" style={{ maxWidth: 1050, padding: '2rem 1rem' }}>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}><h1>पांडा जी Dashboard</h1><Link href="/vendor/listings" className="btn btn-secondary">Manage Pooja services</Link><button className="btn btn-ghost" onClick={() => setReload(n => n + 1)}>Refresh bookings</button></div>
    {verification && <p className="alert alert-info">KYC status: {verification}. {verification === 'PENDING' && 'Your registration is saved; KYC review is pending.'}</p>}
    <Link href="/pandas/register">Update profile and KYC</Link>
    {error && <p role="alert" className="alert alert-error">{error} <button onClick={() => setReload(n => n + 1)}>Retry</button></p>}
    {isLoading || loading ? <p>Loading dashboard…</p> : sections.map(section => <section key={section.title} style={{ marginTop: '2rem' }}>
      <h2>{section.title} ({section.rows.length})</h2>
      {!section.rows.length && <p style={{ margin: '1rem 0' }}>No bookings in this section.</p>}
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>{section.rows.map(b => <article key={b.id} className="card" style={{ padding: '1.5rem' }}>
        <h3>{formatBookingTime(b.scheduledDate)} — {b.listing.title}</h3>
        <p><strong>Customer:</strong> {b.customerName || b.user.name || 'Customer'} — <a href={`tel:${b.customerPhone || b.user.phone}`}>{b.customerPhone || b.user.phone}</a></p>
        <p><strong>Status:</strong> {b.status} · <strong>Group:</strong> {b.groupSize}</p>
        {b.location && <p><strong>Location:</strong> {b.location}</p>}
        {b.performedOnBehalfOf && <p><strong>On behalf of:</strong> {b.performedOnBehalfOf}</p>}
        {b.notes && <p><strong>Booking details:</strong> {b.notes}</p>}
        <p>{b.listing.priceType === 'QUOTE_ONLY' ? 'Price to be agreed' : `Price: ₹${b.priceAgreed}`} · Reference: {b.id}</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {b.status === 'PENDING' && <button className="btn btn-primary" disabled={action === b.id} onClick={() => update(b.id, 'CONFIRMED')}>Accept booking</button>}
          {['PENDING', 'CONFIRMED'].includes(b.status) && <button className="btn btn-secondary" disabled={action === b.id} onClick={() => update(b.id, 'CANCELLED')}>Cancel booking</button>}
          {b.status === 'CONFIRMED' && new Date(b.scheduledDate).getTime() <= now && <button className="btn btn-secondary" disabled={action === b.id} onClick={() => update(b.id, 'COMPLETED')}>Mark completed</button>}
        </div>
      </article>)}</div>
    </section>)}
  </main></>;
}
