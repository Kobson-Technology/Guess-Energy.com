'use client';

import Link from 'next/link';
import { FileText, Package, Truck, Percent, Calculator, Download, MessageCircle } from 'lucide-react';
import { useCart } from '@/features/cart/CartContext';
import { formatFCFA } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE_DEFAULT } from '@/lib/constants';

interface QuoteSummaryProps {
  onDownload?: () => void;
  onSendWhatsApp?: () => void;
  loading?: boolean;
}

export function QuoteSummary({ onDownload, onSendWhatsApp, loading }: QuoteSummaryProps) {
  const { items, ready } = useCart();

  if (!ready) {
    return (
      <div className="quote-summary">
        <div className="skeleton skeleton-card" style={{ height: 200 }} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="quote-summary">
        <div className="quote-empty">
          <Package size={48} />
          <h3>Votre devis est vide</h3>
          <p>Ajoutez des produits au panier pour constituer votre devis.</p>
          <Link href="/produits" className="btn btn-primary" style={{ marginTop: 16 }}>
            Voir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Calcul des totaux (affichage estimatif - le serveur recalcule)
  const subtotal = items.reduce((acc, item) => acc + item.unitPriceTtc * item.quantity, 0);
  const freeShipping = FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping ? 0 : SHIPPING_FEE_DEFAULT;
  const total = subtotal + shippingFee;

  return (
    <div className="quote-summary">
      <div className="quote-header">
        <div className="quote-header-icon">
          <FileText size={20} />
        </div>
        <div>
          <h3>Récapitulatif du devis</h3>
          <p>{items.length} article{items.length > 1 ? 's' : ''} dans votre devis</p>
        </div>
      </div>

      <div className="quote-items">
        {items.map((item) => (
          <div key={item.productId} className="quote-item">
            <div className="quote-item-info">
              <span className="quote-item-name">{item.name}</span>
              {item.reference && <span className="quote-item-ref">Réf. {item.reference}</span>}
            </div>
            <div className="quote-item-calc">
              <span className="quote-item-qty">x{item.quantity}</span>
              <span className="quote-item-price">{formatFCFA(item.unitPriceTtc * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quote-totals">
        <div className="quote-row">
          <span><Calculator size={14} /> Sous-total TTC</span>
          <strong>{formatFCFA(subtotal)}</strong>
        </div>
        <div className="quote-row">
          <span><Truck size={14} /> Livraison</span>
          <strong className={freeShipping ? 'text-green' : ''}>
            {freeShipping ? 'GRATUITE' : formatFCFA(shippingFee)}
          </strong>
        </div>
        {!freeShipping && FREE_SHIPPING_THRESHOLD > 0 && (
          <div className="quote-free-shipping-hint">
            <Truck size={14} />
            <span>Livraison gratuite à partir de {formatFCFA(FREE_SHIPPING_THRESHOLD)}</span>
            <span className="quote-remaining">(encore {formatFCFA(FREE_SHIPPING_THRESHOLD - subtotal)})</span>
          </div>
        )}
        <div className="quote-row quote-total">
          <span>Total estimé</span>
          <strong>{formatFCFA(total)}</strong>
        </div>
      </div>

      <div className="quote-actions">
        {onDownload && (
          <button className="btn btn-outline" onClick={onDownload} disabled={loading}>
            <Download size={16} /> Télécharger PDF
          </button>
        )}
        {onSendWhatsApp && (
          <button className="btn btn-gold" onClick={onSendWhatsApp} disabled={loading}>
            <MessageCircle size={16} /> Envoyer sur WhatsApp
          </button>
        )}
      </div>

      <div className="quote-disclaimer">
        <p>
          <small>
            Les prix affichés sont indicatifs et peuvent varier. Le définitif sera confirmé par notre équipe.
          </small>
        </p>
      </div>
    </div>
  );
}
