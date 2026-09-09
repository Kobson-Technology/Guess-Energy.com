'use client';

import Link from 'next/link';
import { ArrowRight, BatteryCharging, Cable, ChevronLeft, ChevronRight, Factory, Lightbulb, Pause, Play, Sun, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatFCFA } from '@/lib/utils';

export interface ShowcaseSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string | null;
  priceTtc?: number;
  reference?: string | null;
  icon: 'led' | 'cable' | 'generator' | 'solar' | 'battery' | 'power';
  product: boolean;
}

const ICONS = { led: Lightbulb, cable: Cable, generator: Factory, solar: Sun, battery: BatteryCharging, power: Zap };

export function ProductShowcase({ slides }: { slides: ShowcaseSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides[active] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!current) return null;
  const Icon = ICONS[current.icon];

  return (
    <aside className="hero-showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="Sélection GUESS ENERGY">
      <div className="hero-showcase-top">
        <span>EN VEDETTE</span>
        {slides.length > 1 && <button className="hero-showcase-pause" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Reprendre le diaporama' : 'Mettre en pause'}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
      </div>
      <div className="hero-showcase-visual" key={current.id}>
        {current.imageUrl ? <img src={current.imageUrl} alt={current.title} /> : <div className="hero-showcase-icon"><Icon size={66}/></div>}
        <div className="hero-showcase-glow" />
      </div>
      <div className="hero-showcase-caption">
        <span>{current.eyebrow}</span>
        <h2>{current.title}</h2>
        {current.product && current.priceTtc !== undefined && <strong>{formatFCFA(current.priceTtc)} <small>TTC</small></strong>}
        <Link href={current.href} aria-label={current.product ? `Voir ${current.title}` : `Découvrir ${current.title}`}><ArrowRight size={18}/></Link>
      </div>
      {slides.length > 1 && <>
        <button className="hero-showcase-arrow hero-showcase-prev" type="button" onClick={() => setActive((active - 1 + slides.length) % slides.length)} aria-label="Slide précédent"><ChevronLeft size={20}/></button>
        <button className="hero-showcase-arrow hero-showcase-next" type="button" onClick={() => setActive((active + 1) % slides.length)} aria-label="Slide suivant"><ChevronRight size={20}/></button>
        <div className="hero-showcase-dots" role="tablist" aria-label="Slides">
          {slides.map((slide, index) => <button key={slide.id} type="button" className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Afficher le slide ${index + 1}`} />)}
        </div>
      </>}
    </aside>
  );
}