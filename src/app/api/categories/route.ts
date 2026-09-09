import { NextResponse } from 'next/server';
import { productService } from '@/services/product.service';

export const revalidate = 300;

export async function GET() {
  try { return NextResponse.json(await productService.categories()); }
  catch (error) { console.error('[API categories]', error); return NextResponse.json({ error: 'Catégories indisponibles.' }, { status: 503 }); }
}