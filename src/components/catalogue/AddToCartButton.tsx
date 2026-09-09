'use client';
/** Bouton "Ajouter au panier" avec sélecteur de quantité (client). */
import { useState } from 'react';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/CartContext';

export interface AddToCartProduct {
  productId: number;
  name: string;
  slug: string;
  unitPriceTtc: number;
  reference: string | null;
  hasImage: boolean;
  maxStock: number | null;
}

export function AddToCartButton({
  product,
  compact = false,
  disabled = false,
}: {
  product: AddToCartProduct;
  compact?: boolean;
  disabled?: boolean;
}) {
  const { add, showToast } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty = product.maxStock != null ? Math.max(1, Math.floor(product.maxStock)) : 999;

  function handleAdd() {
    add(
      {
        productId: product.productId,
        name: product.name,
        slug: product.slug,
        unitPriceTtc: product.unitPriceTtc,
        reference: product.reference,
        hasImage: product.hasImage,
        maxStock: product.maxStock,
      },
      qty,
    );
    setAdded(true);
    showToast(`${product.name} ajouté au panier`);
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (compact) {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={handleAdd}
        disabled={disabled}
        aria-label={`Ajouter ${product.name} au panier`}
      >
        {added ? <Check size={15} /> : <ShoppingCart size={15} />}
      </button>
    );
  }

  return (
    <div className="pdp-actions">
      <div className="qty-stepper" aria-label="Quantité">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
        <input
          type="number"
          value={qty}
          min={1}
          max={maxQty}
          onChange={(e) => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
          aria-label="Quantité"
        />
        <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Augmenter">+</button>
      </div>
      <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={disabled}>
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {added ? 'Ajouté !' : 'Ajouter au panier'}
      </button>
    </div>
  );
}