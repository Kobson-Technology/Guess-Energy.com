/** Service Site — infos boutique publiques pour le layout & pages. */
import { siteRepository } from '@/repositories/category.repository';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import type { ShopInfo } from '@/types';

export const siteService = {
  async getShopInfo(): Promise<ShopInfo> {
    const info = await siteRepository.getShopInfo();
    return {
      name: info.tenant?.nom_entreprise ?? 'GUESS ENERGY + SARL',
      tagline: 'Votre partenaire en matériel électrique',
      phone: info.boutique?.telephone ?? info.tenant?.telephone_contact ?? null,
      email: info.boutique?.email ?? info.tenant?.email_contact ?? null,
      address: info.boutique?.adresse ?? info.tenant?.adresse_facturation ?? null,
      city: info.boutique?.ville ?? null,
      currency: 'FCFA',
      taxRate: info.tvaRate,
      whatsappNumber: getWhatsAppNumber(),
    };
  },
};