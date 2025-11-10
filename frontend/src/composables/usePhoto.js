/**
 * Composable pour l'analyse de photos d'aliments
 * Utilise Clarifai pour la reconnaissance et USDA pour les valeurs nutritionnelles
 */

import { ref } from 'vue'
import { analyzePhotoWithClarifai, searchUSDAFood } from '@/services/api'
import { useSettingsStore } from '@/stores/settings'

export function usePhoto() {
  // État
  const isAnalyzing = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const photoBase64 = ref(null)
  const photoPreview = ref(null)
  const predictions = ref([])
  const clarifaiLimitReached = ref(false)

  /**
   * Convertit un fichier en base64
   * @param {File} file - Fichier image
   * @returns {Promise<string>} Base64 de l'image
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // Extraire seulement les données base64 (sans le préfixe data:image/...)
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Upload et prépare une photo pour l'analyse
   * @param {File} file - Fichier image
   */
  async function uploadPhoto(file) {
    try {
      error.value = null

      // Valider le fichier
      if (!file) {
        throw new Error('Aucun fichier sélectionné')
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }

      // Taille max : 10MB
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('L\'image est trop volumineuse (max 10MB)')
      }

      // Convertir en base64
      const base64 = await fileToBase64(file)
      photoBase64.value = base64

      // Créer URL preview
      photoPreview.value = URL.createObjectURL(file)

      console.log('✅ Photo chargée')
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur upload photo:', err)
      throw err
    }
  }

  /**
   * Analyse la photo avec Clarifai
   */
  async function analyzePhoto() {
    try {
      isAnalyzing.value = true
      error.value = null
      predictions.value = []

      if (!photoBase64.value) {
        throw new Error('Aucune photo à analyser')
      }

      // Vérifier la limite Clarifai
      const settingsStore = useSettingsStore()
      if (settingsStore.isClarifaiLimitReached) {
        clarifaiLimitReached.value = true
        throw new Error('Limite mensuelle Clarifai atteinte (1000/1000). Utilisez la recherche manuelle.')
      }

      console.log('🔍 Analyse Clarifai en cours...')

      // Appel API Clarifai
      const response = await analyzePhotoWithClarifai(photoBase64.value)

      if (!response.success) {
        throw new Error('Erreur lors de l\'analyse de la photo')
      }

      // Parser les résultats
      const foodPredictions = parseClarifaiResults(response.data)

      if (foodPredictions.length === 0) {
        throw new Error('Aucun aliment détecté dans cette photo')
      }

      predictions.value = foodPredictions

      // Incrémenter le compteur Clarifai
      settingsStore.incrementClarifaiUsage()

      console.log(`✅ ${foodPredictions.length} aliments détectés`)
      return foodPredictions
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur analyse photo:', err)
      throw err
    } finally {
      isAnalyzing.value = false
    }
  }

  /**
   * Parse les résultats Clarifai
   * @param {Object} data - Réponse API Clarifai
   * @returns {Array} Liste des aliments détectés
   */
  function parseClarifaiResults(data) {
    try {
      const outputs = data.outputs?.[0]
      const concepts = outputs?.data?.concepts || []

      // Filtrer les concepts avec confiance > 80%
      return concepts
        .filter(concept => concept.value >= 0.80)
        .map(concept => ({
          name: concept.name,
          confidence: concept.value,
          id: concept.id,
          // Valeurs nutritionnelles à récupérer via USDA
          nutritionData: null,
          isLoading: false
        }))
        .slice(0, 10) // Limiter à 10 résultats
    } catch (err) {
      console.error('Erreur parsing Clarifai:', err)
      return []
    }
  }

  /**
   * Recherche les valeurs nutritionnelles d'un aliment via USDA
   * @param {Object} prediction - Prédiction Clarifai
   * @param {number} index - Index dans le tableau predictions
   */
  async function fetchNutritionData(prediction, index) {
    try {
      predictions.value[index].isLoading = true

      console.log('🔍 Recherche USDA pour:', prediction.name)

      // Recherche dans USDA
      const response = await searchUSDAFood(prediction.name)

      if (!response.success || !response.data.foods || response.data.foods.length === 0) {
        throw new Error('Aliment non trouvé dans USDA')
      }

      // Prendre le premier résultat
      const food = response.data.foods[0]
      const nutritionData = parseUSDAFood(food)

      // Mettre à jour la prédiction avec les données nutritionnelles
      predictions.value[index].nutritionData = nutritionData

      console.log('✅ Données nutritionnelles trouvées')
      return nutritionData
    } catch (err) {
      console.error('❌ Erreur récupération nutrition:', err)
      predictions.value[index].nutritionData = null
      throw err
    } finally {
      predictions.value[index].isLoading = false
    }
  }

  /**
   * Parse les données USDA
   * @param {Object} food - Aliment USDA
   * @returns {Object} Données nutritionnelles formatées
   */
  function parseUSDAFood(food) {
    const nutrients = food.foodNutrients || []

    // Helper pour trouver un nutriment
    const findNutrient = (nutrientIds) => {
      for (const id of nutrientIds) {
        const nutrient = nutrients.find(n => n.nutrientId === id)
        if (nutrient) return nutrient.value || 0
      }
      return 0
    }

    return {
      fdcId: food.fdcId,
      description: food.description || food.lowercaseDescription || 'Inconnu',
      calories: Math.round(findNutrient([1008])), // Energy (kcal)
      proteins: parseFloat(findNutrient([1003]).toFixed(1)), // Protein
      carbs: parseFloat(findNutrient([1005]).toFixed(1)), // Carbohydrate
      fats: parseFloat(findNutrient([1004]).toFixed(1)), // Total Fat
      fiber: parseFloat(findNutrient([1079]).toFixed(1)), // Fiber
      dataType: food.dataType,
      brandOwner: food.brandOwner || null
    }
  }

  /**
   * Charge automatiquement les données nutritionnelles pour toutes les prédictions
   */
  async function fetchAllNutritionData() {
    isLoading.value = true

    try {
      const promises = predictions.value.map((prediction, index) =>
        fetchNutritionData(prediction, index).catch(() => {
          // Ignorer les erreurs individuelles
          console.warn(`Impossible de récupérer les données pour: ${prediction.name}`)
        })
      )

      await Promise.all(promises)
      console.log('✅ Toutes les données nutritionnelles chargées')
    } catch (err) {
      console.error('Erreur chargement nutrition:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Convertit une prédiction avec nutrition en repas
   * @param {Object} prediction - Prédiction avec données nutritionnelles
   * @returns {Object} Objet repas
   */
  function predictionToMeal(prediction) {
    if (!prediction.nutritionData) {
      throw new Error('Données nutritionnelles manquantes')
    }

    const nutrition = prediction.nutritionData

    return {
      name: prediction.name,
      calories: nutrition.calories,
      proteins: nutrition.proteins,
      carbs: nutrition.carbs,
      fats: nutrition.fats,
      fiber: nutrition.fiber,
      method: 'photo',
      source: 'clarifai',
      photo: photoPreview.value,
      confidence: prediction.confidence,
      portion: {
        quantity: 100,
        unit: 'g'
      }
    }
  }

  /**
   * Réinitialise l'état
   */
  function reset() {
    photoBase64.value = null
    if (photoPreview.value) {
      URL.revokeObjectURL(photoPreview.value)
    }
    photoPreview.value = null
    predictions.value = []
    error.value = null
    isAnalyzing.value = false
    isLoading.value = false
    clarifaiLimitReached.value = false
  }

  /**
   * Nettoie les ressources
   */
  function cleanup() {
    if (photoPreview.value) {
      URL.revokeObjectURL(photoPreview.value)
    }
  }

  return {
    // État
    isAnalyzing,
    isLoading,
    error,
    photoPreview,
    predictions,
    clarifaiLimitReached,

    // Méthodes
    uploadPhoto,
    analyzePhoto,
    fetchNutritionData,
    fetchAllNutritionData,
    predictionToMeal,
    reset,
    cleanup
  }
}
