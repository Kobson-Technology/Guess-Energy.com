import Link from 'next/link';
import { CartView } from '@/components/cart/CartView';
export const metadata = { title: 'Panier' };
export default function CartPage() { return <><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><span>Panier</span></div><h1>Votre panier</h1><p>Vérifiez vos articles avant de passer votre commande.</p></div></section><section className="section"><div className="container"><CartView/></div></section></>; }