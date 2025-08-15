'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  prompt: string
  description: string
  image_url: string
  created_at: string
}

export default function ProductsList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()
  const router = useRouter()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setProducts((current) => 
              current.filter((p) => p.id !== payload.old.id)
            )
          } else if (payload.eventType === 'INSERT') {
            setProducts((current) => [payload.new as Product, ...current])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter((product) => 
    product.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Supprimer un produit
  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .match({ id })

    if (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du produit')
      return
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧠 Produits générés par l&apos;IA</h1>
        <button
          onClick={() => router.push('/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouveau produit
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par créer votre premier produit !'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push('/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer mon premier produit
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="p-4 rounded-xl shadow border bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={product.image_url} 
                    alt={product.prompt}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">{product.prompt}</h2>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Créé le {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
