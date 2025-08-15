'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erreur lors de la déconnexion:', error)
      } else {
        router.push('/login')
      }
    } catch (err) {
      console.error('Erreur inattendue:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          Déconnexion...
        </div>
      ) : (
        'Déconnexion'
      )}
    </button>
  )
} 