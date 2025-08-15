import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function GET() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
} 