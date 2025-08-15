// Version originale du code
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import slugify from 'slugify';
import { supabase } from '../../../lib/supabase/server';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

// 1️⃣ Initialisation OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 2️⃣ Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt manquant' }, { status: 400 });
    }

    // 3️⃣ Génération description produit
    const textResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "Tu es un assistant pour générer des fiches produit à partir d'idées.",
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const description = textResponse.choices[0].message.content?.trim() || '';

    // 4️⃣ Génération image via DALL·E
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Échec génération image' }, { status: 500 });
    }

    // 5️⃣ Upload image sur Cloudinary (re-host depuis URL)
    const uploadRes = await cloudinary.uploader.upload(imageUrl, {
      folder: 'product-ai',
      public_id: randomUUID(),
    });

    // 6️⃣ Génération d'un slug unique
    const date = new Date();
    const timestamp = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0');
    const slug = slugify(prompt.slice(0, 60), { lower: true, strict: true }) + '-' + timestamp;

    // 7️⃣ Enregistrement en DB
    const { error } = await supabase.from('products').insert([
      {
        prompt,
        description,
        slug,
        image_url: uploadRes.secure_url,
      },
    ]);

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: 'Erreur DB' }, { status: 500 });
    }

    // 8️⃣ Retour au frontend
    return NextResponse.json({
      image: uploadRes.secure_url,
      description,
      slug,
    });
  } catch (err: any) {
    console.error('API error:', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
