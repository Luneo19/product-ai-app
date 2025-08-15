import { createClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/app/components/LogoutButton'

async function getProducts(userId: string) {
  const supabase = createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération produits:', error)
    return []
  }

  return products || []
}

async function getUserStats(userId: string) {
  const supabase = createClient()
  
  // Compter les produits
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Compter les jobs en cours
  const { count: jobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'processing')

  return {
    productsCount: productsCount || 0,
    jobsCount: jobsCount || 0
  }
}

export default async function ProductsPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const products = await getProducts(session.user.id)
  const stats = await getUserStats(session.user.id)

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
              <span className="text-sm text-gray-600">
                Bonjour, {session.user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Gérez vos produits et surveillez vos performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Produits créés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.productsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Jobs en cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.jobsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Plan actuel</p>
                <p className="text-2xl font-bold text-gray-900">Pro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/create"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">+</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Créer un produit</p>
                <p className="text-sm text-gray-600">Générer avec l'IA</p>
              </div>
            </Link>

            <Link
              href="/admin"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">👑</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Dashboard Admin</p>
                <p className="text-sm text-gray-600">Gérer les tenants</p>
              </div>
            </Link>

            <Link
              href="/billing"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">💳</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Gestion Billing</p>
                <p className="text-sm text-gray-600">Abonnements & paiements</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Vos produits</h2>
              <Link
                href="/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Nouveau produit
              </Link>
            </div>
          </div>

          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun produit créé
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par créer votre premier produit avec l'IA
                </p>
                <Link
                  href="/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Créer mon premier produit
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'completed' ? 'bg-green-100 text-green-800' :
                        product.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Créé le {new Date(product.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Voir détails →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Produit "{product.name}" créé
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()} à {new Date(product.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
