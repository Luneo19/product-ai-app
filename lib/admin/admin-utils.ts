import { createClient } from '@supabase/supabase-js'

// Types pour l'admin
export interface AdminUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'super_admin'
  first_name?: string
  last_name?: string
  avatar_url?: string
  is_active: boolean
  last_login?: string
  created_at: string
}

export interface Tenant {
  id: string
  slug: string
  name: string
  domain?: string
  api_key?: string
  status: 'active' | 'inactive' | 'suspended'
  plan: 'free' | 'pro' | 'enterprise'
  limits: {
    monthly_generations: number
    concurrent_jobs: number
  }
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AdminLog {
  id: string
  admin_user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface TenantStats {
  tenant_id: string
  tenant_name: string
  total_products: number
  total_jobs: number
  total_orders: number
  monthly_generations: number
  plan: string
  status: string
}

/**
 * Vérifie si un utilisateur est admin
 */
export async function checkAdminAccess(userEmail: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data, error } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('email', userEmail)
      .single()

    if (error || !data) {
      return false
    }

    return data.is_active && ['admin', 'super_admin'].includes(data.role)
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return false
  }
}

/**
 * Récupère tous les tenants avec leurs statistiques
 */
export async function getTenantsWithStats(): Promise<TenantStats[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Requête complexe pour obtenir les stats
    const { data, error } = await supabase
      .rpc('get_tenants_stats')

    if (error) {
      console.error('Erreur récupération stats tenants:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur récupération tenants:', error)
    return []
  }
}

/**
 * Récupère les logs admin
 */
export async function getAdminLogs(limit = 50, offset = 0): Promise<AdminLog[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select(`
        *,
        admin_user:users!admin_logs_admin_user_id_fkey (
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erreur récupération logs admin:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur récupération logs:', error)
    return []
  }
}

/**
 * Met à jour un tenant
 */
export async function updateTenant(
  tenantId: string, 
  updates: Partial<Tenant>,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Définir le contexte admin pour l'audit
    await supabase.rpc('set_admin_context', {
      admin_user_id: adminUserId,
      current_user_email: adminUserId
    })

    const { error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', tenantId)

    if (error) {
      console.error('Erreur mise à jour tenant:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur mise à jour tenant:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Crée un nouveau tenant
 */
export async function createTenant(
  tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>,
  adminUserId: string
): Promise<{ success: boolean; tenant?: Tenant; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Définir le contexte admin pour l'audit
    await supabase.rpc('set_admin_context', {
      admin_user_id: adminUserId,
      current_user_email: adminUserId
    })

    const { data, error } = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single()

    if (error) {
      console.error('Erreur création tenant:', error)
      return { success: false, error: error.message }
    }

    return { success: true, tenant: data }
  } catch (error) {
    console.error('Erreur création tenant:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Supprime un tenant
 */
export async function deleteTenant(
  tenantId: string,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Définir le contexte admin pour l'audit
    await supabase.rpc('set_admin_context', {
      admin_user_id: adminUserId,
      current_user_email: adminUserId
    })

    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId)

    if (error) {
      console.error('Erreur suppression tenant:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur suppression tenant:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Génère une nouvelle API key pour un tenant
 */
export async function generateApiKey(tenantId: string): Promise<string> {
  const crypto = require('crypto')
  return `prodai_${crypto.randomBytes(32).toString('hex')}`
}

/**
 * Récupère les statistiques globales
 */
export async function getGlobalStats(): Promise<{
  total_tenants: number
  total_products: number
  total_jobs: number
  total_orders: number
  active_tenants: number
  monthly_revenue: number
}> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data, error } = await supabase
      .rpc('get_global_stats')

    if (error) {
      console.error('Erreur récupération stats globales:', error)
      return {
        total_tenants: 0,
        total_products: 0,
        total_jobs: 0,
        total_orders: 0,
        active_tenants: 0,
        monthly_revenue: 0
      }
    }

    return data || {
      total_tenants: 0,
      total_products: 0,
      total_jobs: 0,
      total_orders: 0,
      active_tenants: 0,
      monthly_revenue: 0
    }
  } catch (error) {
    console.error('Erreur récupération stats:', error)
    return {
      total_tenants: 0,
      total_products: 0,
      total_jobs: 0,
      total_orders: 0,
      active_tenants: 0,
      monthly_revenue: 0
    }
  }
}

/**
 * Middleware pour vérifier l'accès admin
 */
export async function requireAdmin(request: Request): Promise<AdminUser> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Récupérer l'email depuis les headers ou le token
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    throw new Error('Authorization header required')
  }

  const token = authHeader.replace('Bearer ', '')
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      throw new Error('Invalid token')
    }

    // Vérifier si l'utilisateur est admin
    const isAdmin = await checkAdminAccess(user.email!)
    if (!isAdmin) {
      throw new Error('Admin access required')
    }

    // Récupérer les détails de l'utilisateur
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (userError || !adminUser) {
      throw new Error('Admin user not found')
    }

    return adminUser
  } catch (error) {
    throw new Error('Admin authentication failed')
  }
}
