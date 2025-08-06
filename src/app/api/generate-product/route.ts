import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    // Vérifier que la clé API est définie
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API OpenAI non configurée. Veuillez configurer OPENAI_API_KEY dans .env.local' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Le prompt ne peut pas être vide' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant spécialisé dans la création de fiches produit détaillées. Génère une fiche produit complète avec nom, description, caractéristiques, prix suggéré et public cible à partir de l\'idée fournie.',
        },
        {
          role: 'user',
          content: `Crée une fiche produit complète pour: ${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const completion = response.choices[0].message.content;
    return NextResponse.json({ result: completion });
    
  } catch (error) {
    console.error('Erreur API OpenAI:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du produit. Vérifiez votre clé API OpenAI.' },
      { status: 500 }
    );
  }
}
