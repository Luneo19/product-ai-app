import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Luneo
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur d'authentification
          </h2>
          <p className="text-gray-600 mb-8">
            Une erreur s'est produite lors de votre connexion. Veuillez réessayer.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connexion échouée
            </h3>
            <p className="text-gray-600">
              Le processus d'authentification n'a pas pu être complété. Cela peut être dû à :
            </p>
          </div>

          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• Un problème temporaire avec le fournisseur d'authentification</li>
            <li>• Une session expirée</li>
            <li>• Un problème de configuration</li>
          </ul>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 block"
            >
              Réessayer la connexion
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors block"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
