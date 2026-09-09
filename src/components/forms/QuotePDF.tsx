'use client';

import { formatFCFA } from '@/lib/utils';
import { SITE_NAME, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE_DEFAULT } from '@/lib/constants';

interface QuoteItem {
  name: string;
  reference: string | null;
  quantity: number;
  unitPriceTtc: number;
}

interface QuotePDFProps {
  items: QuoteItem[];
  reference: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCompany?: string;
  comment?: string;
}

export function QuotePDF({ items, reference, customerName, customerPhone, customerEmail, customerCompany, comment }: QuotePDFProps) {
  const subtotal = items.reduce((acc, item) => acc + item.unitPriceTtc * item.quantity, 0);
  const freeShipping = FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping ? 0 : SHIPPING_FEE_DEFAULT;
  const total = subtotal + shippingFee;
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="quote-pdf" id="quote-pdf-content">
      <div className="quote-pdf-header">
        <div className="quote-pdf-brand">
          <div className="quote-pdf-logo">
            <img src="/logo.png" alt={SITE_NAME} />
          </div>
          <div className="quote-pdf-company">
            <h1>{SITE_NAME}</h1>
            <p>Votre partenaire en matériel électrique</p>
          </div>
        </div>
        <div className="quote-pdf-meta">
          <div className="quote-pdf-meta-item">
            <span className="quote-pdf-meta-label">DEVIS</span>
            <span className="quote-pdf-meta-value">{reference}</span>
          </div>
          <div className="quote-pdf-meta-item">
            <span className="quote-pdf-meta-label">Date</span>
            <span className="quote-pdf-meta-value">{date}</span>
          </div>
          <div className="quote-pdf-meta-item">
            <span className="quote-pdf-meta-label">Validité</span>
            <span className="quote-pdf-meta-value">30 jours</span>
          </div>
        </div>
      </div>

      {(customerName || customerCompany) && (
        <div className="quote-pdf-customer">
          <h3>Client</h3>
          <div className="quote-pdf-customer-details">
            {customerName && <p><strong>{customerName}</strong></p>}
            {customerCompany && <p>{customerCompany}</p>}
            {customerPhone && <p>Tél : {customerPhone}</p>}
            {customerEmail && <p>Email : {customerEmail}</p>}
          </div>
        </div>
      )}

      <div className="quote-pdf-products">
        <h3>Descriptif des produits</h3>
        <table className="quote-pdf-table">
          <thead>
            <tr>
              <th className="text-left">Référence</th>
              <th className="text-left">Désignation</th>
              <th className="text-center">Qté</th>
              <th className="text-right">Prix unitaire</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="text-left">{item.reference || '-'}</td>
                <td className="text-left">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{formatFCFA(item.unitPriceTtc)}</td>
                <td className="text-right">{formatFCFA(item.unitPriceTtc * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="quote-pdf-totals">
        <div className="quote-pdf-total-row">
          <span>Sous-total TTC</span>
          <span>{formatFCFA(subtotal)}</span>
        </div>
        <div className="quote-pdf-total-row">
          <span>Livraison</span>
          <span className={freeShipping ? 'text-green' : ''}>
            {freeShipping ? 'GRATUITE' : formatFCFA(shippingFee)}
          </span>
        </div>
        {!freeShipping && (
          <div className="quote-pdf-free-shipping">
            <p>Livraison gratuite à partir de {formatFCFA(FREE_SHIPPING_THRESHOLD)}</p>
          </div>
        )}
        <div className="quote-pdf-total-row quote-pdf-grand-total">
          <span>Total estimé</span>
          <span>{formatFCFA(total)}</span>
        </div>
      </div>

      {comment && (
        <div className="quote-pdf-comment">
          <h3>Commentaire</h3>
          <p>{comment}</p>
        </div>
      )}

      <div className="quote-pdf-footer">
        <div className="quote-pdf-terms">
          <h4>Conditions</h4>
          <ul>
            <li>Ce devis est valable 30 jours à compter de la date d'émission.</li>
            <li>Les prix indiqués sont susceptibles de modification après cette période.</li>
            <li>Le définitif sera confirmé par notre équipe après vérification des stocks.</li>
            <li>Le paiement s'effectue à la confirmation de la commande.</li>
          </ul>
        </div>
        <div className="quote-pdf-signature">
          <p className="quote-pdf-signature-label">Cachet et signature</p>
          <div className="quote-pdf-signature-box"></div>
        </div>
      </div>
    </div>
  );
}

export function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Créer une fenêtre d'impression
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour télécharger le PDF.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 40px; background: #fff; }
        
        .quote-pdf { max-width: 800px; margin: 0 auto; }
        
        .quote-pdf-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0a1a33; }
        .quote-pdf-brand { display: flex; align-items: center; gap: 16px; }
        .quote-pdf-logo img { height: 60px; width: auto; }
        .quote-pdf-company h1 { font-size: 20px; color: #0a1a33; font-weight: 800; }
        .quote-pdf-company p { font-size: 12px; color: #5b6b7e; }
        .quote-pdf-meta { text-align: right; }
        .quote-pdf-meta-item { margin-bottom: 8px; }
        .quote-pdf-meta-label { display: block; font-size: 10px; color: #5b6b7e; text-transform: uppercase; letter-spacing: 1px; }
        .quote-pdf-meta-value { display: block; font-size: 14px; font-weight: 700; color: #0a1a33; }
        
        .quote-pdf-customer { margin-bottom: 30px; padding: 20px; background: #f6f8fb; border-radius: 8px; }
        .quote-pdf-customer h3 { font-size: 12px; color: #5b6b7e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .quote-pdf-customer-details p { font-size: 14px; margin-bottom: 4px; }
        
        .quote-pdf-products h3 { font-size: 14px; color: #0a1a33; margin-bottom: 16px; }
        .quote-pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .quote-pdf-table th { background: #0a1a33; color: #fff; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .quote-pdf-table td { padding: 12px 16px; border-bottom: 1px solid #e4e9f0; font-size: 13px; }
        .quote-pdf-table tr:nth-child(even) { background: #f6f8fb; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        
        .quote-pdf-totals { margin-left: auto; width: 300px; margin-bottom: 30px; }
        .quote-pdf-total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .quote-pdf-total-row span:first-child { color: #5b6b7e; }
        .quote-pdf-total-row span:last-child { font-weight: 600; color: #0a1a33; }
        .quote-pdf-grand-total { border-top: 2px solid #0a1a33; margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: 700; }
        .quote-pdf-grand-total span:last-child { color: #0a1a33; font-size: 18px; }
        .text-green { color: #10b981 !important; }
        .quote-pdf-free-shipping { font-size: 11px; color: #b8901f; margin-top: 4px; }
        
        .quote-pdf-comment { margin-bottom: 30px; padding: 20px; background: #f6f8fb; border-radius: 8px; }
        .quote-pdf-comment h3 { font-size: 12px; color: #5b6b7e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .quote-pdf-comment p { font-size: 13px; color: #1a1a2e; white-space: pre-line; }
        
        .quote-pdf-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e9f0; }
        .quote-pdf-terms { flex: 1; }
        .quote-pdf-terms h4 { font-size: 12px; color: #5b6b7e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .quote-pdf-terms ul { list-style: none; padding: 0; }
        .quote-pdf-terms li { font-size: 11px; color: #5b6b7e; padding: 4px 0; padding-left: 16px; position: relative; }
        .quote-pdf-terms li::before { content: '•'; position: absolute; left: 0; color: #d4af37; }
        .quote-pdf-signature { text-align: center; margin-left: 40px; }
        .quote-pdf-signature-label { font-size: 11px; color: #5b6b7e; margin-bottom: 8px; }
        .quote-pdf-signature-box { width: 150px; height: 60px; border: 2px dashed #c3cede; border-radius: 8px; }
        
        @media print {
          body { padding: 20px; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      ${element.innerHTML}
      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="background: #0a1a33; color: #fff; border: none; padding: 12px 32px; font-size: 14px; border-radius: 8px; cursor: pointer;">
          Imprimer / Enregistrer en PDF
        </button>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
}
