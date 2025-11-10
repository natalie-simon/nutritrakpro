/**
 * Composable pour la recherche d'aliments via USDA FoodData Central
 */

import { ref } from 'vue'
import { searchUSDAFood } from '@/services/api'

export function useSearch() {
  // État
  const isSearching = ref(false)
  const error = ref(null)
  const query = ref('')
  const results = ref([])
  const hasSearched = ref(false)

  /**
   * Recherche des aliments dans USDA
   * @param {string} searchQuery - Terme de recherche
   */
  async function searchFood(searchQuery) {
    try {
      isSearching.value = true
      error.value = null
      results.value = []

      if (!searchQuery || searchQuery.trim().length < 2) {
        throw new Error('Veuillez entrer au moins 2 caractères')
      }

      query.value = searchQuery.trim()
      console.log('🔍 Recherche USDA pour:', query.value)

      // Appel API USDA
      const response = await searchUSDAFood(query.value)

      if (!response.success) {
        throw new Error('Erreur lors de la recherche')
      }

      const foods = response.data.foods || []

      if (foods.length === 0) {
        error.value = 'Aucun aliment trouvé pour cette recherche'
        hasSearched.value = true
        return []
      }

      // Parser et formatter les résultats
      results.value = foods.map(food => parseFoodData(food))

      hasSearched.value = true
      console.log(`✅ ${results.value.length} aliments trouvés`)

      return results.value
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur recherche:', err)
      hasSearched.value = true
      throw err
    } finally {
      isSearching.value = false
    }
  }

  /**
   * Parse les données USDA en format standardisé
   * @param {Object} food - Aliment USDA
   * @returns {Object} Aliment formaté
   */
  function parseFoodData(food) {
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
      name: food.description || food.lowercaseDescription || 'Inconnu',
      description: food.description || food.lowercaseDescription || 'Inconnu',

      // Macronutriments (pour 100g)
      calories: Math.round(findNutrient([1008])), // Energy (kcal)
      proteins: parseFloat(findNutrient([1003]).toFixed(1)), // Protein
      carbs: parseFloat(findNutrient([1005]).toFixed(1)), // Carbohydrate
      fats: parseFloat(findNutrient([1004]).toFixed(1)), // Total Fat
      fiber: parseFloat(findNutrient([1079]).toFixed(1)), // Fiber

      // Métadonnées
      dataType: food.dataType,
      brandOwner: food.brandOwner || null,
      category: food.foodCategory || null,

      // Informations pour l'affichage
      source: 'usda',
      method: 'search'
    }
  }

  /**
   * Convertit un résultat de recherche en objet meal
   * @param {Object} foodResult - Résultat de recherche
   * @returns {Object} Objet meal prêt pour le formulaire
   */
  function foodResultToMeal(foodResult) {
    return {
      name: foodResult.name,
      calories: foodResult.calories,
      proteins: foodResult.proteins,
      carbs: foodResult.carbs,
      fats: foodResult.fats,
      fiber: foodResult.fiber,
      method: 'search',
      source: 'usda',
      fdcId: foodResult.fdcId,
      portion: {
        quantity: 100,
        unit: 'g'
      }
    }
  }

  /**
   * Réinitialise la recherche
   */
  function reset() {
    query.value = ''
    results.value = []
    error.value = null
    isSearching.value = false
    hasSearched.value = false
  }

  return {
    // État
    isSearching,
    error,
    query,
    results,
    hasSearched,

    // Méthodes
    searchFood,
    foodResultToMeal,
    reset
  }
}
