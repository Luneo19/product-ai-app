import { NextResponse } from 'next/server'
import slugify from 'slugify'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@/lib/supabase/server-client';
import { randomUUID } from 'crypto';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: 'deh4aokbx',
  api_key: '541766291559917',
  api_secret: 's0yc_QR4w9IsM6_HRq2hM5SDnfI',
});

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Le prompt est manquant' }, { status: 400 })
    }

    // Version de test avec des valeurs statiques
    const description = "Voici une description de test pour " + prompt;
    
    // URL de l'image de test
    const imageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiM0Mjg1RjQiLz48L3N2Zz4=";
    if (!imageUrl) {
      return NextResponse.json({ error: "Échec de génération de l'image" }, { status: 500 });
    }

    // Upload image sur Cloudinary (re-host depuis URL)
    const uploadRes = await cloudinary.uploader.upload(imageUrl, {
      folder: 'product-ai',
      public_id: randomUUID(),
    });

    // Génération d'un slug unique
    const date = new Date();
    const timestamp = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0');
    const slug = slugify(prompt.slice(0, 60), { lower: true, strict: true }) + '-' + timestamp;

    // Enregistrement dans la base de données
    const { error } = await supabase.from('products').insert([
      {
        prompt,
        description,
        slug,
        image_url: uploadRes.secure_url,
        user_id: session.user.id
      },
    ]);

    if (error) {
      console.error('Erreur Supabase:', error.message);
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 });
    }

    // Envoi de la réponse
    return NextResponse.json({
      image: uploadRes.secure_url,
      description,
      slug,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur du serveur';
    console.error('Erreur API:', errorMessage);
    return NextResponse.json({ error: 'Erreur du serveur' }, { status: 500 });
  }
}
