"use client";
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import BookingForm, { type BookableListing } from '@/components/BookingForm';

interface Vendor {
  id: string; bio?: string; yearsExperience?: number; languages: string[]; specializations: string[];
  avgRating?: number; verificationStatus: string; photoUrl?: string;
  user: { name?: string; phone: string };
  listings: (BookableListing & { description: string; durationMinutes?: number; includesSamagri: boolean })[];
  reviews: { id: string; rating: number; comment?: string; user: { name?: string } }[];
}

export default function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'listings' | 'reviews'>('listings');
  useEffect(() => {
    let active = true;
    api.getVendor(id).then(data => { if (active) setVendor(data as Vendor); }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load Panda.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  const name = vendor?.user.name || 'पांडा जी';
  return <><Navbar /><main className="page-wrapper container" style={{ maxWidth: 950, padding: '2rem 1rem' }}>
    {loading ? <p>Loading profile…</p> : !vendor ? <div role="alert"><p>{error || 'Panda not found.'}</p><Link href="/search">Back to search</Link></div> : <>
      <article className="card" style={{ padding: '1.5rem' }}>
        <img src={vendor.photoUrl || '/placeholder-panda.svg'} alt={name} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-panda.svg'; }} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />
        <h1>{name}</h1><p>KYC: {vendor.verificationStatus}{vendor.avgRating != null && ` · Rating: ${vendor.avgRating.toFixed(1)} / 5`}</p>
        <p>{vendor.bio}</p><p>{vendor.yearsExperience ?? 0} years of experience · {vendor.languages.join(', ')}</p><p>{vendor.specializations.join(' · ')}</p>
        <a className="btn btn-secondary" href={`https://wa.me/91${vendor.user.phone}?text=${encodeURIComponent(`नमस्ते ${name} जी, मुझे पूजा की जानकारी चाहिए।`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </article>
      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}><button className="btn btn-secondary" onClick={() => setTab('listings')}>Pooja services</button><button className="btn btn-secondary" onClick={() => setTab('reviews')}>Reviews</button></div>
      {tab === 'listings' ? <>
        <div style={{ display: 'grid', gap: '1rem' }}>{vendor.listings.map(l => <article className="card" style={{ padding: '1.5rem' }} key={l.id}><h3>{l.title}</h3><p>{l.description}</p><p>{l.priceType === 'QUOTE_ONLY' ? 'Price to be agreed' : `₹${l.price}`} · {l.includesSamagri ? 'Samagri included' : 'Samagri not included'}{l.durationMinutes && ` · ${l.durationMinutes} minutes`}</p><a href="#book" className="btn btn-primary">Book this Panda</a></article>)}</div>
        <section id="book" className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}><BookingForm vendorId={vendor.id} pandaName={name} listings={vendor.listings} returnTo={`/vendors/${id}#book`} /></section>
      </> : <div style={{ display: 'grid', gap: '1rem' }}>{vendor.reviews.length ? vendor.reviews.map(r => <article key={r.id} className="card" style={{ padding: '1.5rem' }}><h3>{r.user.name || 'Customer'} · {r.rating} / 5</h3><p>{r.comment}</p></article>) : <p>No reviews yet.</p>}</div>}
    </>}
  </main></>;
}
