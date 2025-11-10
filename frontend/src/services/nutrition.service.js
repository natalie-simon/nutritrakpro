/**
 * Service de gestion de la nutrition
 * Couche de logique métier au-dessus du StorageService
 * Valide et traite les données nutritionnelles
 */

import storageService from './storage.service'

/**
 * Classe de modèle pour un repas
 */
export class Meal {
  constructor(data) {
    this.id = data.id || Date.now().toString()
    this.date = data.date || new Date().toISOString().split('T')[0]
    this.time = data.time || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    this.name = data.name || 'Repas sans nom'
    this.calories = parseFloat(data.calories) || 0
    this.proteins = parseFloat(data.proteins) || 0
    this.carbs = parseFloat(data.carbs) || 0
    this.fats = parseFloat(data.fats) || 0
    this.fiber = parseFloat(data.fiber) || 0
    this.method = data.method || 'manual' // 'photo' | 'barcode' | 'manual'
    this.source = data.source || 'manual' // 'clarifai' | 'openfoodfacts' | 'usda' | 'manual'
    this.photo = data.photo || null
    this.barcode = data.barcode || null
    this.confidence = data.confidence || null
    this.portion = data.portion || { quantity: 100, unit: 'g' }
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  /**
   * Valide les données du repas
   * @returns {Object} { valid: boolean, errors: Array }
   */
  validate() {
    const errors = []

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Le nom du repas est requis')
    }

    if (this.calories < 0) {
      errors.push('Les calories ne peuvent pas être négatives')
    }

    if (this.proteins < 0 || this.carbs < 0 || this.fats < 0) {
      errors.push('Les macronutriments ne peuvent pas être négatifs')
    }

    if (!['photo', 'barcode', 'manual'].includes(this.method)) {
      errors.push('Méthode invalide')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Calcule le total des macros en grammes
   * @returns {number} Total protéines + glucides + lipides
   */
  getTotalMacros() {
    return this.proteins + this.carbs + this.fats
  }

  /**
   * Calcule le pourcentage de chaque macro
   * @returns {Object} Pourcentages des macros
   */
  getMacrosPercentage() {
    const totalCalories = this.calories || 1 // Éviter division par zéro

    // 1g protéine = 4 kcal, 1g glucide = 4 kcal, 1g lipide = 9 kcal
    const proteinsCal = this.proteins * 4
    const carbsCal = this.carbs * 4
    const fatsCal = this.fats * 9

    const total = proteinsCal + carbsCal + fatsCal || 1

    return {
      proteins: Math.round((proteinsCal / total) * 100),
      carbs: Math.round((carbsCal / total) * 100),
      fats: Math.round((fatsCal / total) * 100)
    }
  }

  /**
   * Convertit le repas en objet simple
   * @returns {Object} Objet simple
   */
  toJSON() {
    return { ...this }
  }
}

/**
 * Service de nutrition
 */
class NutritionService {
  // ==================== CRUD OPERATIONS ====================

  /**
   * Ajoute un nouveau repas
   * @param {Object} mealData - Données du repas
   * @returns {Promise<Meal>} Le repas créé
   */
  async addMeal(mealData) {
    try {
      // Créer une instance de Meal
      const meal = new Meal(mealData)

      // Valider
      const validation = meal.validate()
      if (!validation.valid) {
        throw new Error(`Validation échouée: ${validation.errors.join(', ')}`)
      }

      // Sauvegarder
      const savedMeal = storageService.saveMeal(meal.toJSON())

      return new Meal(savedMeal)
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du repas:', error)
      throw error
    }
  }

  /**
   * Récupère tous les repas
   * @returns {Promise<Array<Meal>>} Liste des repas
   */
  async getAllMeals() {
    try {
      const meals = storageService.getMeals()
      return meals.map(meal => new Meal(meal))
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas:', error)
      throw error
    }
  }

  /**
   * Récupère les repas avec filtres
   * @param {Object} filters - Filtres
   * @returns {Promise<Array<Meal>>} Liste des repas filtrés
   */
  async getMeals(filters = {}) {
    try {
      const meals = storageService.getMealsWithFilters(filters)
      return meals.map(meal => new Meal(meal))
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas:', error)
      throw error
    }
  }

  /**
   * Récupère les repas d'une date
   * @param {string} date - Date YYYY-MM-DD
   * @returns {Promise<Array<Meal>>} Repas du jour
   */
  async getMealsByDate(date) {
    try {
      const meals = storageService.getMealsByDate(date)
      return meals.map(meal => new Meal(meal))
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas du jour:', error)
      throw error
    }
  }

  /**
   * Récupère un repas par ID
   * @param {string} id - ID du repas
   * @returns {Promise<Meal|null>} Le repas ou null
   */
  async getMealById(id) {
    try {
      const meal = storageService.getMealById(id)
      return meal ? new Meal(meal) : null
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du repas:', error)
      throw error
    }
  }

  /**
   * Met à jour un repas
   * @param {string} id - ID du repas
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Meal|null>} Le repas mis à jour
   */
  async updateMeal(id, updates) {
    try {
      const updatedMeal = storageService.updateMeal(id, updates)
      return updatedMeal ? new Meal(updatedMeal) : null
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du repas:', error)
      throw error
    }
  }

  /**
   * Supprime un repas
   * @param {string} id - ID du repas
   * @returns {Promise<boolean>} true si supprimé
   */
  async deleteMeal(id) {
    try {
      return storageService.deleteMeal(id)
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du repas:', error)
      throw error
    }
  }

  /**
   * Supprime tous les repas
   * @returns {Promise<boolean>} true si succès
   */
  async clearAllMeals() {
    try {
      return storageService.clearAllMeals()
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des repas:', error)
      throw error
    }
  }

  // ==================== STATISTICS ====================

  /**
   * Calcule le total nutritionnel d'une date
   * @param {string} date - Date YYYY-MM-DD
   * @returns {Promise<Object>} Total du jour
   */
  async getDailyTotal(date) {
    try {
      return storageService.getDailyTotal(date)
    } catch (error) {
      console.error('❌ Erreur lors du calcul du total quotidien:', error)
      throw error
    }
  }

  /**
   * Récupère les stats des 7 derniers jours
   * @returns {Promise<Array>} Stats hebdomadaires
   */
  async getWeeklyStats() {
    try {
      return storageService.getWeeklyStats()
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stats hebdo:', error)
      throw error
    }
  }

  /**
   * Calcule la progression vers l'objectif calorique
   * @param {string} date - Date YYYY-MM-DD
   * @param {number} goal - Objectif calorique
   * @returns {Promise<Object>} Progression
   */
  async calculateGoalProgress(date, goal) {
    try {
      const dailyTotal = await this.getDailyTotal(date)
      const consumed = dailyTotal.calories
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
    } catch (error) {
      console.error('❌ Erreur lors du calcul de la progression:', error)
      throw error
    }
  }

  /**
   * Vérifie si on peut ajouter plus de calories
   * @param {string} date - Date YYYY-MM-DD
   * @param {number} goal - Objectif calorique
   * @param {number} calories - Calories à ajouter
   * @returns {Promise<Object>} Info sur la faisabilité
   */
  async canAddMoreCalories(date, goal, calories) {
    try {
      const progress = await this.calculateGoalProgress(date, goal)
      const newTotal = progress.consumed + calories
      const willExceed = newTotal > goal

      return {
        canAdd: true, // Toujours autoriser l'ajout
        willExceed,
        newTotal,
        overage: willExceed ? newTotal - goal : 0
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des calories:', error)
      throw error
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Calcule la moyenne des calories sur une période
   * @param {string} startDate - Date de début
   * @param {string} endDate - Date de fin
   * @returns {Promise<number>} Moyenne des calories
   */
  async getAverageCalories(startDate, endDate) {
    try {
      const meals = await this.getMeals({ startDate, endDate })

      if (meals.length === 0) return 0

      // Grouper par date
      const dailyTotals = {}
      meals.forEach(meal => {
        if (!dailyTotals[meal.date]) {
          dailyTotals[meal.date] = 0
        }
        dailyTotals[meal.date] += meal.calories
      })

      // Calculer la moyenne
      const days = Object.keys(dailyTotals).length
      const totalCalories = Object.values(dailyTotals).reduce((sum, cal) => sum + cal, 0)

      return days > 0 ? Math.round(totalCalories / days) : 0
    } catch (error) {
      console.error('❌ Erreur lors du calcul de la moyenne:', error)
      throw error
    }
  }

  /**
   * Récupère les repas les plus fréquents
   * @param {number} limit - Nombre de résultats
   * @returns {Promise<Array>} Repas fréquents
   */
  async getMostFrequentMeals(limit = 10) {
    try {
      const meals = await this.getAllMeals()

      // Compter les occurrences par nom
      const frequency = {}
      meals.forEach(meal => {
        const name = meal.name.toLowerCase().trim()
        if (!frequency[name]) {
          frequency[name] = {
            name: meal.name,
            count: 0,
            avgCalories: 0,
            totalCalories: 0
          }
        }
        frequency[name].count++
        frequency[name].totalCalories += meal.calories
      })

      // Calculer les moyennes et trier
      const result = Object.values(frequency)
        .map(item => ({
          ...item,
          avgCalories: Math.round(item.totalCalories / item.count)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)

      return result
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des repas fréquents:', error)
      throw error
    }
  }

  /**
   * Récupère la répartition des méthodes d'ajout
   * @returns {Promise<Object>} Statistiques par méthode
   */
  async getMethodsStatistics() {
    try {
      const meals = await this.getAllMeals()

      const stats = {
        photo: 0,
        barcode: 0,
        manual: 0,
        total: meals.length
      }

      meals.forEach(meal => {
        if (stats[meal.method] !== undefined) {
          stats[meal.method]++
        }
      })

      // Ajouter les pourcentages
      const total = stats.total || 1
      stats.photoPercent = Math.round((stats.photo / total) * 100)
      stats.barcodePercent = Math.round((stats.barcode / total) * 100)
      stats.manualPercent = Math.round((stats.manual / total) * 100)

      return stats
    } catch (error) {
      console.error('❌ Erreur lors du calcul des stats par méthode:', error)
      throw error
    }
  }
}

// Exporter une instance unique (Singleton)
export default new NutritionService()
