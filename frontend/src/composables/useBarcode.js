/**
 * Composable pour la gestion du scan de codes-barres
 * Utilise html5-qrcode pour le scan caméra et Open Food Facts pour les données
 */

import { ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { searchBarcode } from '@/services/api'

export function useBarcode() {
  // État
  const isScanning = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const scannedProduct = ref(null)
  const html5QrCode = ref(null)
  const httpsWarning = ref(false)

  /**
   * Vérifie si HTTPS est disponible (requis pour la caméra)
   */
  function checkHTTPS() {
    const isSecure = window.isSecureContext ||
                     window.location.protocol === 'https:' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1'

    httpsWarning.value = !isSecure
    return isSecure
  }

  /**
   * Démarre le scanner avec la caméra
   * @param {string} elementId - ID de l'élément HTML pour le rendu
   */
  async function startScanner(elementId = 'reader') {
    try {
      // Vérifier HTTPS
      if (!checkHTTPS()) {
        throw new Error('Le scanner caméra nécessite HTTPS ou localhost')
      }

      error.value = null
      isScanning.value = true

      // Initialiser html5-qrcode
      html5QrCode.value = new Html5Qrcode(elementId)

      // Configuration du scanner
      const config = {
        fps: 10, // Images par seconde
        qrbox: { width: 250, height: 250 }, // Taille de la zone de scan
        aspectRatio: 1.0
      }

      // Démarrer le scan
      await html5QrCode.value.start(
        { facingMode: 'environment' }, // Caméra arrière sur mobile
        config,
        onScanSuccess,
        onScanFailure
      )

      console.log('✅ Scanner démarré')
    } catch (err) {
      error.value = err.message
      isScanning.value = false
      console.error('❌ Erreur démarrage scanner:', err)
      throw err
    }
  }

  /**
   * Arrête le scanner
   */
  async function stopScanner() {
    try {
      if (html5QrCode.value && isScanning.value) {
        await html5QrCode.value.stop()
        html5QrCode.value.clear()
        html5QrCode.value = null
        isScanning.value = false
        console.log('✅ Scanner arrêté')
      }
    } catch (err) {
      console.error('❌ Erreur arrêt scanner:', err)
      error.value = err.message
    }
  }

  /**
   * Callback succès du scan
   */
  function onScanSuccess(decodedText, decodedResult) {
    console.log('📷 Code scanné:', decodedText)

    // Arrêter le scanner automatiquement après un scan réussi
    stopScanner()

    // Rechercher le produit
    searchByBarcode(decodedText)
  }

  /**
   * Callback échec du scan (appelé à chaque frame sans code)
   */
  function onScanFailure(error) {
    // Ne rien faire, c'est normal si aucun code n'est détecté
  }

  /**
   * Recherche un produit par code-barre dans Open Food Facts
   * @param {string} barcode - Code-barre à rechercher
   */
  async function searchByBarcode(barcode) {
    try {
      isLoading.value = true
      error.value = null
      scannedProduct.value = null

      console.log('🔍 Recherche du produit:', barcode)

      // Appel API Open Food Facts
      const response = await searchBarcode(barcode)

      if (!response.success) {
        throw new Error('Erreur lors de la recherche')
      }

      // Vérifier si le produit existe
      if (response.data.status === 0) {
        throw new Error('Produit non trouvé dans Open Food Facts')
      }

      // Parser les données
      const product = parseOpenFoodFactsData(response.data.product, barcode)
      scannedProduct.value = product

      console.log('✅ Produit trouvé:', product.name)

      return product
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur recherche produit:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Parse les données Open Food Facts en format standardisé
   * @param {Object} product - Données brutes Open Food Facts
   * @param {string} barcode - Code-barre du produit
   */
  function parseOpenFoodFactsData(product, barcode) {
    // Récupérer les nutriments (pour 100g)
    const nutriments = product.nutriments || {}

    // Nom du produit
    const name = product.product_name ||
                 product.product_name_fr ||
                 product.generic_name ||
                 'Produit inconnu'

    // Image du produit
    const photo = product.image_url ||
                  product.image_front_url ||
                  product.image_small_url ||
                  null

    // Marque
    const brand = product.brands || ''

    // Portion par défaut
    const serving_size = product.serving_size || '100g'

    // Construire l'objet repas
    return {
      name: brand ? `${brand} - ${name}` : name,
      calories: Math.round(nutriments.energy_kcal || nutriments['energy-kcal_100g'] || 0),
      proteins: parseFloat(nutriments.proteins || nutriments.proteins_100g || 0),
      carbs: parseFloat(nutriments.carbohydrates || nutriments.carbohydrates_100g || 0),
      fats: parseFloat(nutriments.fat || nutriments.fat_100g || 0),
      fiber: parseFloat(nutriments.fiber || nutriments.fiber_100g || 0),
      method: 'barcode',
      source: 'openfoodfacts',
      photo: photo,
      barcode: barcode,
      portion: {
        quantity: 100,
        unit: 'g'
      },
      // Données supplémentaires
      _raw: {
        brand: brand,
        categories: product.categories || '',
        labels: product.labels || '',
        serving_size: serving_size,
        nutriscore: product.nutriscore_grade || null
      }
    }
  }

  /**
   * Nettoie et formate un code-barre
   * @param {string} barcode - Code-barre brut
   */
  function formatBarcode(barcode) {
    // Supprimer les espaces et caractères non numériques
    return barcode.replace(/\D/g, '')
  }

  /**
   * Valide un code-barre (EAN-13, EAN-8, UPC, etc.)
   * @param {string} barcode - Code-barre à valider
   */
  function validateBarcode(barcode) {
    const cleaned = formatBarcode(barcode)

    // Vérifier la longueur (8, 12, 13 ou 14 chiffres)
    const validLengths = [8, 12, 13, 14]
    if (!validLengths.includes(cleaned.length)) {
      return {
        valid: false,
        error: 'Le code-barre doit contenir 8, 12, 13 ou 14 chiffres'
      }
    }

    return {
      valid: true,
      cleaned: cleaned
    }
  }

  /**
   * Réinitialise l'état
   */
  function reset() {
    error.value = null
    scannedProduct.value = null
    isLoading.value = false
  }

  // Nettoyer au démontage du composant
  function cleanup() {
    if (isScanning.value) {
      stopScanner()
    }
  }

  return {
    // État
    isScanning,
    isLoading,
    error,
    scannedProduct,
    httpsWarning,

    // Méthodes
    startScanner,
    stopScanner,
    searchByBarcode,
    formatBarcode,
    validateBarcode,
    checkHTTPS,
    reset,
    cleanup
  }
}
