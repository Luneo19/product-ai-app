export const metadata = {
  title: 'Luneo - Plateforme SaaS Moderne',
  description: 'Créez votre SaaS en quelques minutes avec Luneo. Billing automatisé, multi-tenancy, et intégrations professionnelles.',
}

import { createClient } from '@/lib/supabase/server-client'
import SupabaseProvider from '@/lib/supabase-provider'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body className="antialiased">
        <SupabaseProvider session={session}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
