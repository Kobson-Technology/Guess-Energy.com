'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  rawOptions?: string[];
}

const QUICK_REPLIES = [
  'Nos produits',
  'Nos services',
  'Demander un devis',
  "Horaires d'ouverture",
  'Comment commander',
  'Où êtes-vous ?',
  'Suivre ma commande',
  'Nous contacter',
  'Livraison',
  'Paiement',
];

function buildFallbackText(query: string, shop?: { phone?: string | null; email?: string | null; address?: string | null; city?: string | null } | null): { text: string; rawOptions?: string[] } {
  const phone = shop?.phone ?? '';
  const email = shop?.email ?? '';
  const address = [shop?.address, shop?.city].filter(Boolean).join(', ');
  const contactText = [
    'Vous pouvez nous contacter par :',
    '',
    phone ? `Téléphone : ${phone}` : null,
    email ? `Email : ${email}` : null,
    address ? `Adresse : ${address}` : null,
    phone ? 'WhatsApp : Disponible 24h/24' : null,
  ].filter(Boolean).join('\n');
  const lower = query.toLowerCase().trim();
  const map: Record<string, { text: string; rawOptions?: string[] }> = {
    'nos produits': {
      text: "Nous proposons une large gamme de matériel électrique : câbles, disjoncteurs, tableaux, éclairage LED, groupes électrogènes, panneaux solaires et bien plus. Visitez notre catalogue pour découvrir tous nos produits !",
      rawOptions: ['Voir le catalogue', 'Demander un devis', 'Nous contacter'],
    },
    'demander un devis': {
      text: "Pour demander un devis, ajoutez simplement les produits souhaités à votre panier puis rendez-vous sur la page Demander un devis. Remplissez vos coordonnées et notre équipe vous répondra sous 24h !",
      rawOptions: ['Aller au devis', 'Nos produits', 'Nous contacter'],
    },
    "horaires d'ouverture": {
      text: "Nous sommes ouverts du Lundi au Samedi de 08h00 à 18h00. Le dimanche nous sommes fermés. N'hésitez pas à nous contacter par WhatsApp en dehors de ces heures !",
      rawOptions: ['Nous contacter', 'Nos produits', 'Demander un devis'],
    },
    'nous contacter': {
      text: contactText,
      rawOptions: ['Demander un devis', 'Nos produits', "Horaires d'ouverture"],
    },
    'livraison': {
      text: "Nous livrons dans toute la Côte d'Ivoire ! La livraison est GRATUITE à partir de 100 000 FCFA d'achat. En dessous, les frais de livraison sont de 5 000 FCFA. Le délai de livraison est de 24 à 72h selon votre localité.",
      rawOptions: ['Nos produits', 'Demander un devis', 'Nous contacter'],
    },
    'nos services': {
      text: "GUESS ENERGY propose :\n\nDistribution de matériels électriques (gros et détail)\nTravaux électriques : installation, pose, montage sur chantiers\nBureau d'études : analyse des besoins et dimensionnement\nSAV : suivi, assistance et maintenance après installation",
      rawOptions: ['Nos produits', 'Demander un devis', 'Nous contacter'],
    },
    'paiement': {
      text: "Aucun paiement en ligne pour le moment : après votre commande, notre équipe vous contacte par téléphone ou WhatsApp pour confirmer les modalités de paiement et de livraison.",
      rawOptions: ['Nous contacter', 'Nos produits', 'Demander un devis'],
    },
    'voir le catalogue': {
      text: "Notre catalogue est disponible en ligne ! Vous pouvez parcourir nos catégories, voir les prix et disponibilités en temps réel.",
      rawOptions: ['Voir le catalogue', 'Demander un devis', 'Nous contacter'],
    },
    'aller au devis': {
      text: "Parfait ! Cliquez sur le lien Demander un devis dans le menu, ou accédez directement à notre page devis. Ajoutez des produits à votre panier pour commencer !",
      rawOptions: ['Nos produits', 'Nous contacter', "Horaires d'ouverture"],
    },
    'comment commander': {
      text: "Commander est simple : 1) Parcourez notre catalogue, 2) Ajoutez vos articles au panier, 3) Remplissez vos coordonnées, 4) Envoyez. Notre équipe vous contacte ensuite pour confirmer paiement et livraison.",
      rawOptions: ['Voir le catalogue', 'Demander un devis', 'Nous contacter'],
    },
    'où êtes-vous': {
      text: "GUESS ENERGY est situé en Côte d'Ivoire. Pour l'adresse exacte, le téléphone et l'email, consultez notre page Contact !",
      rawOptions: ['Nous contacter', 'Nos produits', 'Demander un devis'],
    },
    'suivre ma commande': {
      text: "Pour suivre votre commande, contactez notre équipe par téléphone ou WhatsApp en précisant votre numéro de commande. Nous vous répondrons rapidement !",
      rawOptions: ['Nous contacter', 'Nos produits', 'Demander un devis'],
    },
    default: {
      text: "Merci pour votre message ! Je suis l'assistant virtuel de GUESS ENERGY. Comment puis-je vous aider aujourd'hui ?",
      rawOptions: ['Nos produits', 'Demander un devis', 'Nous contacter', 'Livraison'],
    },
  };

  for (const [key, val] of Object.entries(map)) {
    if (key !== 'default' && lower.includes(key)) return val;
  }
  if (lower.includes('produit') || lower.includes('catalogue') || lower.includes('acheter')) return map['nos produits'];
  if (lower.includes('devis') || lower.includes('prix') || lower.includes('coût')) return map['demander un devis'];
  if (lower.includes('horaire') || lower.includes('ouvert') || lower.includes('heure')) return map["horaires d'ouverture"];
  if (lower.includes('contact') || lower.includes('téléphone') || lower.includes('email') || lower.includes('adresse')) return map['nous contacter'];
  if (lower.includes('livraison') || lower.includes('expédition') || lower.includes('délai')) return map['livraison'];
  if (lower.includes('service') || lower.includes('installation') || lower.includes('travaux') || lower.includes('chantier') || lower.includes('maintenance') || lower.includes('sav') || lower.includes('étude')) return map['nos services'];
  if (lower.includes('paiement') || lower.includes('payer') || lower.includes('mobile money') || lower.includes('wave') || lower.includes('orange money') || lower.includes('carte')) return map['paiement'];
  if (lower.includes('solaire') || lower.includes('photovoltaïque') || lower.includes('panneau') || lower.includes('batterie'))
    return { text: "Nous proposons des solutions d'énergies renouvelables : panneaux photovoltaïques, convertisseurs solaires et hybrides, régulateurs de charge, batteries lithium et gel. Demandez un devis pour une solution adaptée !", rawOptions: ['Demander un devis', 'Nos produits', 'Nous contacter'] };
  if (lower.includes('groupe') || lower.includes('électrogène') || lower.includes('générateur'))
    return { text: "Nous vendons, installons et mettons en service des groupes électrogènes pour l'énergie de secours. Contactez-nous pour un dimensionnement adapté à vos besoins !", rawOptions: ['Demander un devis', 'Nous contacter', 'Nos produits'] };
  if (lower.includes('stock') || lower.includes('disponible') || lower.includes('rupture'))
    return { text: "Les disponibilités affichées sur le site proviennent en temps réel de notre système de gestion Kobson GesCom et sont revérifiées au moment de la commande. Pour un produit en rupture, demandez un devis personnalisé !", rawOptions: ['Nos produits', 'Demander un devis', 'Nous contacter'] };
  if (lower.includes('compte') || lower.includes('inscription') || lower.includes('connexion'))
    return { text: "Bonne nouvelle : vous pouvez commander sans créer de compte, en tant que visiteur, en laissant simplement vos coordonnées de contact !", rawOptions: ['Nos produits', 'Demander un devis', 'Nous contacter'] };
  if (lower.includes('annuler') || lower.includes('modifier') || lower.includes('suivi'))
    return { text: "Pour modifier ou annuler une commande, contactez notre équipe par téléphone ou WhatsApp en précisant votre numéro de commande.", rawOptions: ['Nous contacter', 'Nos produits', 'Demander un devis'] };

  return map.default;
}
export function ChatBot({ shop }: { shop?: { phone?: string | null; email?: string | null; address?: string | null; city?: string | null } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Bonjour ! ☀️ Je suis l'assistant virtuel de GUESS ENERGY. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot' as const,
      timestamp: Date.now(),
      rawOptions: [...QUICK_REPLIES],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || busyRef.current) return;
    busyRef.current = true;

    const botId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, text: userText, sender: 'user' as const, timestamp: Date.now() },
      { id: botId, text: '', sender: 'bot' as const, timestamp: Date.now() },
    ]);
    setInput('');
    setIsTyping(true);

    // Historique limité aux 10 derniers messages (limites tokens Groq)
    const history = messages
      .filter((m) => m.text)
      .slice(-10)
      .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error('chat-fail');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: fullText } : m)),
        );
      }
      // Décode le tampon final restant éventuel
      fullText += decoder.decode();

      if (!fullText.trim()) {
        const fb = buildFallbackText(userText, shop);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, text: fb.text, rawOptions: fb.rawOptions } : m,
          ),
        );
      }
    } catch {
      const fb = buildFallbackText(userText, shop);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: fb.text, rawOptions: fb.rawOptions } : m,
        ),
      );
    } finally {
      setIsTyping(false);
      busyRef.current = false;
    }
  }, [messages, shop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Bouton flottant du chat */}
      <button
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="chatbot-pulse" />}
      </button>

      {/* Fenêtre de chat */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <Bot size={20} />
            </div>
            <div>
              <h4>GUESS ENERGY</h4>
              <span className="chatbot-status">
                <span className="chatbot-status-dot" /> En ligne
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message ${message.sender}`}>
              <div className="chatbot-message-avatar">
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="chatbot-message-content">
                <div className="chatbot-message-text">{message.text}</div>
                {message.rawOptions && message.rawOptions.length > 0 && (
                  <div className="chatbot-options">
                    {message.rawOptions.map((option) => (
                      <button
                        key={option}
                        className="chatbot-option"
                        onClick={() => sendMessage(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                <span className="chatbot-message-time">
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chatbot-message bot">
              <div className="chatbot-message-avatar">
                <Bot size={16} />
              </div>
              <div className="chatbot-message-content">
                <div className="chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chatbot-input" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={isTyping}
          />
          <button type="submit" disabled={!input.trim() || isTyping}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
