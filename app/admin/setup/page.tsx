'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setMessage('Vous devez être connecté pour créer un compte admin')
        return
      }

      // Créer ou mettre à jour l'utilisateur admin
      const { error } = await supabase
        .from('users')
        .upsert({
          email: user.email,
          role: 'super_admin',
          first_name: 'Admin',
          last_name: 'Product AI',
          is_active: true
        })

      if (error) {
        console.error('Erreur création admin:', error)
        setMessage('Erreur lors de la création du compte admin')
        return
      }

      setSuccess(true)
      setMessage('Compte admin créé avec succès ! Vous pouvez maintenant accéder au dashboard admin.')
      
      // Rediriger vers le dashboard admin après 2 secondes
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)

    } catch (error) {
      console.error('Erreur setup admin:', error)
      setMessage('Erreur lors de la configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👑 Setup Admin</h1>
            <p className="text-gray-600">
              Configurez votre compte administrateur pour accéder au dashboard
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSetupAdmin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de l&apos;administrateur
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Configuration...</span>
                  </div>
                ) : (
                  'Créer le compte Admin'
                )}
              </button>

              {message && (
                <div className={`p-4 rounded-lg ${
                  success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Compte Admin créé !
              </h2>
              <p className="text-gray-600 mb-4">
                Redirection vers le dashboard admin...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <h3 className="font-medium mb-2">Instructions :</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Connectez-vous avec votre compte</li>
                <li>Cliquez sur &quot;Créer le compte Admin&quot;</li>
                <li>Vous serez redirigé vers le dashboard admin</li>
                <li>Vous pourrez gérer tous vos tenants</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
