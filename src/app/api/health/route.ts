import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TENANT_ID, BOUTIQUE_ID } from '@/lib/constants';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await prisma.boutiques.findFirst({ where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID }, select: { id_boutique: true } });
    return NextResponse.json({ status: 'ok', service: 'gues-energy', database: 'ok', tenantId: TENANT_ID, boutiqueId: BOUTIQUE_ID });
  } catch (error) {
    console.error('[API health]', error);
    return NextResponse.json({ status: 'degraded', service: 'gues-energy', database: 'unavailable' }, { status: 503 });
  }
}