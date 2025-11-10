/**
 * Store Pinia pour la gestion des repas
 * Gère l'état global des repas, stats et progression
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import nutritionService from '@/services/nutrition.service'
import exportService from '@/services/export.service'
import { useSettingsStore } from './settings'

export const useMealsStore = defineStore('meals', () => {
  // ==================== STATE ====================

  const meals = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)

  // ==================== GETTERS (Computed) ====================

  /**
   * Repas du jour actuel
   */
  const todayMeals = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return meals.value.filter(meal => meal.date === today)
  })

  /**
   * Total nutritionnel du jour
   */
  const todayTotal = computed(() => {
    return todayMeals.value.reduce((total, meal) => {
      return {
        calories: total.calories + (meal.calories || 0),
        proteins: total.proteins + (meal.proteins || 0),
        carbs: total.carbs + (meal.carbs || 0),
        fats: total.fats + (meal.fats || 0),
        fiber: total.fiber + (meal.fiber || 0),
        mealCount: total.mealCount + 1
      }
    }, {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      mealCount: 0
    })
  })

  /**
   * Progression vers l'objectif calorique du jour
   */
  const goalProgress = computed(() => {
    const settingsStore = useSettingsStore()
    const goal = settingsStore.dailyCalorieGoal
    const consumed = todayTotal.value.calories
    const remaining = Math.max(0, goal - consumed)
    const percentage = Math.min(100, Math.round((consumed / goal) * 100))
    const exceeded = consumed > goal

    return {
      consumed,
      goal,
      remaining,
      percentage,
      exceeded
    }
  })

  /**
   * Repas groupés par date (7 derniers jours)
   */
  const mealsByDate = computed(() => {
    const grouped = {}

    // Créer les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      grouped[dateStr] = {
        date: dateStr,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        meals: [],
        total: { calories: 0, proteins: 0, carbs: 0, fats: 0 }
      }
    }

    // Remplir avec les repas existants
    meals.value.forEach(meal => {
      if (grouped[meal.date]) {
        grouped[meal.date].meals.push(meal)
        grouped[meal.date].total.calories += meal.calories || 0
        grouped[meal.date].total.proteins += meal.proteins || 0
        grouped[meal.date].total.carbs += meal.carbs || 0
        grouped[meal.date].total.fats += meal.fats || 0
      }
    })

    return Object.values(grouped)
  })

  /**
   * Nombre total de repas
   */
  const totalMealsCount = computed(() => {
    return meals.value.length
  })

  /**
   * Statistiques par méthode d'ajout
   */
  const methodStats = computed(() => {
    const stats = {
      photo: 0,
      barcode: 0,
      manual: 0
    }

    meals.value.forEach(meal => {
      if (stats[meal.method] !== undefined) {
        stats[meal.method]++
      }
    })

    return stats
  })

  // ==================== ACTIONS ====================

  /**
   * Charge tous les repas
   */
  async function loadMeals() {
    try {
      isLoading.value = true
      error.value = null

      const allMeals = await nutritionService.getAllMeals()
      meals.value = allMeals

      lastUpdate.value = new Date().toISOString()

      console.log(`✅ ${allMeals.length} repas chargés`)
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors du chargement des repas:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ajoute un nouveau repas
   * @param {Object} mealData - Données du repas
   */
  async function addMeal(mealData) {
    try {
      isLoading.value = true
      error.value = null

      const newMeal = await nutritionService.addMeal(mealData)

      // Ajouter au state local
      meals.value.push(newMeal)

      lastUpdate.value = new Date().toISOString()

      console.log('✅ Repas ajouté:', newMeal.name)

      return newMeal
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors de l\'ajout du repas:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Met à jour un repas
   * @param {string} id - ID du repas
   * @param {Object} updates - Données à mettre à jour
   */
  async function updateMeal(id, updates) {
    try {
      isLoading.value = true
      error.value = null

      const updatedMeal = await nutritionService.updateMeal(id, updates)

      if (updatedMeal) {
        // Mettre à jour le state local
        const index = meals.value.findIndex(m => m.id === id)
        if (index !== -1) {
          meals.value[index] = updatedMeal
        }

        lastUpdate.value = new Date().toISOString()

        console.log('✅ Repas mis à jour:', updatedMeal.name)
      }

      return updatedMeal
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors de la mise à jour du repas:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprime un repas
   * @param {string} id - ID du repas
   */
  async function deleteMeal(id) {
    try {
      isLoading.value = true
      error.value = null

      const success = await nutritionService.deleteMeal(id)

      if (success) {
        // Retirer du state local
        meals.value = meals.value.filter(m => m.id !== id)

        lastUpdate.value = new Date().toISOString()

        console.log('✅ Repas supprimé')
      }

      return success
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors de la suppression du repas:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprime tous les repas
   */
  async function clearAllMeals() {
    try {
      isLoading.value = true
      error.value = null

      await nutritionService.clearAllMeals()
      meals.value = []

      lastUpdate.value = new Date().toISOString()

      console.log('✅ Tous les repas supprimés')
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors de la suppression des repas:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère un repas par ID
   * @param {string} id - ID du repas
   */
  function getMealById(id) {
    return meals.value.find(m => m.id === id) || null
  }

  /**
   * Récupère les repas d'une date spécifique
   * @param {string} date - Date YYYY-MM-DD
   */
  function getMealsByDate(date) {
    return meals.value.filter(m => m.date === date)
  }

  /**
   * Récupère le total nutritionnel d'une date
   * @param {string} date - Date YYYY-MM-DD
   */
  async function getDailyTotal(date) {
    try {
      return await nutritionService.getDailyTotal(date)
    } catch (err) {
      console.error('❌ Erreur lors du calcul du total quotidien:', err)
      throw err
    }
  }

  /**
   * Récupère les stats hebdomadaires
   */
  async function getWeeklyStats() {
    try {
      return await nutritionService.getWeeklyStats()
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des stats hebdo:', err)
      throw err
    }
  }

  /**
   * Exporte les repas en CSV
   * @param {Object} options - Options d'export
   */
  async function exportToCSV(options = {}) {
    try {
      await exportService.exportMealsToCSV(options)
      console.log('✅ Export CSV réussi')
    } catch (err) {
      console.error('❌ Erreur lors de l\'export CSV:', err)
      throw err
    }
  }

  /**
   * Exporte toutes les données en JSON
   */
  async function exportToJSON() {
    try {
      await exportService.exportAllDataToJSON()
      console.log('✅ Export JSON réussi')
    } catch (err) {
      console.error('❌ Erreur lors de l\'export JSON:', err)
      throw err
    }
  }

  /**
   * Importe des données depuis un fichier JSON
   * @param {File} file - Fichier JSON
   */
  async function importFromJSON(file) {
    try {
      isLoading.value = true
      error.value = null

      const result = await exportService.importDataFromJSON(file)

      // Recharger les repas
      await loadMeals()

      console.log('✅ Import réussi:', result.message)

      return result
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors de l\'import:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rafraîchit les repas depuis le storage
   */
  async function refreshMeals() {
    await loadMeals()
  }

  /**
   * Efface l'erreur
   */
  function clearError() {
    error.value = null
  }

  // ==================== INITIALIZATION ====================

  // Charger les repas au démarrage du store
  loadMeals()

  // ==================== RETURN (API PUBLIQUE) ====================

  return {
    // State
    meals,
    isLoading,
    error,
    lastUpdate,

    // Getters
    todayMeals,
    todayTotal,
    goalProgress,
    mealsByDate,
    totalMealsCount,
    methodStats,

    // Actions
    loadMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    clearAllMeals,
    getMealById,
    getMealsByDate,
    getDailyTotal,
    getWeeklyStats,
    exportToCSV,
    exportToJSON,
    importFromJSON,
    refreshMeals,
    clearError
  }
})
