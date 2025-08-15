'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Props = {
  params: Promise<{ tenant: string; sku: string }>;
};

interface WidgetConfig {
  tenant: string;
  sku: string;
  apiKey: string;
  debug: boolean;
  theme: string;
  origin: string;
}

interface GenerationResponse {
  success: boolean;
  job_id: string;
  image_url: string;
  product: {
    name: string;
    sku: string;
    base_price: number;
  };
  processing_time_ms: number;
  tenant: {
    slug: string;
    plan: string;
  };
  error?: string;
}

interface ProductInfo {
  name: string;
  sku: string;
  base_price: number;
}

interface CartItem {
  image: string;
  prompt: string;
  sku: string;
  product_name: string;
  price: number;
  job_id: string;
  generated_at: string;
}

export default function EmbedPage({ params }: Props) {
  const [tenant, setTenant] = useState<string>('')
  const [sku, setSku] = useState<string>('')
  const [config, setConfig] = useState<WidgetConfig>({
    tenant: '',
    sku: '',
    apiKey: '',
    debug: false,
    theme: 'light',
    origin: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [cartStatus, setCartStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle')
  const [showSuccess, setShowSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const initWidget = async () => {
      try {
        const { tenant: tenantParam, sku: skuParam } = await params
        
        setTenant(tenantParam)
        setSku(skuParam)
        
        // Récupération des paramètres de l'URL
        const apiKey = searchParams.get('apiKey') || ''
        const debug = searchParams.get('debug') === 'true'
        const theme = searchParams.get('theme') || 'light'
        const origin = searchParams.get('origin') || ''
        
        setConfig({
          tenant: tenantParam,
          sku: skuParam,
          apiKey,
          debug,
          theme,
          origin
        })
        
        // Notification au parent que le widget est prêt
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'widget:ready',
            data: {
              tenant: tenantParam,
              sku: skuParam,
              config: { apiKey, debug, theme, origin }
            }
          }, '*')
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize widget:', error)
        setIsLoading(false)
      }
    }
    
    initWidget()
  }, [params, searchParams])

  // Gestion des messages du parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Vérification de l'origine pour la sécurité
      if (config.origin && event.origin !== config.origin) {
        console.warn('Message from unauthorized origin:', event.origin)
        return
      }
      
      const { type, data } = event.data
      
      switch (type) {
        case 'widget:resize':
          // Logique de redimensionnement si nécessaire
          break
        case 'widget:action':
          // Gestion des actions
          break
        case 'widget:cart_status':
          // Réception du statut du panier depuis le parent
          setCartStatus(data.status)
          if (data.status === 'success') {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
          }
          break
        default:
          console.log('Received message:', type, data)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [config.origin])

  // Fonction pour envoyer des messages au parent
  const sendToParent = (type: string, data: Record<string, unknown>) => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type,
        data,
        timestamp: Date.now()
      }, '*')
    }
  }

  // Gestion de la génération de produit
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedImage('')

    try {
      // Génération du JWT depuis l'API key
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: config.apiKey
        })
      })

      if (!jwtResponse.ok) {
        throw new Error('Invalid API key')
      }

      const { jwt } = await jwtResponse.json()

      // Appel à l'API de génération
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          sku,
          options: {
            width: 1024,
            height: 1024
          }
        })
      })

      const data: GenerationResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setGeneratedImage(data.image_url)
      setProductInfo(data.product)

      // Notification au parent
      sendToParent('widget:product_created', {
        tenant,
        sku,
        job_id: data.job_id,
        image_url: data.image_url,
        product: data.product,
        processing_time_ms: data.processing_time_ms
      })

      if (config.debug) {
        console.log('Generation successful:', data)
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération'
      setError(errorMessage)
      
      // Notification d'erreur au parent
      sendToParent('widget:error', {
        tenant,
        sku,
        error: errorMessage
      })

      if (config.debug) {
        console.error('Generation error:', err)
      }
    } finally {
      setGenerating(false)
    }
  }

  // Gestion de l'ajout au panier avec UX moderne
  const handleAddToCart = async () => {
    if (!generatedImage || !productInfo) {
      setError('Aucun produit généré')
      return
    }

    setCartStatus('adding')

    try {
      // Préparation des données du panier
      const cartItem: CartItem = {
        image: generatedImage,
        prompt: prompt.trim(),
        sku,
        product_name: productInfo.name,
        price: productInfo.base_price,
        job_id: Date.now().toString(), // Simuler un job_id
        generated_at: new Date().toISOString()
      }

      // Notification au parent pour ajouter au panier
      sendToParent('widget:add_to_cart', {
        tenant,
        sku,
        cart_item: cartItem,
        metadata: {
          widget_version: '2.0.0',
          generated_at: new Date().toISOString()
        }
      })

      // Feedback utilisateur immédiat
      setCartStatus('success')
      setShowSuccess(true)

      // Reset après 3 secondes
      setTimeout(() => {
        setShowSuccess(false)
        setCartStatus('idle')
      }, 3000)

    } catch (error) {
      setCartStatus('error')
      setError('Erreur lors de l\'ajout au panier')
      
      // Notification d'erreur au parent
      sendToParent('widget:cart_error', {
        tenant,
        sku,
        error: 'Failed to add to cart'
      })
    }
  }

  // Gestion de la génération 3D (nouvelle fonctionnalité)
  const handleGenerate3D = async () => {
    if (!generatedImage || !productInfo) {
      setError('Générez d\'abord une image 2D')
      return
    }

    try {
      // Notification au parent pour génération 3D
      sendToParent('widget:generate_3d', {
        tenant,
        sku,
        image_url: generatedImage,
        prompt,
        product: productInfo
      })

      // Feedback utilisateur
      setError('')
      // Ici vous pourriez afficher un indicateur de progression

    } catch (error) {
      setError('Erreur lors de la génération 3D')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du widget...</p>
        </div>
      </div>
    )
  }

  if (!tenant || !sku) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Erreur de configuration</h2>
          <p>Les paramètres tenant et sku sont requis.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${config.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            🚀 Product AI Generator
          </h1>
          <p className="text-lg opacity-80">
            Personnalisez votre produit avec l&apos;intelligence artificielle
          </p>
        </div>

        {/* Informations du produit */}
        <div className={`rounded-xl p-8 mb-8 ${
          config.theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-100'
        }`}>
          <h2 className="text-2xl font-semibold mb-4">
            Produit: {sku}
          </h2>
          <p className="opacity-80 mb-6">
            Tenant: {tenant}
          </p>
          
          <div className={`rounded-lg p-6 ${
            config.theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow-sm`}>
            <h3 className="text-lg font-medium mb-4">Instructions :</h3>
            <ul className="space-y-2 opacity-80">
              <li>• Décrivez votre idée de personnalisation</li>
              <li>• L&apos;IA générera une image unique</li>
              <li>• Ajoutez le produit personnalisé à votre panier</li>
              <li>• Votre commande sera traitée automatiquement</li>
            </ul>
          </div>
        </div>

        {/* Formulaire de génération */}
        <div className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Description de votre personnalisation
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Smartphone avec coque en bois naturel, couleur marron foncé, texture grainée..."
              className={`w-full h-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                config.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              disabled={generating}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                generating || !prompt.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                config.theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {generating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </span>
              ) : (
                '🎨 Générer le produit'
              )}
            </button>
          </div>
        </div>

        {/* Résultat de génération */}
        {generatedImage && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Produit généré</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={generatedImage} 
                  alt="Produit personnalisé"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              
              <div className="space-y-4">
                {productInfo && (
                  <div className={`p-4 rounded-lg ${
                    config.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h4 className="font-semibold mb-2">{productInfo.name}</h4>
                    <p className="text-sm opacity-80">SKU: {productInfo.sku}</p>
                    {productInfo.base_price && (
                      <p className="text-lg font-bold text-green-600 mt-2">
                        {productInfo.base_price}€
                      </p>
                    )}
                  </div>
                )}
                
                {/* Boutons d'action */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={cartStatus === 'adding'}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      cartStatus === 'adding'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${
                      config.theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {cartStatus === 'adding' ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Ajout au panier...
                      </span>
                    ) : (
                      '🛒 Ajouter au panier'
                    )}
                  </button>

                  {/* Nouveau bouton 3D */}
                  <button
                    onClick={handleGenerate3D}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      config.theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    🎯 Générer vue 3D
                  </button>
                </div>

                {/* Message de succès */}
                {showSuccess && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
                      ✅ Produit ajouté au panier !
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        {config.debug && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}

        {/* Lien vers l'app complète */}
        <div className="text-center mt-8">
          <a
            href="https://product-ai-app-hdbl.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
              config.theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            Ouvrir l&apos;application complète
          </a>
        </div>
      </div>
    </div>
  )
} 