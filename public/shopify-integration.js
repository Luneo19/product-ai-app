/**
 * 🚀 Product AI Widget - Shopify Integration
 * Script professionnel pour l'intégration Shopify
 * Version: 2.0.0
 * Compatible: Shopify 2.0+, Online Store 2.0
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    DEBUG: false,
    ANIMATION_DURATION: 300,
    SUCCESS_MESSAGE_DURATION: 3000,
    CART_REDIRECT_DELAY: 1000
  };

  // État global
  let widgetState = {
    isListening: false,
    lastCartUpdate: null,
    pendingItems: []
  };

  // Utilitaires
  const Utils = {
    log: function(message, data = null) {
      if (CONFIG.DEBUG) {
        console.log(`[Product AI Widget] ${message}`, data);
      }
    },

    showNotification: function(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `product-ai-notification product-ai-notification--${type}`;
      notification.innerHTML = `
        <div class="product-ai-notification__content">
          <span class="product-ai-notification__icon">${type === 'success' ? '✅' : '⚠️'}</span>
          <span class="product-ai-notification__message">${message}</span>
        </div>
      `;

      // Styles inline pour éviter les conflits CSS
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
      `;

      document.body.appendChild(notification);

      // Animation d'entrée
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 10);

      // Auto-remove
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, CONFIG.SUCCESS_MESSAGE_DURATION);
    },

    showLoadingOverlay: function(show = true) {
      let overlay = document.getElementById('product-ai-loading-overlay');
      
      if (show && !overlay) {
        overlay = document.createElement('div');
        overlay.id = 'product-ai-loading-overlay';
        overlay.innerHTML = `
          <div class="product-ai-loading">
            <div class="product-ai-loading__spinner"></div>
            <p class="product-ai-loading__text">Ajout au panier...</p>
          </div>
        `;
        
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;

        const loading = overlay.querySelector('.product-ai-loading');
        loading.style.cssText = `
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        `;

        const spinner = overlay.querySelector('.product-ai-loading__spinner');
        spinner.style.cssText = `
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        `;

        const text = overlay.querySelector('.product-ai-loading__text');
        text.style.cssText = `
          margin: 0;
          color: #374151;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          font-weight: 500;
        `;

        // Ajouter l'animation CSS
        const style = document.createElement('style');
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);
        setTimeout(() => overlay.style.opacity = '1', 10);
      } else if (!show && overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      }
    },

    updateCartCount: function() {
      // Mettre à jour le compteur du panier si disponible
      const cartCountElements = document.querySelectorAll('[data-cart-count], .cart-count, #cart-count');
      cartCountElements.forEach(element => {
        const currentCount = parseInt(element.textContent || '0');
        element.textContent = currentCount + 1;
      });
    },

    validateCartItem: function(item) {
      const required = ['image', 'prompt', 'sku', 'product_name', 'price'];
      const missing = required.filter(field => !item[field]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }

      return true;
    }
  };

  // Gestionnaire de messages
  const MessageHandler = {
    init: function() {
      if (widgetState.isListening) return;
      
      window.addEventListener('message', this.handleMessage.bind(this));
      widgetState.isListening = true;
      Utils.log('Message listener initialized');
    },

    handleMessage: function(event) {
      // Vérification de sécurité basique
      if (!event.data || typeof event.data !== 'object') return;

      const { type, data, timestamp } = event.data;

      // Validation du timestamp (optionnel)
      if (timestamp && Date.now() - timestamp > 30000) {
        Utils.log('Message too old, ignoring');
        return;
      }

      Utils.log(`Received message: ${type}`, data);

      switch (type) {
        case 'widget:add_to_cart':
          this.handleAddToCart(data);
          break;
        case 'widget:generate_3d':
          this.handleGenerate3D(data);
          break;
        case 'widget:product_created':
          this.handleProductCreated(data);
          break;
        case 'widget:error':
          this.handleError(data);
          break;
        default:
          Utils.log(`Unknown message type: ${type}`);
      }
    },

    handleAddToCart: async function(data) {
      try {
        Utils.log('Processing add to cart', data);
        
        const { cart_item, metadata } = data;
        
        // Validation des données
        Utils.validateCartItem(cart_item);

        // Afficher l'overlay de chargement
        Utils.showLoadingOverlay(true);

        // Préparer les données pour Shopify
        const shopifyItem = {
          quantity: 1,
          id: cart_item.sku, // ou variant ID
          properties: {
            '_prompt': cart_item.prompt,
            '_custom_image': cart_item.image,
            '_generated_at': cart_item.generated_at,
            '_job_id': cart_item.job_id,
            '_widget_version': metadata?.widget_version || '2.0.0'
          }
        };

        // Appel à l'API Shopify
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            items: [shopifyItem]
          })
        });

        if (!response.ok) {
          throw new Error(`Shopify API error: ${response.status}`);
        }

        const result = await response.json();
        Utils.log('Cart updated successfully', result);

        // Mettre à jour le compteur du panier
        Utils.updateCartCount();

        // Masquer l'overlay
        Utils.showLoadingOverlay(false);

        // Notification de succès
        Utils.showNotification(`${cart_item.product_name} ajouté au panier !`);

        // Redirection vers le panier après un délai
        setTimeout(() => {
          window.location.href = '/cart';
        }, CONFIG.CART_REDIRECT_DELAY);

        // Notifier le widget du succès
        this.notifyWidget('widget:cart_status', { status: 'success', item: cart_item });

      } catch (error) {
        Utils.log('Error adding to cart', error);
        
        // Masquer l'overlay
        Utils.showLoadingOverlay(false);
        
        // Notification d'erreur
        Utils.showNotification('Erreur lors de l\'ajout au panier', 'error');
        
        // Notifier le widget de l'erreur
        this.notifyWidget('widget:cart_status', { 
          status: 'error', 
          error: error.message 
        });
      }
    },

    handleGenerate3D: function(data) {
      Utils.log('3D generation requested', data);
      
      // Ici vous pouvez implémenter la logique 3D
      // Par exemple, ouvrir un modal avec la vue 3D
      Utils.showNotification('Génération 3D en cours...', 'info');
      
      // Simuler la génération 3D
      setTimeout(() => {
        Utils.showNotification('Vue 3D générée avec succès !');
      }, 2000);
    },

    handleProductCreated: function(data) {
      Utils.log('Product created', data);
      // Optionnel : afficher une notification
      Utils.showNotification('Produit généré avec succès !');
    },

    handleError: function(data) {
      Utils.log('Widget error', data);
      Utils.showNotification(`Erreur: ${data.error}`, 'error');
    },

    notifyWidget: function(type, data) {
      // Envoyer un message de retour au widget
      const iframes = document.querySelectorAll('iframe[src*="/embed/"]');
      iframes.forEach(iframe => {
        iframe.contentWindow?.postMessage({
          type,
          data,
          timestamp: Date.now()
        }, '*');
      });
    }
  };

  // Initialisation
  const init = function() {
    Utils.log('Product AI Widget Shopify Integration initializing...');
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialiser le gestionnaire de messages
    MessageHandler.init();

    // Ajouter les styles CSS personnalisés
    addCustomStyles();

    Utils.log('Product AI Widget Shopify Integration ready!');
  };

  // Styles CSS personnalisés
  const addCustomStyles = function() {
    const style = document.createElement('style');
    style.textContent = `
      .product-ai-widget-container {
        margin: 20px 0;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }

      .product-ai-widget-container iframe {
        width: 100%;
        border: none;
        min-height: 600px;
      }

      @media (max-width: 768px) {
        .product-ai-widget-container iframe {
          min-height: 500px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Démarrer l'initialisation
  init();

  // Exposer l'API publique
  window.ProductAIWidget = {
    showNotification: Utils.showNotification,
    addToCart: MessageHandler.handleAddToCart.bind(MessageHandler),
    generate3D: MessageHandler.handleGenerate3D.bind(MessageHandler),
    config: CONFIG
  };

})();
