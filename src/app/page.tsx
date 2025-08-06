import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Product AI</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Accueil
              </Link>
                             <Link
                 href="/create"
                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Créer un produit
               </Link>
               <Link
                 href="/login"
                 className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Connexion
               </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Créez des produits
            <span className="text-blue-600"> avec l&apos;IA</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                         Transformez vos idées en fiches produit détaillées grâce à l&apos;intelligence artificielle.
            Générez des descriptions, caractéristiques et prix en quelques secondes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/create"
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Commencer maintenant
            </Link>
            <a
              href="#features"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
            >
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div id="features" className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Génération rapide</h3>
              <p className="text-gray-600">
                                 Créez des fiches produit complètes en quelques secondes grâce à l&apos;IA avancée.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité professionnelle</h3>
              <p className="text-gray-600">
                Des descriptions détaillées et des caractéristiques pertinentes pour vos produits.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Facile à utiliser</h3>
              <p className="text-gray-600">
                                 Interface simple et intuitive. Pas besoin d&apos;expertise technique.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
