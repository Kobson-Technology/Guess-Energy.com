'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, LoaderCircle, MessageCircle } from 'lucide-react';
import { useCart, toCartPayload } from '@/features/cart/CartContext';
import { formatFCFA } from '@/lib/utils';

export function CheckoutForm() {
  const { items, ready, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reference: string; whatsappUrl: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setLoading(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        items: toCartPayload(items), customer: { name: data.get('name'), email: data.get('email'), phone: data.get('phone'), address: data.get('address'), city: data.get('city'), type: data.get('type'), note: data.get('note') },
      }) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Impossible de créer la commande.');
      clear(); setResult(body); window.location.href = `/commande/succes?reference=${encodeURIComponent(body.reference)}&whatsapp=${encodeURIComponent(body.whatsappUrl)}`;
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur lors de la commande.'); }
    finally { setLoading(false); }
  }

  if (!ready) return <p>Chargement…</p>;
  if (items.length === 0 && !result) return <div className="empty-state"><p>Votre panier est vide.</p><Link className="btn btn-primary" href="/produits">Retour au catalogue</Link></div>;
  return <div className="cart-layout"><form className="form-card" onSubmit={submit}>
    <h2 style={{ color: 'var(--navy-900)', marginBottom: 20 }}>Vos informations</h2>
    {error && <div className="alert alert-error">{error}</div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="name">Nom complet *</label><input id="name" name="name" required maxLength={150}/></div>
      <div className="field"><label htmlFor="type">Profil</label><select id="type" name="type" defaultValue="B2C"><option value="B2C">Particulier</option><option value="B2B">Professionnel</option></select></div>
      <div className="field"><label htmlFor="email">E-mail *</label><input id="email" name="email" type="email" required maxLength={254}/></div>
      <div className="field"><label htmlFor="phone">Téléphone *</label><input id="phone" name="phone" required maxLength={30}/></div>
      <div className="field"><label htmlFor="address">Adresse de livraison</label><input id="address" name="address" maxLength={500}/></div>
      <div className="field"><label htmlFor="city">Ville</label><input id="city" name="city" maxLength={100}/></div>
      <div className="field full"><label htmlFor="note">Note ou précision</label><textarea id="note" name="note" maxLength={1000}/></div>
    </div>
    <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 18 }}>Aucun paiement en ligne. Nous vous confirmerons la commande par téléphone ou WhatsApp.</p>
    <button className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 18 }}>{loading ? <LoaderCircle className="spin" size={18}/> : null}{loading ? 'Vérification du stock…' : 'Confirmer la commande'}</button>
    <Link href="/panier" style={{ display: 'inline-flex', gap: 7, marginTop: 16, color: 'var(--muted)', fontSize: 14 }}><ArrowLeft size={15}/> Retour au panier</Link>
  </form><aside className="summary-card"><h2 style={{ color: 'var(--navy-900)', fontSize: 19 }}>Commande</h2>{items.map((i) => <div className="summary-row" key={i.productId}><span>{i.name} × {i.quantity}</span><b>{formatFCFA(i.unitPriceTtc * i.quantity)}</b></div>)}<p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 14 }}>Le total définitif est recalculé côté serveur avec les prix GesCom.</p></aside></div>;
}