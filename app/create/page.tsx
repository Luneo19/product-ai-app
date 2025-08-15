'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePage() {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Vous devez être connecté pour créer un produit')
        return
      }

      // Créer le produit dans Supabase
      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          name: productName,
          description: description,
          user_id: session.user.id,
          status: 'processing'
        })
        .select()
        .single()

      if (insertError) {
        setError('Erreur lors de la création du produit: ' + insertError.message)
        return
      }

      setSuccess('Produit créé avec succès ! Redirection...')
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/products')
      }, 2000)

    } catch (err) {
      setError('Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
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
            Créer un nouveau produit
          </h1>
          <p className="text-gray-600">
            Décrivez votre produit et laissez l'IA générer les détails
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations du produit
              </h2>

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

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-green-400">✅</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    id="productName"
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ex: Application de gestion de tâches"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Décrivez votre produit en détail. L'IA utilisera cette description pour générer des visuels et des métadonnées..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Création en cours...
                      </div>
                    ) : (
                      'Créer le produit'
                    )}
                  </button>
                  <Link
                    href="/products"
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Annuler
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Conseils */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Conseils pour une meilleure génération
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Soyez précis dans votre description
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Mentionnez les fonctionnalités clés
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Décrivez le public cible
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Incluez le style visuel souhaité
                </li>
              </ul>
            </div>

            {/* Exemple */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Exemple de description
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Nom:</strong> TaskFlow Pro</p>
                <p><strong>Description:</strong></p>
                <p className="text-xs">
                  "Application de gestion de tâches moderne pour équipes professionnelles. 
                  Interface épurée avec drag & drop, intégration calendrier, notifications 
                  temps réel, et rapports d'équipe. Design minimaliste avec palette bleu/blanc."
                </p>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Processus de génération
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Création du produit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-400">Génération IA (2-3 min)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-400">Optimisation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-400">Prêt à utiliser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 