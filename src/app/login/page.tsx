'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
// import '@supabase/auth-ui-react/dist/style.css'      // 👈 IMPORT CSS (removed - not available in current version)
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase, useSession } from '@/lib/supabase-provider'

export default function LoginPage() {
  const supabase = useSupabase()
  const session = useSession()
  const router = useRouter()

  // 1️⃣ Si une session existe, on redirige côté client
  useEffect(() => {
    if (session) {
      router.replace('/products')
    }
  }, [session, router])

  // 2️⃣ Préparer redirectTo uniquement en environnement client
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products`
      : ''   // <-- chaîne vide pour satisfaire le typage string

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion 🔐</h1>
      <div className="bg-white p-8 rounded-xl shadow">
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ theme: ThemeSupa }}
          theme="light"
          showLinks={false}
          providers={['github']}
          redirectTo={redirectTo}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
              },
            },
          }}
        />
      </div>
    </main>
  )
}