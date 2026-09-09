'use client';
import Link from 'next/link';
import { ImageOff, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart, toCartPayload } from '@/features/cart/CartContext';
import { formatFCFA } from '@/lib/utils';
import type { CartValidationResult } from '@/types';

export function CartView() {
  const { items, ready, setQuantity, remove } = useCart();
  const [validation, setValidation] = useState<CartValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready || items.length === 0) { setValidation(null); return; }
    setLoading(true);
    fetch('/api/cart/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: toCartPayload(items) }) })
      .then((r) => r.ok ? r.json() : null).then(setValidation).catch(() => setValidation(null)).finally(() => setLoading(false));
  }, [items, ready]);

  if (!ready || loading) return <div className="empty-state"><p>Chargement du panier…</p></div>;
  if (items.length === 0) return <div className="empty-state"><ShoppingBag size={48}/><h2 style={{ color: 'var(--navy-900)', marginBottom: 10 }}>Votre panier est vide</h2><p>Découvrez notre catalogue de matériel électrique.</p><Link href="/produits" className="btn btn-primary" style={{ marginTop: 20 }}>Voir les produits</Link></div>;

  const lines = validation?.lines ?? items.map((item) => ({ ...item, unitPriceHt: 0, unitPriceTtc: item.unitPriceTtc, subtotalHt: 0, subtotalTtc: item.quantity * item.unitPriceTtc, stock: item.maxStock, available: true, maxOrderable: item.maxStock ?? 999, imageUrl: item.hasImage ? `/api/products/${item.productId}/image` : null, issue: undefined }));
  const totals = validation?.totals;
  return <div className="cart-layout">
    <div><table className="cart-table"><thead><tr><th>Produit</th><th>Prix unitaire</th><th>Quantité</th><th>Total</th><th></th></tr></thead><tbody>
      {lines.map((line) => <tr key={line.productId}>
        <td data-label="Produit"><div className="cart-prod"><div className="cart-thumb">{line.imageUrl ? <img src={line.imageUrl} alt=""/> : <ImageOff size={22}/>}</div><div><b style={{ color: 'var(--navy-900)' }}>{line.name}</b><small style={{ display: 'block', color: 'var(--muted)' }}>{line.reference ?? ''}</small>{line.issue && <span className="line-issue">{line.issue}</span>}</div></div></td>
        <td data-label="Prix">{formatFCFA(line.unitPriceTtc)}</td>
        <td data-label="Quantité"><div className="qty-stepper"><button onClick={() => setQuantity(line.productId, Math.max(1, line.quantity - 1))}><Minus size={14}/></button><input value={line.quantity} readOnly/><button onClick={() => setQuantity(line.productId, Math.min(line.maxOrderable || 999, line.quantity + 1))}><Plus size={14}/></button></div></td>
        <td data-label="Total"><b>{formatFCFA(line.subtotalTtc)}</b></td>
        <td className="no-label"><button className="cart-remove" onClick={() => remove(line.productId)} aria-label="Supprimer"><Trash2 size={17}/></button></td>
      </tr>)}
    </tbody></table></div>
    <aside className="summary-card"><h2 style={{ color: 'var(--navy-900)', fontSize: 19, marginBottom: 12 }}>Résumé</h2>
      <div className="summary-row"><span>Sous-total TTC</span><b>{formatFCFA(totals?.subtotalTtc ?? 0)}</b></div>
      <div className="summary-row"><span>Livraison</span><b>{totals?.shippingFee ? formatFCFA(totals.shippingFee) : 'Gratuite'}</b></div>
      <div className="summary-row total"><span>Total</span><span>{formatFCFA(totals?.totalTtc ?? 0)}</span></div>
      {validation?.issues && validation.issues.length > 0 && <p className="line-issue" style={{ marginTop: 14 }}>Vérifiez les disponibilités avant de commander.</p>}
      <Link href={validation?.valid ? '/commande' : '#'} className={`btn btn-primary btn-lg ${validation?.valid ? '' : 'is-disabled'}`} style={{ width: '100%', marginTop: 18 }}>Passer la commande</Link>
    </aside>
  </div>;
}