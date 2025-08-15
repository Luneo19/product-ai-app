import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server-client'
import { checkAdminAccess } from '@/lib/admin/admin-utils'
import AdminDashboard from './components/AdminDashboard'

export default async function AdminPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = await checkAdminAccess(session.user.email!)
  
  if (!isAdmin) {
    redirect('/')
  }

  return <AdminDashboard />
}
