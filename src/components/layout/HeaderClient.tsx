'use client';
/** Header interactif : recherche instantanée + panier + menu mobile. */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingCart, X, Zap } from 'lucide-react';
import { useCart } from '@/features/cart/CartContext';

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/produits', label: 'Produits' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

interface Suggestion {
  slug: string;
  name: string;
  reference: string | null;
  priceTtc: number;
}

export function HeaderClient({ siteName, quoteHref }: { siteName: string; quoteHref: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setSuggestions([]); return; }
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (res.ok) { setSuggestions(await res.json()); setOpen(true); }
      } catch { /* abort */ }
    }, 180);
    return () => { ctrl.abort(); window.clearTimeout(t); };
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/produits?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={siteName}>
          <img src="/logo.png" alt={`${siteName} — logo`} />
          <span className="brand-name">
            GUESS ENERGY<small>SARL · Matériel électrique</small>
          </span>
        </Link>

        <div className="search-wrap" ref={boxRef}>
          <form className="search-box" onSubmit={submitSearch} role="search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Rechercher un produit, une référence…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              aria-label="Rechercher un produit"
            />
          </form>
          {open && suggestions.length > 0 && (
            <div className="search-suggest">
              {suggestions.map((s) => (
                <Link key={s.slug} href={`/produits/${s.slug}`} onClick={() => setOpen(false)}>
                  <span>
                    <strong>{s.name}</strong>
                    {s.reference && <small>Réf. {s.reference}</small>}
                  </span>
                  <span className="suggest-price">{new Intl.NumberFormat('fr-FR').format(Math.round(s.priceTtc))} FCFA</span>
                </Link>
              ))}
              <Link href={`/produits?q=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)}>
                <span><strong>Voir tous les résultats</strong></span>
                <Zap size={15} />
              </Link>
            </div>
          )}
        </div>

        <nav className="nav" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/panier" className="icon-btn" aria-label="Panier">
            <ShoppingCart size={19} />
            {ready && count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <Link href={quoteHref} className="btn btn-gold btn-sm header-cta">Demander un devis</Link>
          <button className="icon-btn burger" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Menu mobile">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link href={quoteHref} style={{ color: 'var(--gold-600)' }}>Demander un devis</Link>
        </nav>
      )}

      <div className="search-mobile">
        <form className="search-box" onSubmit={submitSearch} role="search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un produit (mobile)"
          />
        </form>
      </div>
    </header>
  );
}