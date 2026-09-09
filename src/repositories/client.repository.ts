/** Repository Clients — recherche/création dans la base unifiée. */
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { Clients } from '@prisma/client';

export type DbTx = Prisma.TransactionClient;

export type ClientLike = {
  nom_raison_sociale: string;
  email: string;
  telephone?: string | null;
  adresse_livraison?: string | null;
  type_client?: string | null;
};

export const clientRepository = {
  async findByEmail(tenantId: number, boutiqueId: number, email: string): Promise<Clients | null> {
    return prisma.clients.findFirst({
      where: {
        id_tenant: tenantId,
        id_boutique: boutiqueId,
        email: { equals: email },
        is_deleted: false,
      },
    });
  },

  /** Recherche ou crée le client associé à une commande web. */
  async findOrCreate(
    tx: DbTx,
    tenantId: number,
    boutiqueId: number,
    input: ClientLike,
  ): Promise<Clients> {
    const email = input.email.trim().toLowerCase();
    const existing = await tx.clients.findFirst({
      where: {
        id_tenant: tenantId,
        id_boutique: boutiqueId,
        email: { equals: email },
        is_deleted: false,
      },
    });
    if (existing) return existing;

    return tx.clients.create({
      data: {
        id_tenant: tenantId,
        id_boutique: boutiqueId,
        nom_raison_sociale: input.nom_raison_sociale.trim().slice(0, 150),
        email,
        telephone: input.telephone?.trim().slice(0, 20) || null,
        adresse_livraison: input.adresse_livraison?.trim() || null,
        type_client: input.type_client ?? 'B2C',
        date_inscription: new Date(),
      },
    });
  },
};