/**
 * Store Pinia pour les paramètres de l'application
 * Gère les préférences utilisateur (objectif calorique, thème, etc.)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import storageService from '@/services/storage.service'

export const useSettingsStore = defineStore('settings', () => {
  // ==================== STATE ====================

  const dailyCalorieGoal = ref(2000)
  const darkMode = ref(false)
  const language = ref('fr')
  const clarifaiUsage = ref(0)
  const clarifaiResetDate = ref(new Date().toISOString().slice(0, 7))
  const units = ref('metric')
  const notifications = ref(true)
  const isLoaded = ref(false)

  // ==================== GETTERS (Computed) ====================

  /**
   * Vérifie si la limite Clarifai est atteinte
   */
  const isClarifaiLimitReached = computed(() => {
    return clarifaiUsage.value >= 1000
  })

  /**
   * Calcule le pourcentage d'utilisation Clarifai
   */
  const clarifaiUsagePercentage = computed(() => {
    return Math.min(100, Math.round((clarifaiUsage.value / 1000) * 100))
  })

  /**
   * Nombre d'appels Clarifai restants
   */
  const clarifaiRemaining = computed(() => {
    return Math.max(0, 1000 - clarifaiUsage.value)
  })

  /**
   * Retourne toutes les settings sous forme d'objet
   */
  const allSettings = computed(() => {
    return {
      dailyCalorieGoal: dailyCalorieGoal.value,
      darkMode: darkMode.value,
      language: language.value,
      clarifaiUsage: clarifaiUsage.value,
      clarifaiResetDate: clarifaiResetDate.value,
      units: units.value,
      notifications: notifications.value
    }
  })

  // ==================== ACTIONS ====================

  /**
   * Charge les paramètres depuis localStorage
   */
  function loadSettings() {
    try {
      const settings = storageService.getSettings()

      dailyCalorieGoal.value = settings.dailyCalorieGoal
      darkMode.value = settings.darkMode
      language.value = settings.language
      clarifaiUsage.value = settings.clarifaiUsage
      clarifaiResetDate.value = settings.clarifaiResetDate
      units.value = settings.units
      notifications.value = settings.notifications

      isLoaded.value = true

      // Appliquer le dark mode si activé
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      }

      console.log('✅ Paramètres chargés')
    } catch (error) {
      console.error('❌ Erreur lors du chargement des paramètres:', error)
    }
  }

  /**
   * Sauvegarde les paramètres dans localStorage
   */
  function saveSettings() {
    try {
      storageService.updateSettings(allSettings.value)
      console.log('✅ Paramètres sauvegardés')
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des paramètres:', error)
      throw error
    }
  }

  /**
   * Met à jour l'objectif calorique
   * @param {number} goal - Nouvel objectif
   */
  function updateCalorieGoal(goal) {
    try {
      if (goal < 0) {
        throw new Error('L\'objectif ne peut pas être négatif')
      }

      dailyCalorieGoal.value = Math.round(goal)
      saveSettings()

      console.log(`✅ Objectif calorique mis à jour: ${goal} kcal`)
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'objectif:', error)
      throw error
    }
  }

  /**
   * Active/désactive le mode sombre
   * @param {boolean} value - true pour activer, false pour désactiver
   */
  function toggleDarkMode(value = null) {
    try {
      // Si pas de valeur fournie, inverser l'état actuel
      if (value === null) {
        darkMode.value = !darkMode.value
      } else {
        darkMode.value = value
      }

      // Appliquer au DOM
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      saveSettings()

      console.log(`✅ Mode sombre ${darkMode.value ? 'activé' : 'désactivé'}`)
    } catch (error) {
      console.error('❌ Erreur lors du changement de thème:', error)
      throw error
    }
  }

  /**
   * Change la langue de l'application
   * @param {string} lang - Code langue ('fr' ou 'en')
   */
  function changeLanguage(lang) {
    try {
      if (!['fr', 'en'].includes(lang)) {
        throw new Error('Langue non supportée')
      }

      language.value = lang
      saveSettings()

      console.log(`✅ Langue changée: ${lang}`)
    } catch (error) {
      console.error('❌ Erreur lors du changement de langue:', error)
      throw error
    }
  }

  /**
   * Incrémente le compteur d'utilisation Clarifai
   */
  function incrementClarifaiUsage() {
    try {
      const newUsage = storageService.incrementClarifaiUsage()
      clarifaiUsage.value = newUsage

      console.log(`📊 Utilisation Clarifai: ${newUsage}/1000`)

      // Recharger les settings pour avoir la date de reset
      loadSettings()
    } catch (error) {
      console.error('❌ Erreur lors de l\'incrémentation Clarifai:', error)
      throw error
    }
  }

  /**
   * Change le système d'unités
   * @param {string} system - 'metric' ou 'imperial'
   */
  function changeUnits(system) {
    try {
      if (!['metric', 'imperial'].includes(system)) {
        throw new Error('Système d\'unités non supporté')
      }

      units.value = system
      saveSettings()

      console.log(`✅ Unités changées: ${system}`)
    } catch (error) {
      console.error('❌ Erreur lors du changement d\'unités:', error)
      throw error
    }
  }

  /**
   * Active/désactive les notifications
   * @param {boolean} value - true pour activer
   */
  function toggleNotifications(value = null) {
    try {
      if (value === null) {
        notifications.value = !notifications.value
      } else {
        notifications.value = value
      }

      saveSettings()

      console.log(`✅ Notifications ${notifications.value ? 'activées' : 'désactivées'}`)
    } catch (error) {
      console.error('❌ Erreur lors du changement des notifications:', error)
      throw error
    }
  }

  /**
   * Réinitialise tous les paramètres
   */
  function resetSettings() {
    try {
      const defaultSettings = storageService.resetSettings()

      // Mettre à jour le state
      dailyCalorieGoal.value = defaultSettings.dailyCalorieGoal
      darkMode.value = defaultSettings.darkMode
      language.value = defaultSettings.language
      clarifaiUsage.value = defaultSettings.clarifaiUsage
      clarifaiResetDate.value = defaultSettings.clarifaiResetDate
      units.value = defaultSettings.units
      notifications.value = defaultSettings.notifications

      // Appliquer le dark mode
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      console.log('✅ Paramètres réinitialisés')
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error)
      throw error
    }
  }

  /**
   * Efface toutes les données de l'application
   * ⚠️ Action irréversible !
   */
  function clearAllData() {
    try {
      storageService.clearAllData()
      resetSettings()

      console.log('✅ Toutes les données ont été effacées')
    } catch (error) {
      console.error('❌ Erreur lors de l\'effacement des données:', error)
      throw error
    }
  }

  // ==================== INITIALIZATION ====================

  // Charger automatiquement les paramètres au démarrage du store
  if (!isLoaded.value) {
    loadSettings()
  }

  // ==================== RETURN (API PUBLIQUE) ====================

  return {
    // State
    dailyCalorieGoal,
    darkMode,
    language,
    clarifaiUsage,
    clarifaiResetDate,
    units,
    notifications,
    isLoaded,

    // Getters
    isClarifaiLimitReached,
    clarifaiUsagePercentage,
    clarifaiRemaining,
    allSettings,

    // Actions
    loadSettings,
    saveSettings,
    updateCalorieGoal,
    toggleDarkMode,
    changeLanguage,
    incrementClarifaiUsage,
    changeUnits,
    toggleNotifications,
    resetSettings,
    clearAllData
  }
})
