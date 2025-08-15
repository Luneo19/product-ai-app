import { NextResponse } from 'next/server'
import { generateJWTFromAPIKey } from '@/lib/supabase/jwt-utils'

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // Générer le JWT depuis l'API key
    const jwt = await generateJWTFromAPIKey(apiKey)

    return NextResponse.json({
      success: true,
      jwt,
      expires_in: 3600 // 1 heure
    })

  } catch (error: unknown) {
    console.error('Erreur génération JWT:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Invalid or inactive API key')) {
      return NextResponse.json(
        { error: 'Invalid or inactive API key' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 