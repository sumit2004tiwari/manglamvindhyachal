"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function PandaRegistrationPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', bio: '', languages: 'हिन्दी', experience: '', specialities: '', dateOfBirth: '', address: '', identityType: 'AADHAAR', identityLastFour: '', lineageDetails: '' });
  const [photo, setPhoto] = useState('');
  const [document, setDocument] = useState('');
  useEffect(() => {
    if (!user?.hasKyc) return;
    let active = true;
    api.getMyVendorProfile().then(data => {
      const p = data as { bio?: string; languages: string[]; specializations: string[]; yearsExperience?: number; photoUrl?: string; aadhaarDocUrl?: string; dateOfBirth?: string; address?: string; identityType?: string; identityLastFour?: string; lineageDetails?: string };
      if (!active) return;
      setForm({ name: user.name || '', email: '', bio: p.bio || '', languages: p.languages.join(', '), experience: String(p.yearsExperience ?? 0), specialities: p.specializations.join(', '), dateOfBirth: p.dateOfBirth?.slice(0, 10) || '', address: p.address || '', identityType: p.identityType || 'AADHAAR', identityLastFour: p.identityLastFour || '', lineageDetails: p.lineageDetails || '' });
      setPhoto(p.photoUrl || ''); setDocument(p.aadhaarDocUrl || '');
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load your profile.'); });
    return () => { active = false; };
  }, [user]);
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  async function upload(e: React.ChangeEvent<HTMLInputElement>, kind: 'photo' | 'document') {
    const file = e.target.files?.[0];
    if (kind === 'photo') setPhoto(''); else setDocument('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError('Choose a JPEG, PNG or WebP image up to 2 MB.'); e.target.value = ''; return;
    }
    setReading(n => n + 1);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Could not read this file. Please select it again.'));
        reader.readAsDataURL(file);
      });
      if (kind === 'photo') setPhoto(data); else setDocument(data);
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed.'); }
    finally { setReading(n => n - 1); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !photo || !document) { setError('Profile photo and identity document are required.'); return; }
    setLoading(true); setError('');
    try {
      await (user.hasKyc ? api.updatePanda : api.createPanda)({ ...form, email: form.email || undefined, phone: user.phone, photoUrl: photo, identityDocument: document,
        experience: Number(form.experience), languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
        specialities: form.specialities.split(',').map(s => s.trim()).filter(Boolean) });
      updateUser({ name: form.name.trim(), role: user.role === 'ADMIN' ? 'ADMIN' : 'VENDOR', hasKyc: true });
      router.push('/pandas?registered=1');
    } catch (err) { setError(err instanceof Error ? err.message : 'Registration failed.'); }
    finally { setLoading(false); }
  }

  return <><Navbar /><main className="page-wrapper container" style={{ maxWidth: 760, padding: '2rem 1rem' }}>
    <div className="card" style={{ padding: '2rem' }}>
      <h1>पांडा पंजीकरण / Panda Registration & KYC</h1>
      <p style={{ margin: '1rem 0' }}>Complete your personal details and KYC. Your public profile will appear on the Panda page after registration. Identity documents remain private; verification is reviewed separately.</p>
      {isLoading ? <p>Loading account…</p> : !user ? <div className="alert alert-info"><p>Verify your phone number to register as a Panda.</p><Link href="/auth/login?next=%2Fpandas%2Fregister" className="btn btn-primary">Login to continue</Link></div> : <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
        {user.hasKyc && <p>Update your profile and KYC below. <Link href="/vendor/dashboard">Open dashboard</Link></p>}
        {error && <p role="alert" className="alert alert-error">{error}</p>}
        <label className="input-group">Full name *<input className="input" name="name" value={form.name} onChange={change} required minLength={2} maxLength={100} /></label>
        <label className="input-group">Verified phone<input className="input" value={user.phone} readOnly /></label>
        <label className="input-group">Email<input className="input" type="email" name="email" value={form.email} onChange={change} /></label>
        <label className="input-group">Introduction / परिचय *<textarea className="input" name="bio" value={form.bio} onChange={change} required minLength={10} maxLength={3000} rows={4} /></label>
        <label className="input-group">Experience (years) *<input className="input" type="number" name="experience" value={form.experience} onChange={change} min={0} max={100} step={1} required /></label>
        <label className="input-group">Languages (comma separated) *<input className="input" name="languages" value={form.languages} onChange={change} required /></label>
        <label className="input-group">Pooja / program specialities (comma separated) *<input className="input" name="specialities" value={form.specialities} onChange={change} placeholder="Mundan Pooja, Rudrabhishek, विवाह" required /></label>
        <label className="input-group">Lineage details<textarea className="input" name="lineageDetails" value={form.lineageDetails} onChange={change} maxLength={2000} /></label>
        <label className="input-group">Profile photo *<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e, 'photo')} required={!photo} /></label>
        {photo && <img src={photo} alt="Profile preview" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />}
        <h2>KYC details (private)</h2>
        <label className="input-group">Date of birth *<input className="input" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={change} required /></label>
        <label className="input-group">Residential address *<textarea className="input" name="address" value={form.address} onChange={change} required minLength={10} maxLength={1000} /></label>
        <label className="input-group">Identity document type *<select className="input" name="identityType" value={form.identityType} onChange={change}><option value="AADHAAR">Aadhaar</option><option value="PASSPORT">Passport</option><option value="VOTER_ID">Voter ID</option></select></label>
        <label className="input-group">Last four characters of identity number *<input className="input" name="identityLastFour" value={form.identityLastFour} onChange={change} pattern="[A-Za-z0-9]{4}" maxLength={4} required /></label>
        <label className="input-group">Identity document image *<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e, 'document')} required={!document} /></label>
        <small>JPEG, PNG or WebP; maximum 2 MB per file. {document && 'Identity document selected.'}</small>
        <label><input type="checkbox" required /> I confirm these details are correct and consent to KYC review.</label>
        <button className="btn btn-primary" type="submit" disabled={loading || reading > 0}>{loading ? 'Saving registration…' : reading ? 'Reading upload…' : user.hasKyc ? 'Update profile and KYC' : 'Register as Panda'}</button>
      </form>}
    </div>
  </main></>;
}
