"use client";
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatBookingTime, indiaToday } from '@/lib/booking-time';

export interface BookableListing { id: string; title: string; price: number; priceType: string; maxGroupSize?: number | null }

export default function BookingForm({ vendorId, pandaName, listings, returnTo }: { vendorId: string; pandaName: string; listings: BookableListing[]; returnTo: string }) {
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ listingId: listings[0]?.id || '', date: '', time: '', customerName: user?.name || '', customerPhone: user?.phone || '', location: 'Vindhyachal Dham', groupSize: 1, performedOnBehalfOf: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ id: string; title: string; date: string } | null>(null);
  const selected = listings.find(l => l.id === form.listingId);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    const scheduledDate = `${form.date}T${form.time}:00+05:30`;
    try {
      const booking = await api.createBooking({ vendorId, listingId: form.listingId, scheduledDate, customerName: form.customerName, customerPhone: form.customerPhone, groupSize: form.groupSize, location: form.location, performedOnBehalfOf: form.performedOnBehalfOf || undefined, notes: form.notes || undefined });
      setSuccess({ id: booking.id, title: selected!.title, date: scheduledDate });
    } catch (err) { setError(err instanceof Error ? err.message : 'Booking failed.'); }
    finally { setLoading(false); }
  }
  if (isLoading) return <p>Loading account…</p>;
  if (!user) return <Link className="btn btn-primary" href={`/auth/login?next=${encodeURIComponent(returnTo)}`}>Login to Book this Panda</Link>;
  if (!listings.length) return <p>This Panda has no active Pooja services yet.</p>;
  if (success) return <div role="status" className="alert alert-info"><h3>Booking request saved</h3><p>{success.title} — {formatBookingTime(success.date)} — {pandaName}</p><p>Reference: {success.id}. The Panda can now see your request in their dashboard.</p><Link href="/my-bookings" className="btn btn-primary">View my bookings</Link></div>;
  return <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
    <h2>Book {pandaName}</h2>
    <p>All booking times are in India Standard Time (IST).</p>
    {error && <p role="alert" className="alert alert-error">{error}</p>}
    <label className="input-group">Selected Panda<input className="input" value={pandaName} readOnly /></label>
    <label className="input-group">Pooja / program *<select className="input" value={form.listingId} onChange={e => setForm({ ...form, listingId: e.target.value })} required>{listings.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      <label className="input-group">Date *<input className="input" type="date" min={indiaToday()} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></label>
      <label className="input-group">Time (IST) *<input className="input" type="time" step={60} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required /></label>
    </div>
    <label className="input-group">Customer name *<input className="input" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required minLength={2} maxLength={100} /></label>
    <label className="input-group">Customer phone *<input className="input" type="tel" pattern="[6-9][0-9]{9}" maxLength={10} value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} required /></label>
    <label className="input-group">Pooja location *<input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required minLength={3} maxLength={1000} /></label>
    <label className="input-group">Group size *<input className="input" type="number" value={form.groupSize} min={1} max={selected?.maxGroupSize || 500} step={1} onChange={e => setForm({ ...form, groupSize: Number(e.target.value) })} required /></label>
    <label className="input-group">Performed on behalf of<input className="input" value={form.performedOnBehalfOf} onChange={e => setForm({ ...form, performedOnBehalfOf: e.target.value })} maxLength={1000} /></label>
    <label className="input-group">Other booking details<textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={3000} /></label>
    <p>{selected?.priceType === 'QUOTE_ONLY' ? 'Price to be agreed with the Panda.' : `Service price: ₹${selected?.price.toLocaleString('en-IN')}`}</p>
    <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving booking…' : 'Submit booking request'}</button>
  </form>;
}
