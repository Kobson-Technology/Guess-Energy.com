import { NextResponse } from 'next/server';
import { productService } from '@/services/product.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json([]);
  try {
    return NextResponse.json(await productService.autocomplete(q, 8), { headers: { 'Cache-Control': 'public, max-age=30' } });
  } catch (error) {
    console.error('[API autocomplete]', error);
    return NextResponse.json([]);
  }
}