import { NextResponse } from 'next/server';
import { productService } from '@/services/product.service';
import { PAGE_SIZE_DEFAULT, MAX_PAGE_SIZE } from '@/lib/constants';
import { parseIntSafe } from '@/lib/utils';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseIntSafe(searchParams.get('page'), 1));
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, parseIntSafe(searchParams.get('pageSize'), PAGE_SIZE_DEFAULT)));
  const categoryId = parseIntSafe(searchParams.get('categoryId'), 0) || undefined;
  const sort = searchParams.get('sort');
  const validSort = ['relevance', 'price_asc', 'price_desc', 'newest'].includes(sort ?? '')
    ? (sort as 'relevance' | 'price_asc' | 'price_desc' | 'newest')
    : undefined;

  try {
    const result = await productService.list({
      search: searchParams.get('q')?.trim() || undefined,
      categoryId,
      brand: searchParams.get('brand')?.trim() || undefined,
      inStockOnly: searchParams.get('available') === '1',
      sort: validSort,
    }, page, pageSize);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    console.error('[API products]', error);
    return NextResponse.json({ error: 'Catalogue indisponible.' }, { status: 503 });
  }
}