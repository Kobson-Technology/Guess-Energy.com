import Link from 'next/link';
import { CheckCircle, Home, MessageCircle, Package, ShoppingBag } from 'lucide-react';
export const metadata = { title: 'Commande confirmée — GUESS ENERGY + SARL', description: 'Votre commande a été enregistrée avec succès.' };
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ reference?: string; whatsapp?: string }> }) {
  const params = await searchParams; const reference = params.reference ?? '—';
  return <>
    <section className="section" style={{ background: 'linear-gradient(180deg, var(--bg-soft) 0%, #fff 100%)' }}>
      <div className="container">
        <div className="form-card success-panel" style={{ maxWidth: 620, margin: '0 auto', padding: '56px 32px' }}>
          <div className="ok-icon"><CheckCircle size={48}/></div>
          <span className="section-kicker">Merci pour votre confiance</span>
          <h1 style={{ color: 'var(--navy-900)', fontSize: 32, margin: '8px 0 12px' }}>Commande enregistrée</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Votre demande a été transmise à GUESS ENERGY + SARL.</p>
          <div className="order-ref" style={{ fontSize: 22, padding: '14px 30px' }}>{reference}</div>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>Conservez ce numéro pour suivre votre commande.<br/>Notre équipe vous contactera pour confirmer les modalités.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link href="/produits" className="btn btn-outline"><ShoppingBag size={17}/> Continuer mes achats</Link>
            {params.whatsapp && <a href={params.whatsapp} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#22c15e', color: '#fff' }}><MessageCircle size={17}/> Confirmer sur WhatsApp</a>}
          </div>
        </div>
      </div>
    </section>
    <section className="section section-alt" style={{ paddingTop: 0 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 800, margin: '0 auto' }}>
          <div className="value-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--electric-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--electric-600)' }}><Package size={22}/></div>
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>Préparation</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Nous préparons votre commande avec soin.</p>
          </div>
          <div className="value-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e8f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--green-600)' }}><MessageCircle size={22}/></div>
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>Contact</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Notre équipe vous contacte rapidement.</p>
          </div>
          <div className="value-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--gold-600)' }}><Home size={22}/></div>
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>Livraison</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Modalités de livraison à convenir.</p>
          </div>
        </div>
      </div>
    </section>
  </>;
}