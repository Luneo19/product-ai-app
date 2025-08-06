'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateProductPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateProduct = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description de produit');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const res = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }
      
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && prompt.trim()) {
      generateProduct();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Product AI
              </Link>
            </div>
            <div className="flex space-x-4">
                             <Link
                 href="/"
                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Accueil
               </Link>
               <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                 Créer un produit
               </span>
               <Link
                 href="/login"
                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Connexion
               </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Créer un produit par IA
            </h1>
            <p className="text-lg text-gray-600">
                             Décrivez votre idée de produit et laissez l&apos;IA créer une fiche détaillée
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre produit
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: Chaussures de sport inspirées de l&apos;univers de Naruto avec des couleurs vives et un design ninja moderne..."
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={4}
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Plus votre description est détaillée, meilleur sera le résultat
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={generateProduct}
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </>
              ) : (
                'Générer la fiche produit'
              )}
            </button>

            {result && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Fiche produit générée</h2>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Copier
                  </button>
                </div>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">{result}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
