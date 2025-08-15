import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'
import { validateAPIRequest, hasPermission, checkTenantLimits } from '@/lib/supabase/jwt-utils'
import { v2 as cloudinary } from 'cloudinary'
import { Model3DFactory, validate3DConfig, DEFAULT_3D_CONFIG } from '@/lib/3d/generate-3d'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    // 1. Validation de l'authentification
    const jwtPayload = await validateAPIRequest(request)
    
    // 2. Vérification des permissions
    if (!hasPermission(jwtPayload, 'generate:100')) {
      return NextResponse.json(
        { error: 'Insufficient permissions for generation' },
        { status: 403 }
      )
    }

    // 3. Vérification des limites
    const withinLimits = await checkTenantLimits(jwtPayload.tenantId)
    if (!withinLimits) {
      return NextResponse.json(
        { error: 'Monthly generation limit exceeded' },
        { status: 429 }
      )
    }

    // 4. Récupération des données de la requête
    const { prompt, sku, options = {} } = await request.json()

    if (!prompt || !sku) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and sku' },
        { status: 400 }
      )
    }

    // 5. Récupération du produit depuis la base de données
    const supabase = createClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', jwtPayload.tenantId)
      .eq('sku', sku)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    // 6. Création du job en base
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        tenant_id: jwtPayload.tenantId,
        product_id: product.id,
        sku,
        prompt,
        status: 'processing',
        metadata: {
          tenant_slug: jwtPayload.tenantSlug,
          plan: jwtPayload.plan,
          options
        }
      })
      .select()
      .single()

    if (jobError) {
      console.error('Erreur création job:', jobError)
      return NextResponse.json(
        { error: 'Failed to create generation job' },
        { status: 500 }
      )
    }

    // 7. Génération de l'image (simulation pour l'instant)
    const startTime = Date.now()
    
    // TODO: Intégrer avec OpenAI DALL-E ou autre service IA
    const imageUrl = await generateImage(prompt, options)
    
    const processingTime = Date.now() - startTime

    // 8. Upload sur Cloudinary
    let cloudinaryUrl = imageUrl
    if (imageUrl.startsWith('data:')) {
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: `product-ai/${jwtPayload.tenantSlug}`,
        public_id: `${job.id}`,
        resource_type: 'image'
      })
      cloudinaryUrl = uploadResult.secure_url
    }

    // 9. Génération 3D si demandée
    let glbUrl = null
    let usdzUrl = null
    let thumbnailUrl = null
    let model3DMetadata = null
    
    if (options.generate3D) {
      try {
        // Validation de la configuration 3D
        const config3D = validate3DConfig(options.model3D || {})
        
        // Récupération du générateur 3D
        const generator = Model3DFactory.getGenerator(jwtPayload.tenantSlug)
        
        // Génération du modèle 3D
        const model3DResult = await generator.generateModel(
          cloudinaryUrl,
          config3D,
          jwtPayload.tenantSlug
        )
        
        glbUrl = model3DResult.glb_url
        usdzUrl = model3DResult.usdz_url
        thumbnailUrl = model3DResult.thumbnail_url
        model3DMetadata = model3DResult.metadata
        
        console.log('Modèle 3D généré avec succès:', {
          job_id: job.id,
          vertices: model3DMetadata.vertices,
          triangles: model3DMetadata.triangles,
          generation_time: model3DMetadata.generation_time
        })
        
      } catch (error) {
        console.error('Erreur génération 3D:', error)
        // On continue sans 3D si ça échoue
        // En production, vous pourriez vouloir notifier l'utilisateur
      }
    }

    // 10. Mise à jour du job avec les résultats
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        image_url: cloudinaryUrl,
        glb_url: glbUrl,
        usdz_url: usdzUrl,
        status: 'completed',
        processing_time_ms: processingTime,
        metadata: {
          ...job.metadata,
          model3D: model3DMetadata,
          has_3d: !!glbUrl
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id)

    if (updateError) {
      console.error('Erreur mise à jour job:', updateError)
    }

    // 11. Tracking analytics
    await supabase
      .from('analytics')
      .insert({
        tenant_id: jwtPayload.tenantId,
        event_type: 'product_generated',
        event_data: {
          job_id: job.id,
          sku,
          processing_time_ms: processingTime,
          plan: jwtPayload.plan,
          has_3d: !!glbUrl,
          model3D_metadata: model3DMetadata
        }
      })

    // 12. Réponse avec les données
    return NextResponse.json({
      success: true,
      job_id: job.id,
      image_url: cloudinaryUrl,
      glb_url: glbUrl,
      usdz_url: usdzUrl,
      thumbnail_url: thumbnailUrl,
      product: {
        name: product.product_name,
        sku: product.sku,
        base_price: product.base_price
      },
      processing_time_ms: processingTime,
      model3D: model3DMetadata,
      tenant: {
        slug: jwtPayload.tenantSlug,
        plan: jwtPayload.plan
      }
    })

  } catch (error: unknown) {
    console.error('Erreur API generate:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Invalid authentication')) {
      return NextResponse.json(
        { error: 'Invalid API key or JWT token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Génère une image à partir d'un prompt
 * TODO: Intégrer avec OpenAI DALL-E ou autre service IA
 */
async function generateImage(prompt: string, options: Record<string, unknown> = {}): Promise<string> {
  // Simulation de génération d'image
  // En production, utilisez OpenAI DALL-E ou autre service
  
  const width = (options.width as number) || 1024
  const height = (options.height as number) || 1024
  
  // Image SVG de placeholder avec le prompt
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}
      </text>
      <text x="50%" y="80%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
        Generated by Product AI
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * GET - Récupérer les jobs d'un tenant
 */
export async function GET(request: Request) {
  try {
    const jwtPayload = await validateAPIRequest(request)
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClient()
    
    let query = supabase
      .from('jobs')
      .select(`
        *,
        products (
          product_name,
          sku,
          base_price
        )
      `)
      .eq('tenant_id', jwtPayload.tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: jobs, error } = await query

    if (error) {
      console.error('Erreur récupération jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        limit,
        offset,
        has_more: jobs.length === limit
      }
    })

  } catch (error: unknown) {
    console.error('Erreur API jobs:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Invalid authentication')) {
      return NextResponse.json(
        { error: 'Invalid API key or JWT token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 