import { NextResponse } from 'next/server';
import { orderService } from '@/services/order.service';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ reference: string }> }) {
  const { reference } = await context.params;
  if (!/^GE-\d{4}-\d{6}$/.test(reference)) return NextResponse.json({ error: 'Référence invalide.' }, { status: 400 });
  const order = await orderService.findByReference(reference);
  if (!order) return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
  return NextResponse.json(order);
}