import { NextRequest, NextResponse } from 'next/server';
import { searchApps } from '@/lib/data';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const results = searchApps(q);
  return NextResponse.json(results);
}
