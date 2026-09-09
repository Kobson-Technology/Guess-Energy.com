import { NextResponse } from 'next/server';
import { productRepository } from '@/repositories/product.repository';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id <= 0) return new NextResponse('Not found', { status: 404 });
  try {
    const image = await productRepository.findImageById(id);
    if (!image) return new NextResponse(null, { status: 404 });
    return new NextResponse(new Uint8Array(image.buffer), {
      status: 200,
      headers: { 'Content-Type': image.contentType, 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) {
    console.error('[API image]', error);
    return new NextResponse('Image indisponible', { status: 503 });
  }
}