import { NextResponse } from 'next/server';
import { orderService } from '@/services/order.service';
import { AppError, toAppError } from '@/lib/errors';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await orderService.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const appError = toAppError(error);
    if (appError.status >= 500) console.error('[API orders]', error);
    return NextResponse.json({ error: appError.message, code: appError.code, details: appError.details }, { status: appError.status });
  }
}