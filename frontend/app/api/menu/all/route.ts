const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/menu/all`);
    if (!res.ok) {
      throw new Error('Failed to fetch menu items');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}