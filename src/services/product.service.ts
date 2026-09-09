/**
 * Service Produits — orchestration lecture catalogue (Server Components + API).
 * Il applique la politique d'affichage (TVA, unités, disponibilité) sans
 * exposer la logique SQL aux composants React.
 */
import { productRepository, ProductListFilters } from '@/repositories/product.repository';
import { categoryRepository, siteRepository } from '@/repositories/category.repository';
import {
  buildCategorySlug,
  buildProductSlug,
  parseIdFromSlug,
  slugify,
} from '@/lib/utils';
import type { CategoryDTO, Paginated, ProductSummary } from '@/types';

/** Parse du champ "caracteristiques" : lignes "Label : valeur" ou items. */
export function parseFeatures(raw: string | null): { label: string; value: string }[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const features: { label: string; value: string }[] = [];
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx > 0 && idx < 80) {
      features.push({ label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() });
    } else if (line.includes('=')) {
      const eq = line.indexOf('=');
      features.push({ label: line.slice(0, eq).trim(), value: line.slice(eq + 1).trim() });
    } else {
      features.push({ label: 'Caractéristique', value: line });
    }
  }
  return features.slice(0, 40);
}
export const productService = {
  async getTaxRate(): Promise<number> {
    return siteRepository.getTvaRate();
  },

  /** Convertit une ligne brute en DTO public (prix TTC calculés serveur). */
  toSummary(
    row: {
      id_produit: number;
      nom_produit: string;
      reference_interne: string | null;
      code_barres_ean13: string | null;
      unite_mesure: string | null;
      stock_actuel: { toString(): string } | string | null;
      prix_unitaire_vente_ht: { toString(): string } | string;
      caracteristiques: string | null;
      description: string | null;
      status: string;
      created_at: Date | string | null;
      id_categorie: number | null;
      categorie_nom: string | null;
    },
    taxRate: number,
    hasImage: boolean,
  ): ProductSummary {
    const id = Number(row.id_produit);
    const name = String(row.nom_produit);
    const priceHt = Number(row.prix_unitaire_vente_ht);
    const stock = row.stock_actuel === null ? null : Number(row.stock_actuel);
    const available = stock !== null && stock > 0;
    const categoryId = row.id_categorie;

    return {
      id,
      name,
      slug: buildProductSlug(name, id),
      reference: row.reference_interne?.trim() || null,
      ean13: row.code_barres_ean13?.trim() || null,
      categoryId,
      categoryName: row.categorie_nom,
      categorySlug: row.categorie_nom ? buildCategorySlug(row.categorie_nom, categoryId ?? 0) : null,
      brand: row.reference_interne?.trim() || null,
      unit: row.unite_mesure?.trim() || null,
      priceHt,
      taxRate,
      priceTtc: Number((priceHt * (1 + taxRate)).toFixed(2)),
      stock,
      available,
      lowStock: available && stock !== null && stock <= 5,
      hasImage,
      imageUrl: hasImage ? `/api/products/${id}/image` : null,
      description: row.description,
      features: parseFeatures(row.caracteristiques),
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    };
  },

  async toSummaryList(rows: Array<{
    id_produit: number;
    nom_produit: string;
    reference_interne: string | null;
    code_barres_ean13: string | null;
    unite_mesure: string | null;
    stock_actuel: { toString(): string } | string | null;
    prix_unitaire_vente_ht: { toString(): string } | string;
    caracteristiques: string | null;
    description: string | null;
    status: string;
    created_at: Date | string | null;
    id_categorie: number | null;
    categorie_nom: string | null;
  }>, taxRate: number): Promise<ProductSummary[]> {
    if (rows.length === 0) return [];
    const flags = await productRepository.hasImageFlags(rows.map((r) => Number(r.id_produit)));
    return rows.map((row) => this.toSummary(row, taxRate, flags.get(Number(row.id_produit)) ?? false));
  },

  async list(filters: ProductListFilters, page = 1, pageSize = 24): Promise<Paginated<ProductSummary>> {
    const taxRate = await this.getTaxRate();
    const { items, total } = await productRepository.list(filters, page, pageSize);
    const summaries = await this.toSummaryList(items, taxRate);
    return {
      items: summaries,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async detailBySlug(slug: string): Promise<ProductSummary | null> {
    const id = parseIdFromSlug(slug);
    if (!id) return null;
    const row = await productRepository.findBySlugId(id);
    if (!row) return null;
    // Sécurise le slug affiché (canonicalisation)
    const expected = buildProductSlug(row.nom_produit, row.id_produit);
    const baseExpected = slug.split('-').slice(0, -1).join('-');
    if (expected !== slug && slugify(row.nom_produit) !== baseExpected) {
      return null;
    }
    const taxRate = await this.getTaxRate();
    const flags = await productRepository.hasImageFlags([id]);
    return this.toSummary(row, taxRate, flags.get(id) ?? false);
  },

  async autocomplete(q: string, limit = 8): Promise<{ slug: string; name: string; reference: string | null; priceTtc: number }[]> {
    const taxRate = await this.getTaxRate();
    const rows = await productRepository.autocomplete(q.trim(), limit);
    return rows.map((row) => ({
      slug: buildProductSlug(row.nom_produit, row.id_produit),
      name: row.nom_produit,
      reference: row.reference_interne?.trim() || null,
      priceTtc: Number((Number(row.prix_unitaire_vente_ht) * (1 + taxRate)).toFixed(2)),
    }));
  },

  async featured(limit = 8): Promise<ProductSummary[]> {
    const taxRate = await this.getTaxRate();
    const rows = await productRepository.latest(limit);
    return this.toSummaryList(rows, taxRate);
  },

  async similar(productId: number, categoryId: number | null, limit = 4): Promise<ProductSummary[]> {
    const taxRate = await this.getTaxRate();
    const rows = await productRepository.similar(productId, categoryId, limit);
    return this.toSummaryList(rows, taxRate);
  },

  async categories(): Promise<CategoryDTO[]> {
    const rows = await categoryRepository.listWithCounts();
    return rows.map((row) => ({
      id: row.id_categorie,
      name: row.nom_categorie,
      slug: buildCategorySlug(row.nom_categorie, row.id_categorie),
      productCount: row._count.Produits,
    }));
  },

  async brands(limit = 30): Promise<{ brand: string; count: number }[]> {
    return productRepository.brands(limit);
  },
};