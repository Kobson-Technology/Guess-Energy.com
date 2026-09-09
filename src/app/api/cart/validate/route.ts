import { NextResponse } from 'next/server';
import { cartService } from '@/services/cart.service';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try { return NextResponse.json(await cartService.hydrateCart((await request.json()).items ?? [])); }
  catch (error) { console.error('[API cart]', error); return NextResponse.json({ error: 'Panier indisponible.' }, { status: 503 }); }
}