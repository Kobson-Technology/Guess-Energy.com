/**
 * Vérification de la connexion à la base unifiée db56327.
 * Usage : npm run db:check
 */
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('── Connexion SQL Server (db56327) ──');

  const tenant = await prisma.tenants.findFirst({
    where: { id_tenant: Number(process.env.GUES_TENANT_ID ?? 24) },
    select: { id_tenant: true, nom_entreprise: true, devise: true },
  });
  console.log('Tenant :', tenant);

  const boutique = await prisma.boutiques.findFirst({
    where: { id_boutique: Number(process.env.GUES_BOUTIQUE_ID ?? 3) },
    select: { id_boutique: true, nom: true, ville: true, telephone: true, est_active: true },
  });
  console.log('Boutique :', boutique);

  const productCount = await prisma.produits.count({
    where: { id_tenant: Number(process.env.GUES_TENANT_ID ?? 24), id_boutique: Number(process.env.GUES_BOUTIQUE_ID ?? 3), is_deleted: false },
  });
  console.log('Produits actifs :', productCount);

  const categories = await prisma.categories.findMany({
    where: { id_tenant: Number(process.env.GUES_TENANT_ID ?? 24), id_boutique: Number(process.env.GUES_BOUTIQUE_ID ?? 3), is_deleted: false },
    select: { id_categorie: true, nom_categorie: true },
    take: 20,
  });
  console.log('Catégories :', categories.map((c) => c.nom_categorie));

  const tva = await prisma.parametres_Boutique.findFirst({
    where: { id_tenant: Number(process.env.GUES_TENANT_ID ?? 24), id_boutique: Number(process.env.GUES_BOUTIQUE_ID ?? 3), is_deleted: false },
    select: { taux_tva_defaut: true, monnaie_defaut: true },
  });
  console.log('Paramètres :', tva);

  console.log('✅ Connexion OK');
}

main()
  .catch((error) => {
    console.error('❌ Échec connexion :', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());