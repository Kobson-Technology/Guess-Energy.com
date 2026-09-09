/**
 * Service Contact — enregistrement des messages du formulaire de contact.
 */
import { prisma } from '@/lib/prisma';
import { BOUTIQUE_ID, TENANT_ID } from '@/lib/constants';
import { validateContact } from '@/lib/validation';
import { badRequest } from '@/lib/errors';
import type { ContactCreateInput } from '@/types';

export const contactService = {
  async create(input: ContactCreateInput): Promise<{ id: number; createdAt: string }> {
    const errors = validateContact(input);
    if (errors.length > 0) throw badRequest('Formulaire de contact invalide.', 'VALIDATION', errors);

    const created = await prisma.web_Contact.create({
      data: {
        id_tenant: TENANT_ID,
        id_boutique: BOUTIQUE_ID,
        nom: input.nom.trim().slice(0, 150),
        email: input.email.trim().slice(0, 150),
        telephone: input.telephone?.trim().slice(0, 50) || null,
        sujet: input.sujet.trim().slice(0, 100),
        message: input.message.trim().slice(0, 4000),
      },
      select: { id_message: true },
    });

    console.log(`Message de contact enregistré: id=${created.id_message}`);

    return { id: created.id_message, createdAt: new Date().toISOString() };
  },
};