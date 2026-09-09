import Link from 'next/link';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
export const metadata = { title: 'Passer la commande' };
export default function CheckoutPage() { return <><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><span>Commande</span></div><h1>Passer la commande</h1><p>Votre commande sera enregistrée dans notre système de gestion commerciale.</p></div></section><section className="section"><div className="container"><CheckoutForm/></div></section></>; }