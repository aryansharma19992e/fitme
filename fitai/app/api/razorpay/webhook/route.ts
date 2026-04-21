import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'razorpay/webhook not yet implemented' }, { status: 501 });
}
