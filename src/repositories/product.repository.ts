/**
 * Repository Produits — accès lecture seule aux données GesCom
 * (source de vérité : base unifiée db56327).
 * Le filtre tenant/boutique est TOUJOURS appliqué (multi-tenant).
 */
import { prisma } from '@/lib/prisma';
import { BOUTIQUE_ID, TENANT_ID } from '@/lib/constants';
import { Prisma } from '@prisma/client';

export interface ProductListFilters {
  categoryId?: number;
  brand?: string;
  inStockOnly?: boolean;
  search?: string;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
}

export interface ProductListPage {
  items: ProductRow[];
  total: number;
}

/** Ligne Produits sélectionnée pour le catalogue (sans le BLOB). */
export interface ProductRow {
  id_produit: number;
  nom_produit: string;
  reference_interne: string | null;
  code_barres_ean13: string | null;
  unite_mesure: string | null;
  stock_actuel: Prisma.Decimal | null;
  prix_unitaire_vente_ht: Prisma.Decimal;
  caracteristiques: string | null;
  description: string | null;
  status: string;
  created_at: Date | null;
  id_categorie: number | null;
  categorie_nom: string | null;
}

const ROW_SELECT = {
  id_produit: true,
  nom_produit: true,
  reference_interne: true,
  code_barres_ean13: true,
  unite_mesure: true,
  stock_actuel: true,
  prix_unitaire_vente_ht: true,
  caracteristiques: true,
  description: true,
  status: true,
  created_at: true,
  id_categorie: true,
  Categories: { select: { id_categorie: true, nom_categorie: true } },
} satisfies Prisma.ProduitsSelect;

function toRow(p: {
  id_produit: number;
  nom_produit: string;
  reference_interne: string | null;
  code_barres_ean13: string | null;
  unite_mesure: string | null;
  stock_actuel: Prisma.Decimal | null;
  prix_unitaire_vente_ht: Prisma.Decimal;
  caracteristiques: string | null;
  description: string | null;
  status: string;
  created_at: Date | null;
  id_categorie: number | null;
  Categories: { id_categorie: number; nom_categorie: string } | null;
}): ProductRow {
  return {
    id_produit: p.id_produit,
    nom_produit: p.nom_produit,
    reference_interne: p.reference_interne,
    code_barres_ean13: p.code_barres_ean13,
    unite_mesure: p.unite_mesure,
    stock_actuel: p.stock_actuel,
    prix_unitaire_vente_ht: p.prix_unitaire_vente_ht,
    caracteristiques: p.caracteristiques,
    description: p.description,
    status: p.status,
    created_at: p.created_at,
    id_categorie: p.id_categorie,
    categorie_nom: p.Categories?.nom_categorie ?? null,
  };
}

export const productRepository = {
  async findBySlugId(id: number): Promise<ProductRow | null> {
    const found = await prisma.produits.findFirst({
      where: { id_produit: id, id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: ROW_SELECT,
    });
    return found ? toRow(found) : null;
  },

  async findByIds(ids: number[]): Promise<ProductRow[]> {
    if (ids.length === 0) return [];
    const rows = await prisma.produits.findMany({
      where: { id_produit: { in: ids }, id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: ROW_SELECT,
    });
    return rows.map(toRow);
  },

  async list(filters: ProductListFilters, page: number, pageSize: number): Promise<ProductListPage> {
    const where: Prisma.ProduitsWhereInput = {
      id_tenant: TENANT_ID,
      id_boutique: BOUTIQUE_ID,
      is_deleted: false,
    };

    if (filters.categoryId) where.id_categorie = filters.categoryId;
    if (filters.brand) where.reference_interne = filters.brand;

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { nom_produit: { contains: q } },
        { reference_interne: { contains: q } },
        { code_barres_ean13: { contains: q } },
      ];
    }

    if (filters.inStockOnly) where.stock_actuel = { gt: 0 };

    const orderBy: Prisma.ProduitsOrderByWithRelationInput[] =
      filters.sort === 'price_asc'
        ? [{ prix_unitaire_vente_ht: 'asc' }]
        : filters.sort === 'price_desc'
          ? [{ prix_unitaire_vente_ht: 'desc' }]
          : filters.sort === 'newest'
            ? [{ created_at: 'desc' }]
            : [{ nom_produit: 'asc' }];

    const [items, total] = await prisma.$transaction([
      prisma.produits.findMany({
        where,
        select: ROW_SELECT,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.produits.count({ where }),
    ]);

    return { items: items.map(toRow), total };
  },

  async autocomplete(q: string, limit = 8): Promise<ProductRow[]> {
    const rows = await prisma.produits.findMany({
      where: {
        id_tenant: TENANT_ID,
        id_boutique: BOUTIQUE_ID,
        is_deleted: false,
        OR: [
          { nom_produit: { contains: q } },
          { reference_interne: { contains: q } },
          { code_barres_ean13: { contains: q } },
        ],
      },
      select: ROW_SELECT,
      orderBy: { nom_produit: 'asc' },
      take: limit,
    });
    return rows.map(toRow);
  },

  async latest(limit = 8): Promise<ProductRow[]> {
    const rows = await prisma.produits.findMany({
      where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: ROW_SELECT,
      orderBy: { created_at: 'desc' },
      take: limit,
    });
    return rows.map(toRow);
  },

  async similar(productId: number, categoryId: number | null, limit = 4): Promise<ProductRow[]> {
    const rows = await prisma.produits.findMany({
      where: {
        id_tenant: TENANT_ID,
        id_boutique: BOUTIQUE_ID,
        is_deleted: false,
        NOT: { id_produit: productId },
        ...(categoryId ? { id_categorie: categoryId } : {}),
      },
      select: ROW_SELECT,
      orderBy: { created_at: 'desc' },
      take: limit,
    });
    return rows.map(toRow);
  },

  /** Vérifie (sans charger le BLOB) quels produits ont une image. */
  async hasImageFlags(ids: number[]): Promise<Map<number, boolean>> {
    if (ids.length === 0) return new Map();
    const results = await prisma.$queryRaw<
      { id_produit: number; has_image: number }[]
    >(
      Prisma.sql`SELECT id_produit, CASE WHEN image_product IS NULL THEN 0 ELSE 1 END AS has_image FROM Produits WHERE id_produit IN (${Prisma.join(ids)}) AND id_tenant = ${TENANT_ID} AND id_boutique = ${BOUTIQUE_ID}`,
    );
    return new Map(results.map((r) => [Number(r.id_produit), Number(r.has_image) === 1]));
  },

  /** Récupère le BLOB image d'un produit (endpoint dédié). */
  async findImageById(id: number): Promise<{ buffer: Buffer; contentType: string } | null> {
    const row = await prisma.produits.findFirst({
      where: { id_produit: id, id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false },
      select: { image_product: true },
    });
    if (!row?.image_product) return null;
    const buffer = Buffer.from(row.image_product);
    return { buffer, contentType: detectContentType(buffer) };
  },

  /** Marques disponibles (référence interne utilisée comme attribut marque). */
  async brands(limit = 30): Promise<{ brand: string; count: number }[]> {
    const results = await prisma.$queryRaw<
      { reference_interne: string | null; count: number }[]
    >(
      Prisma.sql`SELECT reference_interne, COUNT(*) AS count FROM Produits WHERE id_tenant = ${TENANT_ID} AND id_boutique = ${BOUTIQUE_ID} AND is_deleted = 0 AND reference_interne IS NOT NULL AND LTRIM(RTRIM(reference_interne)) <> '' GROUP BY reference_interne ORDER BY count DESC, reference_interne ASC`,
    );
    return results
      .filter((r) => r.reference_interne)
      .slice(0, limit)
      .map((r) => ({ brand: r.reference_interne as string, count: Number(r.count) }));
  },
};

function detectContentType(buffer: Buffer): string {
  if (buffer.length < 12) return 'application/octet-stream';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'image/png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45) return 'image/webp';
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) return 'image/bmp';
  return 'application/octet-stream';
}