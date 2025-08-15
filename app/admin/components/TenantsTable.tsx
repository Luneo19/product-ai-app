'use client'

import { useState } from 'react'
import { Tenant } from '@/lib/admin/admin-utils'

interface TenantsTableProps {
  tenants: Tenant[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterStatus: 'all' | 'active' | 'inactive' | 'suspended'
  setFilterStatus: (status: 'all' | 'active' | 'inactive' | 'suspended') => void
  filterPlan: 'all' | 'free' | 'pro' | 'enterprise'
  setFilterPlan: (plan: 'all' | 'free' | 'pro' | 'enterprise') => void
  onUpdate: (tenantId: string, updates: Partial<Tenant>) => Promise<boolean>
  onDelete: (tenantId: string) => Promise<boolean>
}

export default function TenantsTable({
  tenants,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPlan,
  setFilterPlan,
  onUpdate,
  onDelete
}: TenantsTableProps) {
  const [editingTenant, setEditingTenant] = useState<string | null>(null)
  const [updatingTenant, setUpdatingTenant] = useState<string | null>(null)

  const handleEdit = (tenantId: string) => {
    setEditingTenant(tenantId)
  }

  const handleSave = async (tenantId: string, updates: Partial<Tenant>) => {
    setUpdatingTenant(tenantId)
    const success = await onUpdate(tenantId, updates)
    if (success) {
      setEditingTenant(null)
    }
    setUpdatingTenant(null)
  }

  const handleCancel = () => {
    setEditingTenant(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'pro':
        return 'bg-blue-100 text-blue-800'
      case 'free':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filtres et recherche */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, slug ou domaine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>

          {/* Filtre plan */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domaine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Limites
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                    <div className="text-sm text-gray-500">{tenant.slug}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTenant === tenant.id ? (
                    <input
                      type="text"
                      defaultValue={tenant.domain || ''}
                      onBlur={(e) => handleSave(tenant.id, { domain: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{tenant.domain || '-'}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTenant === tenant.id ? (
                    <select
                      defaultValue={tenant.status}
                      onBlur={(e) => handleSave(tenant.id, { status: e.target.value as any })}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                      {tenant.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTenant === tenant.id ? (
                    <select
                      defaultValue={tenant.plan}
                      onBlur={(e) => handleSave(tenant.id, { plan: e.target.value as any })}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="free">Gratuit</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(tenant.plan)}`}>
                      {tenant.plan}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tenant.limits.monthly_generations} générations/mois
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tenant.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingTenant === tenant.id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleCancel()}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={updatingTenant === tenant.id}
                      >
                        Annuler
                      </button>
                      {updatingTenant === tenant.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(tenant.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDelete(tenant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination ou message vide */}
      {tenants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Aucun tenant trouvé</div>
          <div className="text-gray-400 text-sm mt-2">
            {searchQuery || filterStatus !== 'all' || filterPlan !== 'all' 
              ? 'Essayez de modifier vos filtres' 
              : 'Commencez par créer votre premier tenant'
            }
          </div>
        </div>
      )}
    </div>
  )
}
