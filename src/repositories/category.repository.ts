/** Repository catégories & infos boutique — lecture seule. */
import { prisma } from '@/lib/prisma';
import { BOUTIQUE_ID, TENANT_ID } from '@/lib/constants';
import { Prisma } from '@prisma/client';

export const categoryRepository = {
  async listWithCounts(): Promise<{ id_categorie: number; nom_categorie: string; _count: { Produits: number } }[]> {
    return prisma.categories.findMany({
      where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: {
        id_categorie: true,
        nom_categorie: true,
        _count: {
          select: { Produits: { where: { is_deleted: false, id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID } } },
        },
      },
      orderBy: { nom_categorie: 'asc' },
    });
  },

  async findById(id: number) {
    return prisma.categories.findFirst({
      where: { id_categorie: id, id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: { id_categorie: true, nom_categorie: true },
    });
  },

  /** Catégorie résolue depuis un slug "...-{id}". */
  async findBySlugId(id: number) {
    return this.findById(id);
  },
};

/** Infos boutique + tenant + TVA (lecture). */
export const siteRepository = {
  async getTvaRate(): Promise<number> {
    const param = await prisma.parametres_Boutique.findFirst({
      where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: { taux_tva_defaut: true },
    });
    if (param && Number(param.taux_tva_defaut) >= 0) return Number(param.taux_tva_defaut) / 100;
    // Repli : 18 % (CI) — configurable via env
    const fallback = Number(process.env.TAX_RATE_DEFAULT ?? 18) / 100;
    return fallback;
  },

  async getShopInfo(): Promise<{
    boutique: { nom: string; adresse: string | null; ville: string | null; telephone: string | null; email: string | null } | null;
    tenant: { nom_entreprise: string; email_contact: string; telephone_contact: string | null; adresse_facturation: string | null } | null;
    tvaRate: number;
  }> {
    const boutique = await prisma.boutiques.findFirst({
      where: { id_boutique: BOUTIQUE_ID, id_tenant: TENANT_ID, is_deleted: false },
      select: { nom: true, adresse: true, ville: true, telephone: true, email: true },
    });
    const tenant = await prisma.tenants.findFirst({
      where: { id_tenant: TENANT_ID, is_deleted: false },
      select: { nom_entreprise: true, email_contact: true, telephone_contact: true, adresse_facturation: true },
    });
    return { boutique, tenant, tvaRate: await this.getTvaRate() };
  },

  async countProducts(): Promise<number> {
    return prisma.produits.count({
      where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
    });
  },

  async getPriceRange(): Promise<{ min: number; max: number } | null> {
    const result = await prisma.$queryRaw<
      { min_price: Prisma.Decimal | null; max_price: Prisma.Decimal | null }[]
    >(
      Prisma.sql`SELECT MIN(prix_unitaire_vente_ht) AS min_price, MAX(prix_unitaire_vente_ht) AS max_price FROM Produits WHERE id_tenant = ${TENANT_ID} AND id_boutique = ${BOUTIQUE_ID} AND is_deleted = 0 AND status <> 'DRAFT'`,
    );
    if (!result[0] || result[0].min_price === null) return null;
    return { min: Number(result[0].min_price), max: Number(result[0].max_price) };
  },
};