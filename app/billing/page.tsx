'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import Link from 'next/link'

interface BillingData {
  subscription_status: string
  current_period_end: string
  plan_name: string
  amount: number
  currency: string
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { supabase } = useSupabase()

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Récupérer les données de billing depuis l'API
      const response = await fetch('/api/billing/status', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBillingData(data)
      } else {
        setError('Erreur lors du chargement des données de billing')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/billing-simple/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          customerEmail: session.user.email,
          name: session.user.email?.split('@')[0] || 'Client'
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors de la création de la session de paiement')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      return
    }

    try {
      setCheckoutLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        await fetchBillingData() // Recharger les données
      } else {
        setError('Erreur lors de l\'annulation de l\'abonnement')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations de billing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Luneo
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de l'abonnement
          </h1>
          <p className="text-gray-600">
            Gérez votre plan d'abonnement et vos informations de paiement
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan actuel</h2>
          
          {billingData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{billingData.plan_name}</h3>
                  <p className="text-sm text-gray-600">
                    {billingData.amount} {billingData.currency}/mois
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  billingData.subscription_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {billingData.subscription_status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {billingData.subscription_status === 'active' && (
                <div className="text-sm text-gray-600">
                  <p>Prochain paiement : {new Date(billingData.current_period_end).toLocaleDateString()}</p>
                </div>
              )}

              <div className="flex space-x-4">
                {billingData.subscription_status === 'active' ? (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={checkoutLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Annulation...' : 'Annuler l\'abonnement'}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={checkoutLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Redirection...' : 'Mettre à niveau'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun abonnement actif
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par choisir un plan pour accéder à toutes les fonctionnalités
              </p>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? 'Redirection...' : 'Choisir un plan'}
              </button>
            </div>
          )}
        </div>

        {/* Plans Available */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Plans disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan Starter */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">Gratuit</div>
                <p className="text-sm text-gray-600">Pour commencer</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Jusqu'à 100 clients</li>
                <li>• Billing Stripe basique</li>
                <li>• Support email</li>
                <li>• API REST</li>
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Plan actuel
              </button>
            </div>

            {/* Plan Pro */}
            <div className="border-2 border-blue-600 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Recommandé
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">99€/mois</div>
                <p className="text-sm text-gray-600">Pour les entreprises</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Clients illimités</li>
                <li>• Billing avancé</li>
                <li>• Dashboard admin</li>
                <li>• Support prioritaire</li>
                <li>• Analytics avancées</li>
                <li>• Webhooks personnalisés</li>
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? 'Redirection...' : 'Choisir ce plan'}
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">Sur mesure</div>
                <p className="text-sm text-gray-600">Pour les grandes entreprises</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Tout du plan Pro</li>
                <li>• Déploiement dédié</li>
                <li>• Support 24/7</li>
                <li>• SLA garanti</li>
                <li>• Formation sur site</li>
                <li>• Intégrations personnalisées</li>
              </ul>
              <button
                onClick={() => window.open('mailto:contact@luneo.app?subject=Plan Enterprise')}
                className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Contactez-nous
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique des paiements</h2>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Historique en cours de développement
            </h3>
            <p className="text-gray-600">
              Cette fonctionnalité sera bientôt disponible pour consulter vos factures et paiements.
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎧</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe support est là pour vous aider avec vos questions de billing.
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:support@luneo.app"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@luneo.app
                </a>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Temps de réponse &lt; 2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
