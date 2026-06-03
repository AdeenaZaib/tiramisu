const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/api/orders/customer/${name}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
