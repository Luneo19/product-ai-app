'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AdminLinkProps {
  userEmail: string
}

export default function AdminLink({ userEmail }: AdminLinkProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAdminStatus()
  }, [userEmail])

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('email', userEmail)
        .single()

      if (!error && data) {
        setIsAdmin(data.is_active && ['admin', 'super_admin'].includes(data.role))
      }
    } catch (error) {
      console.error('Erreur vérification admin:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !isAdmin) {
    return null
  }

  return (
    <Link
      href="/admin"
      className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
    >
      👑 Admin
    </Link>
  )
}
