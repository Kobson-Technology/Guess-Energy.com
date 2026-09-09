import { NextResponse } from 'next/server';
import { contactService } from '@/services/contact.service';
import { toAppError } from '@/lib/errors';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    return NextResponse.json(await contactService.create(await request.json()), { status: 201 });
  } catch (error) {
    const e = toAppError(error);
    if (e.status >= 500) console.error('[API contact]', error);
    return NextResponse.json({ error: e.message, code: e.code, details: e.details }, { status: e.status });
  }
}