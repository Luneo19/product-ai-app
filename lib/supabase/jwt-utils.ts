import { createClient } from '@supabase/supabase-js'
import { SignJWT, jwtVerify } from 'jose'

// Types pour la sécurité
interface TenantContext {
  tenantId: string
  tenantSlug: string
  apiKey: string
  plan: string
  permissions: string[]
}

interface JWTPayload {
  tenantId: string
  tenantSlug: string
  apiKey: string
  plan: string
  permissions: string[]
  iat: number
  exp: number
}

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_ALGORITHM = 'HS256'
const JWT_EXPIRY = '1h' // 1 heure

// Clé secrète pour JWT (en production, utilisez une clé forte)
const secretKey = new TextEncoder().encode(JWT_SECRET)

/**
 * Génère un JWT signé pour un tenant
 */
export async function generateTenantJWT(tenantContext: TenantContext): Promise<string> {
  try {
    const jwt = await new SignJWT({
      tenantId: tenantContext.tenantId,
      tenantSlug: tenantContext.tenantSlug,
      apiKey: tenantContext.apiKey,
      plan: tenantContext.plan,
      permissions: tenantContext.permissions
    })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(secretKey)

    return jwt
  } catch (error) {
    console.error('Erreur génération JWT:', error)
    throw new Error('Failed to generate JWT')
  }
}

/**
 * Valide et décode un JWT
 */
export async function validateTenantJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [JWT_ALGORITHM]
    })

    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Erreur validation JWT:', error)
    throw new Error('Invalid JWT token')
  }
}

/**
 * Extrait le tenant depuis l'API key et génère un JWT
 */
export async function generateJWTFromAPIKey(apiKey: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Récupérer les infos du tenant depuis l'API key
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('id, slug, plan, status')
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single()

    if (error || !tenant) {
      throw new Error('Invalid or inactive API key')
    }

    // Définir les permissions selon le plan
    const permissions = getPermissionsForPlan(tenant.plan)

    // Générer le JWT
    const jwt = await generateTenantJWT({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      apiKey,
      plan: tenant.plan,
      permissions
    })

    return jwt
  } catch (error) {
    console.error('Erreur génération JWT depuis API key:', error)
    throw error
  }
}

/**
 * Définit les permissions selon le plan du tenant
 */
function getPermissionsForPlan(plan: string): string[] {
  switch (plan) {
    case 'enterprise':
      return [
        'generate:unlimited',
        'export:all',
        'analytics:full',
        'support:priority',
        'custom:integrations'
      ]
    case 'pro':
      return [
        'generate:1000',
        'export:standard',
        'analytics:basic',
        'support:email'
      ]
    case 'free':
    default:
      return [
        'generate:100',
        'export:basic',
        'analytics:basic'
      ]
  }
}

/**
 * Middleware pour valider l'authentification dans les API routes
 */
export async function validateAPIRequest(request: Request): Promise<JWTPayload> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }

  const token = authHeader.substring(7) // Remove 'Bearer '
  
  try {
    // Si c'est un JWT, le valider directement
    if (token.length > 100) {
      return await validateTenantJWT(token)
    }
    
    // Sinon, traiter comme une API key et générer un JWT
    const jwt = await generateJWTFromAPIKey(token)
    return await validateTenantJWT(jwt)
  } catch (error) {
    throw new Error('Invalid authentication')
  }
}

/**
 * Vérifie si un tenant a les permissions nécessaires
 */
export function hasPermission(jwtPayload: JWTPayload, requiredPermission: string): boolean {
  return jwtPayload.permissions.includes(requiredPermission) || 
         jwtPayload.permissions.includes('generate:unlimited')
}

/**
 * Vérifie les limites du tenant
 */
export async function checkTenantLimits(tenantId: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Récupérer les limites du tenant
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('limits')
      .eq('id', tenantId)
      .single()

    if (error || !tenant) {
      return false
    }

    const monthlyLimit = tenant.limits?.monthly_generations || 100

    // Compter les générations du mois en cours
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count, error: countError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', startOfMonth.toISOString())

    if (countError) {
      return false
    }

    return (count || 0) < monthlyLimit
  } catch (error) {
    console.error('Erreur vérification limites:', error)
    return false
  }
} 