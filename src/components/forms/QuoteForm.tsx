'use client';

import { useState, useRef } from 'react';
import { LoaderCircle, MessageCircle, Send, CheckCircle, Download, Eye } from 'lucide-react';
import { useCart, toCartPayload } from '@/features/cart/CartContext';
import { QuoteSummary } from './QuoteSummary';
import { QuotePDF, generatePDF } from './QuotePDF';
import { formatFCFA } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE_DEFAULT } from '@/lib/constants';

export function QuoteForm() {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reference: string; whatsappUrl: string; totalTtc: number } | null>(null);
  const [error, setError] = useState('');
  const [showPDF, setShowPDF] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    entreprise: '',
    commentaire: '',
  });

  const subtotal = items.reduce((acc, item) => acc + item.unitPriceTtc * item.quantity, 0);
  const freeShipping = FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping ? 0 : SHIPPING_FEE_DEFAULT;
  const total = subtotal + shippingFee;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items: toCartPayload(items) }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      setResult(b);
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur.');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleDownloadPDF() {
    const pdfElement = document.getElementById('quote-pdf-content');
    if (pdfElement) {
      const quoteRef = `quote-pdf-${Date.now()}`;
      pdfElement.id = quoteRef;
      generatePDF(quoteRef, `devis-guess-energy-${reference || 'brouillon'}.pdf`);
      pdfElement.id = 'quote-pdf-content';
    }
  }

  const reference = result?.reference || `DEV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  if (result) {
    return (
      <div className="success-panel form-card">
        <div className="ok-icon"><CheckCircle size={48} /></div>
        <h2 style={{ color: 'var(--navy-900)' }}>Devis enregistr\u00e9 !</h2>
        <p style={{ color: 'var(--muted)' }}>R\u00e9f\u00e9rence : <b>{result.reference}</b></p>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Total estim\u00e9 : <b>{formatFCFA(result.totalTtc)}</b>
        </p>
        <a
          className="btn btn-whatsapp"
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 20 }}
        >
          <MessageCircle size={17} /> Envoyer sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="quote-layout">
      <div className="quote-form-section">
        <form className="form-card" onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}
          
          <div className="form-header">
            <h3>Vos coordonn\u00e9es</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Remplissez vos informations pour recevoir votre devis.
            </p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Nom complet *</label>
              <input name="nom" required maxLength={150} placeholder="Votre nom" value={formData.nom} onChange={handleInputChange} />
            </div>
            <div className="field">
              <label>T\u00e9l\u00e9phone *</label>
              <input name="telephone" required maxLength={50} placeholder="Ex: 07 00 00 00 00" value={formData.telephone} onChange={handleInputChange} />
            </div>
            <div className="field">
              <label>E-mail *</label>
              <input name="email" type="email" required maxLength={150} placeholder="votre@email.com" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="field">
              <label>Entreprise (optionnel)</label>
              <input name="entreprise" maxLength={150} placeholder="Nom de votre entreprise" value={formData.entreprise} onChange={handleInputChange} />
            </div>
            <div className="field full">
              <label>Commentaire / besoins sp\u00e9cifiques</label>
              <textarea name="commentaire" maxLength={4000} placeholder="D\u00e9crivez votre besoin, d\u00e9lais, contraintes techniques..." value={formData.commentaire} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowPDF(true)} disabled={items.length === 0}>
              <Eye size={16} /> Aper\u00e7u PDF
            </button>
            <button type="button" className="btn btn-primary" onClick={handleDownloadPDF} disabled={items.length === 0}>
              <Download size={16} /> T\u00e9l\u00e9charger PDF
            </button>
            <button type="submit" className="btn btn-gold" disabled={loading || items.length === 0}>
              {loading ? <LoaderCircle size={17} className="spin" /> : <Send size={17} />}
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande de devis'}
            </button>
          </div>
        </form>
      </div>

      <div className="quote-summary-section">
        <QuoteSummary loading={loading} />
      </div>

      {showPDF && (
        <div className="quote-pdf-modal" onClick={() => setShowPDF(false)}>
          <div className="quote-pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="quote-pdf-modal-header">
              <h3>Aper\u00e7u du devis</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowPDF(false)}>Fermer</button>
            </div>
            <div className="quote-pdf-modal-body">
              <QuotePDF
                items={items}
                reference={reference}
                customerName={formData.nom}
                customerPhone={formData.telephone}
                customerEmail={formData.email}
                customerCompany={formData.entreprise}
                comment={formData.commentaire}
              />
            </div>
            <div className="quote-pdf-modal-footer">
              <button className="btn btn-primary" onClick={handleDownloadPDF}>
                <Download size={16} /> T\u00e9l\u00e9charger en PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
