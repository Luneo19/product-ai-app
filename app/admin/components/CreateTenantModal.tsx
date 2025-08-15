'use client'

import { useState } from 'react'
import { Tenant } from '@/lib/admin/admin-utils'

interface CreateTenantModalProps {
  onClose: () => void
  onSubmit: (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
}

export default function CreateTenantModal({ onClose, onSubmit }: CreateTenantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    plan: 'free' as 'free' | 'pro' | 'enterprise',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    monthly_generations: 100,
    concurrent_jobs: 5
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    }

    if (formData.domain && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.domain)) {
      newErrors.domain = 'Format de domaine invalide'
    }

    if (formData.monthly_generations < 1) {
      newErrors.monthly_generations = 'Le nombre de générations doit être positif'
    }

    if (formData.concurrent_jobs < 1) {
      newErrors.concurrent_jobs = 'Le nombre de jobs concurrents doit être positif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const tenantData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        domain: formData.domain.trim() || undefined,
        plan: formData.plan,
        status: formData.status,
        limits: {
          monthly_generations: formData.monthly_generations,
          concurrent_jobs: formData.concurrent_jobs
        },
        config: {}
      }

      const success = await onSubmit(tenantData)
      
      if (success) {
        onClose()
      } else {
        setErrors({ submit: 'Erreur lors de la création du tenant' })
      }
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la création du tenant' })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Créer un nouveau tenant</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du tenant *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Ma Boutique"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ma-boutique"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Générer
              </button>
            </div>
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Utilisé pour l&apos;URL du widget</p>
          </div>

          {/* Domaine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domaine (optionnel)
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.domain ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="exemple.com"
            />
            {errors.domain && (
              <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
            )}
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={formData.plan}
              onChange={(e) => handleInputChange('plan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="free">Gratuit (100 générations/mois)</option>
              <option value="pro">Pro (1000 générations/mois)</option>
              <option value="enterprise">Enterprise (Illimité)</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          {/* Limites personnalisées */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Générations/mois
              </label>
              <input
                type="number"
                value={formData.monthly_generations}
                onChange={(e) => handleInputChange('monthly_generations', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.monthly_generations ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
              />
              {errors.monthly_generations && (
                <p className="text-red-500 text-sm mt-1">{errors.monthly_generations}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jobs concurrents
              </label>
              <input
                type="number"
                value={formData.concurrent_jobs}
                onChange={(e) => handleInputChange('concurrent_jobs', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.concurrent_jobs ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
              />
              {errors.concurrent_jobs && (
                <p className="text-red-500 text-sm mt-1">{errors.concurrent_jobs}</p>
              )}
            </div>
          </div>

          {/* Error général */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Création...</span>
                </div>
              ) : (
                'Créer le tenant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
