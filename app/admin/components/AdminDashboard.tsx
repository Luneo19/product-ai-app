'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tenant, AdminLog, TenantStats } from '@/lib/admin/admin-utils'
import TenantsTable from './TenantsTable'
import StatsCards from './StatsCards'
import AdminLogs from './AdminLogs'
import CreateTenantModal from './CreateTenantModal'
import Link from 'next/link'

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [tenantStats, setTenantStats] = useState<TenantStats[]>([])
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([])
  const [globalStats, setGlobalStats] = useState({
    total_tenants: 0,
    total_products: 0,
    total_jobs: 0,
    total_orders: 0,
    active_tenants: 0,
    monthly_revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'logs'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all')

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Récupérer les tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })

      if (tenantsError) {
        console.error('Erreur récupération tenants:', tenantsError)
      } else {
        setTenants(tenantsData || [])
      }

      // Récupérer les logs admin
      const { data: logsData, error: logsError } = await supabase
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
        .limit(50)

      if (logsError) {
        console.error('Erreur récupération logs:', logsError)
      } else {
        setAdminLogs(logsData || [])
      }

      // Calculer les stats globales
      const stats = {
        total_tenants: tenantsData?.length || 0,
        total_products: 0,
        total_jobs: 0,
        total_orders: 0,
        active_tenants: tenantsData?.filter(t => t.status === 'active').length || 0,
        monthly_revenue: 0
      }

      setGlobalStats(stats)

    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTenantUpdate = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', tenantId)

      if (error) {
        console.error('Erreur mise à jour tenant:', error)
        return false
      }

      // Mettre à jour l'état local
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, ...updates } : t
      ))

      return true
    } catch (error) {
      console.error('Erreur mise à jour tenant:', error)
      return false
    }
  }

  const handleTenantDelete = async (tenantId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tenant ? Cette action est irréversible.')) {
      return false
    }

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId)

      if (error) {
        console.error('Erreur suppression tenant:', error)
        return false
      }

      // Mettre à jour l'état local
      setTenants(prev => prev.filter(t => t.id !== tenantId))
      return true
    } catch (error) {
      console.error('Erreur suppression tenant:', error)
      return false
    }
  }

  const handleCreateTenant = async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single()

      if (error) {
        console.error('Erreur création tenant:', error)
        return false
      }

      // Ajouter à l'état local
      setTenants(prev => [data, ...prev])
      setShowCreateModal(false)
      return true
    } catch (error) {
      console.error('Erreur création tenant:', error)
      return false
    }
  }

  // Filtrer les tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.domain?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan

    return matchesSearch && matchesStatus && matchesPlan
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Luneo
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">👑 Dashboard Admin</h1>
                <p className="text-gray-600 text-sm">Gestion des tenants et monitoring système</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                ← Retour au Dashboard
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                + Nouveau Tenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <nav className="flex space-x-1">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: '📊' },
              { id: 'tenants', name: 'Tenants', icon: '🏢' },
              { id: 'logs', name: 'Logs Admin', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <StatsCards stats={globalStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tenants récents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tenants Récents</h3>
                  <Link
                    href="#"
                    onClick={() => setActiveTab('tenants')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voir tout →
                  </Link>
                </div>
                <div className="space-y-3">
                  {tenants.slice(0, 5).map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {tenant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                          tenant.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tenant.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tenant.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                          tenant.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tenant.plan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
                  <Link
                    href="#"
                    onClick={() => setActiveTab('logs')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voir tout →
                  </Link>
                </div>
                <div className="space-y-3">
                  {adminLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📝</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {log.action} {log.resource_type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleDateString()} à {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Tenants</p>
                    <p className="text-3xl font-bold">{globalStats.total_tenants}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Tenants Actifs</p>
                    <p className="text-3xl font-bold">{globalStats.active_tenants}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Produits</p>
                    <p className="text-3xl font-bold">{globalStats.total_products}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Jobs en Cours</p>
                    <p className="text-3xl font-bold">{globalStats.total_jobs}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <TenantsTable
            tenants={filteredTenants}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPlan={filterPlan}
            setFilterPlan={setFilterPlan}
            onUpdate={handleTenantUpdate}
            onDelete={handleTenantDelete}
          />
        )}

        {activeTab === 'logs' && (
          <AdminLogs logs={adminLogs} />
        )}
      </div>

      {/* Modal création tenant */}
      {showCreateModal && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTenant}
        />
      )}
    </div>
  )
}
