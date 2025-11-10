/**
 * Service d'export de données
 * Gère l'export CSV et JSON des repas
 */

import nutritionService from './nutrition.service'
import storageService from './storage.service'

/**
 * Service d'export
 */
class ExportService {
  /**
   * Exporte les repas en CSV
   * @param {Object} options - Options d'export
   * @param {string} options.startDate - Date de début (optionnel)
   * @param {string} options.endDate - Date de fin (optionnel)
   * @param {string} options.filename - Nom du fichier (optionnel)
   * @returns {Promise<void>}
   */
  async exportMealsToCSV(options = {}) {
    try {
      // Récupérer les repas avec filtres
      const meals = await nutritionService.getMeals({
        startDate: options.startDate,
        endDate: options.endDate
      })

      if (meals.length === 0) {
        throw new Error('Aucun repas à exporter')
      }

      // Générer le contenu CSV
      const csvContent = this.generateCSVContent(meals)

      // Générer le nom de fichier
      const filename = options.filename || this.generateFilename('csv', options)

      // Télécharger le fichier
      this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')

      console.log(`✅ Export CSV réussi: ${meals.length} repas`)
    } catch (error) {
      console.error('❌ Erreur lors de l\'export CSV:', error)
      throw error
    }
  }

  /**
   * Génère le contenu CSV
   * @param {Array<Meal>} meals - Liste des repas
   * @returns {string} Contenu CSV
   */
  generateCSVContent(meals) {
    // En-têtes CSV
    const headers = [
      'ID',
      'Date',
      'Heure',
      'Nom du repas',
      'Calories (kcal)',
      'Protéines (g)',
      'Glucides (g)',
      'Lipides (g)',
      'Fibres (g)',
      'Méthode d\'ajout',
      'Source',
      'Code-barre',
      'Portion (quantité)',
      'Portion (unité)',
      'Confiance IA',
      'Date de création'
    ]

    // Construire le CSV
    let csv = headers.join(',') + '\n'

    // Ajouter chaque repas
    meals.forEach(meal => {
      const row = [
        meal.id,
        meal.date,
        meal.time,
        this.escapeCSV(meal.name),
        meal.calories,
        meal.proteins,
        meal.carbs,
        meal.fats,
        meal.fiber || 0,
        meal.method,
        meal.source,
        meal.barcode || '',
        meal.portion?.quantity || 100,
        meal.portion?.unit || 'g',
        meal.confidence ? (meal.confidence * 100).toFixed(1) + '%' : '',
        meal.createdAt
      ]
      csv += row.join(',') + '\n'
    })

    return csv
  }

  /**
   * Échappe les caractères spéciaux pour CSV
   * @param {string} value - Valeur à échapper
   * @returns {string} Valeur échappée
   */
  escapeCSV(value) {
    if (value === null || value === undefined) return ''

    const stringValue = String(value)

    // Si contient virgule, guillemets ou retour chariot, entourer de guillemets
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  /**
   * Exporte toutes les données en JSON
   * @param {string} filename - Nom du fichier (optionnel)
   * @returns {Promise<void>}
   */
  async exportAllDataToJSON(filename) {
    try {
      // Récupérer toutes les données
      const data = storageService.exportData()

      // Convertir en JSON formaté
      const jsonContent = JSON.stringify(data, null, 2)

      // Générer le nom de fichier
      const fname = filename || this.generateFilename('json')

      // Télécharger le fichier
      this.downloadFile(jsonContent, fname, 'application/json')

      console.log('✅ Export JSON réussi')
    } catch (error) {
      console.error('❌ Erreur lors de l\'export JSON:', error)
      throw error
    }
  }

  /**
   * Génère un nom de fichier avec timestamp
   * @param {string} extension - Extension du fichier
   * @param {Object} options - Options (dates)
   * @returns {string} Nom du fichier
   */
  generateFilename(extension, options = {}) {
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 10).replace(/-/g, '')

    let filename = 'scanassiette'

    // Ajouter les dates si spécifiées
    if (options.startDate && options.endDate) {
      const start = options.startDate.replace(/-/g, '')
      const end = options.endDate.replace(/-/g, '')
      filename += `_${start}_${end}`
    } else {
      filename += `_${timestamp}`
    }

    filename += `.${extension}`

    return filename
  }

  /**
   * Télécharge un fichier
   * @param {string} content - Contenu du fichier
   * @param {string} filename - Nom du fichier
   * @param {string} mimeType - Type MIME
   */
  downloadFile(content, filename, mimeType) {
    // Créer un Blob
    const blob = new Blob([content], { type: mimeType })

    // Créer un lien de téléchargement
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename

    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()

    // Nettoyer
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  /**
   * Importe des données depuis un fichier JSON
   * @param {File} file - Fichier JSON
   * @returns {Promise<Object>} Résultat de l'import
   */
  async importDataFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result)

          // Valider le format
          if (!data.meals || !Array.isArray(data.meals)) {
            throw new Error('Format de fichier invalide')
          }

          // Importer les données
          storageService.importData(data)

          resolve({
            success: true,
            mealsCount: data.meals.length,
            message: `${data.meals.length} repas importés avec succès`
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Génère un rapport statistique en texte
   * @returns {Promise<string>} Rapport texte
   */
  async generateStatsReport() {
    try {
      const meals = await nutritionService.getAllMeals()
      const weeklyStats = await nutritionService.getWeeklyStats()
      const methodStats = await nutritionService.getMethodsStatistics()
      const settings = storageService.getSettings()

      let report = '='.repeat(60) + '\n'
      report += '           SCANASSIETTE - RAPPORT NUTRITIONNEL\n'
      report += '='.repeat(60) + '\n\n'

      report += `Date du rapport : ${new Date().toLocaleString('fr-FR')}\n`
      report += `Nombre total de repas : ${meals.length}\n\n`

      // Stats hebdomadaires
      report += '--- STATISTIQUES DES 7 DERNIERS JOURS ---\n\n'
      weeklyStats.forEach(day => {
        report += `${day.date} (${day.dayName}) : ${day.calories} kcal`
        report += ` | P: ${day.proteins}g | G: ${day.carbs}g | L: ${day.fats}g\n`
      })

      report += '\n--- RÉPARTITION PAR MÉTHODE ---\n\n'
      report += `📷 Photo : ${methodStats.photo} (${methodStats.photoPercent}%)\n`
      report += `📱 Scanner : ${methodStats.barcode} (${methodStats.barcodePercent}%)\n`
      report += `✍️ Manuel : ${methodStats.manual} (${methodStats.manualPercent}%)\n`

      report += '\n--- PARAMÈTRES ---\n\n'
      report += `Objectif calorique quotidien : ${settings.dailyCalorieGoal} kcal\n`
      report += `Utilisation Clarifai ce mois : ${settings.clarifaiUsage}/1000\n`

      report += '\n' + '='.repeat(60) + '\n'
      report += '        Généré par ScanAssiette v1.0\n'
      report += '='.repeat(60) + '\n'

      return report
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport:', error)
      throw error
    }
  }

  /**
   * Exporte le rapport statistique en fichier texte
   * @param {string} filename - Nom du fichier (optionnel)
   * @returns {Promise<void>}
   */
  async exportStatsReport(filename) {
    try {
      const report = await this.generateStatsReport()
      const fname = filename || this.generateFilename('txt')

      this.downloadFile(report, fname, 'text/plain;charset=utf-8;')

      console.log('✅ Export du rapport réussi')
    } catch (error) {
      console.error('❌ Erreur lors de l\'export du rapport:', error)
      throw error
    }
  }

  /**
   * Copie les données dans le presse-papiers
   * @param {string} format - Format ('csv' ou 'json')
   * @returns {Promise<void>}
   */
  async copyToClipboard(format = 'csv') {
    try {
      let content

      if (format === 'csv') {
        const meals = await nutritionService.getAllMeals()
        content = this.generateCSVContent(meals)
      } else if (format === 'json') {
        const data = storageService.exportData()
        content = JSON.stringify(data, null, 2)
      } else {
        throw new Error('Format invalide')
      }

      await navigator.clipboard.writeText(content)
      console.log('✅ Données copiées dans le presse-papiers')
    } catch (error) {
      console.error('❌ Erreur lors de la copie:', error)
      throw error
    }
  }
}

// Exporter une instance unique (Singleton)
export default new ExportService()
