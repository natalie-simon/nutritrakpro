/**
 * Service de gestion du stockage local (localStorage)
 * Gère les repas et les paramètres de l'application en mode hors ligne
 */

const STORAGE_KEYS = {
  MEALS: 'scanassiette_meals',
  SETTINGS: 'scanassiette_settings'
}

// Paramètres par défaut
const DEFAULT_SETTINGS = {
  dailyCalorieGoal: 2000,
  darkMode: false,
  language: 'fr',
  clarifaiUsage: 0,
  clarifaiResetDate: new Date().toISOString().slice(0, 7), // Format: "2025-11"
  units: 'metric',
  notifications: true
}

/**
 * Service de stockage local
 */
class StorageService {
  // ==================== MEALS ====================

  /**
   * Récupère tous les repas
   * @returns {Array} Liste des repas
   */
  getMeals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Erreur lors de la récupération des repas:', error)
      return []
    }
  }

  /**
   * Récupère les repas avec filtres
   * @param {Object} filters - Filtres à appliquer
   * @param {string} filters.startDate - Date de début (YYYY-MM-DD)
   * @param {string} filters.endDate - Date de fin (YYYY-MM-DD)
   * @param {string} filters.method - Méthode d'ajout (photo, barcode, manual)
   * @returns {Array} Liste des repas filtrés
   */
  getMealsWithFilters(filters = {}) {
    let meals = this.getMeals()

    // Filtre par date de début
    if (filters.startDate) {
      meals = meals.filter(meal => meal.date >= filters.startDate)
    }

    // Filtre par date de fin
    if (filters.endDate) {
      meals = meals.filter(meal => meal.date <= filters.endDate)
    }

    // Filtre par méthode
    if (filters.method) {
      meals = meals.filter(meal => meal.method === filters.method)
    }

    // Trier par date décroissante (plus récent d'abord)
    return meals.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB - dateA
    })
  }

  /**
   * Récupère les repas d'une date spécifique
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Array} Liste des repas du jour
   */
  getMealsByDate(date) {
    return this.getMealsWithFilters({ startDate: date, endDate: date })
  }

  /**
   * Récupère un repas par son ID
   * @param {string} id - ID du repas
   * @returns {Object|null} Le repas ou null si non trouvé
   */
  getMealById(id) {
    const meals = this.getMeals()
    return meals.find(meal => meal.id === id) || null
  }

  /**
   * Sauvegarde un nouveau repas
   * @param {Object} meal - Données du repas
   * @returns {Object} Le repas sauvegardé avec son ID
   */
  saveMeal(meal) {
    try {
      const meals = this.getMeals()

      // Générer un ID si non fourni
      if (!meal.id) {
        meal.id = Date.now().toString()
      }

      // Ajouter timestamps
      meal.createdAt = meal.createdAt || new Date().toISOString()
      meal.updatedAt = new Date().toISOString()

      // Ajouter le repas
      meals.push(meal)

      // Sauvegarder
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals))

      console.log('✅ Repas sauvegardé:', meal.name)
      return meal
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du repas:', error)
      throw error
    }
  }

  /**
   * Met à jour un repas existant
   * @param {string} id - ID du repas
   * @param {Object} updates - Données à mettre à jour
   * @returns {Object|null} Le repas mis à jour ou null si non trouvé
   */
  updateMeal(id, updates) {
    try {
      const meals = this.getMeals()
      const index = meals.findIndex(meal => meal.id === id)

      if (index === -1) {
        console.warn('⚠️ Repas non trouvé:', id)
        return null
      }

      // Mettre à jour le repas
      meals[index] = {
        ...meals[index],
        ...updates,
        id, // Garder l'ID original
        updatedAt: new Date().toISOString()
      }

      // Sauvegarder
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals))

      console.log('✅ Repas mis à jour:', meals[index].name)
      return meals[index]
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du repas:', error)
      throw error
    }
  }

  /**
   * Supprime un repas
   * @param {string} id - ID du repas à supprimer
   * @returns {boolean} true si supprimé, false sinon
   */
  deleteMeal(id) {
    try {
      const meals = this.getMeals()
      const filteredMeals = meals.filter(meal => meal.id !== id)

      if (meals.length === filteredMeals.length) {
        console.warn('⚠️ Repas non trouvé:', id)
        return false
      }

      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filteredMeals))
      console.log('✅ Repas supprimé:', id)
      return true
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du repas:', error)
      throw error
    }
  }

  /**
   * Supprime tous les repas
   * @returns {boolean} true si succès
   */
  clearAllMeals() {
    try {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify([]))
      console.log('✅ Tous les repas ont été supprimés')
      return true
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des repas:', error)
      throw error
    }
  }

  // ==================== SETTINGS ====================

  /**
   * Récupère les paramètres
   * @returns {Object} Paramètres de l'application
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      const settings = data ? JSON.parse(data) : {}

      // Fusionner avec les paramètres par défaut
      return { ...DEFAULT_SETTINGS, ...settings }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Met à jour les paramètres
   * @param {Object} settings - Nouveaux paramètres
   * @returns {Object} Paramètres mis à jour
   */
  updateSettings(settings) {
    try {
      const currentSettings = this.getSettings()
      const newSettings = { ...currentSettings, ...settings }

      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings))
      console.log('✅ Paramètres mis à jour')
      return newSettings
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des paramètres:', error)
      throw error
    }
  }

  /**
   * Réinitialise les paramètres par défaut
   * @returns {Object} Paramètres par défaut
   */
  resetSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
      console.log('✅ Paramètres réinitialisés')
      return DEFAULT_SETTINGS
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des paramètres:', error)
      throw error
    }
  }

  // ==================== STATS ====================

  /**
   * Récupère le total nutritionnel pour une date
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Object} Total des macros du jour
   */
  getDailyTotal(date) {
    const meals = this.getMealsByDate(date)

    return meals.reduce((total, meal) => {
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
  }

  /**
   * Récupère les stats des 7 derniers jours
   * @returns {Array} Stats quotidiennes
   */
  getWeeklyStats() {
    const stats = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dailyTotal = this.getDailyTotal(dateStr)

      stats.push({
        date: dateStr,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        ...dailyTotal
      })
    }

    return stats
  }

  // ==================== EXPORT / IMPORT ====================

  /**
   * Exporte toutes les données
   * @returns {Object} Données complètes (repas + paramètres)
   */
  exportData() {
    return {
      meals: this.getMeals(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  /**
   * Importe des données
   * @param {Object} data - Données à importer
   * @returns {boolean} true si succès
   */
  importData(data) {
    try {
      if (data.meals) {
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(data.meals))
      }
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
      }
      console.log('✅ Données importées avec succès')
      return true
    } catch (error) {
      console.error('❌ Erreur lors de l\'importation des données:', error)
      throw error
    }
  }

  /**
   * Efface toutes les données de l'application
   * @returns {boolean} true si succès
   */
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.MEALS)
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      console.log('✅ Toutes les données ont été effacées')
      return true
    } catch (error) {
      console.error('❌ Erreur lors de l\'effacement des données:', error)
      throw error
    }
  }

  // ==================== CLARIFAI USAGE ====================

  /**
   * Incrémente le compteur d'utilisation Clarifai
   * Réinitialise automatiquement le compteur si on change de mois
   * @returns {number} Nouvelle valeur du compteur
   */
  incrementClarifaiUsage() {
    const settings = this.getSettings()
    const currentMonth = new Date().toISOString().slice(0, 7)

    // Réinitialiser si nouveau mois
    if (settings.clarifaiResetDate !== currentMonth) {
      settings.clarifaiUsage = 0
      settings.clarifaiResetDate = currentMonth
    }

    settings.clarifaiUsage += 1
    this.updateSettings(settings)

    return settings.clarifaiUsage
  }

  /**
   * Récupère le nombre d'utilisations Clarifai ce mois-ci
   * @returns {number} Nombre d'utilisations
   */
  getClarifaiUsage() {
    const settings = this.getSettings()
    const currentMonth = new Date().toISOString().slice(0, 7)

    // Si on est dans un nouveau mois, retourner 0
    if (settings.clarifaiResetDate !== currentMonth) {
      return 0
    }

    return settings.clarifaiUsage || 0
  }
}

// Exporter une instance unique (Singleton)
export default new StorageService()
