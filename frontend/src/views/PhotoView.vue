<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <AppHeader />
    <AppNav />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🍽️</div>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Analyse de Photo IA
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Prenez une photo de votre repas et laissez l'IA identifier les aliments
        </p>
      </div>

      <!-- Upload Photo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <PhotoUpload
          :photo-preview="photoPreview"
          :is-analyzing="isAnalyzing"
          :error="error"
          :has-results="predictions.length > 0"
          :clarifai-limit-reached="clarifaiLimitReached"
          @upload="handlePhotoUpload"
          @analyze="handleAnalyze"
          @remove="handleReset"
        />
      </div>

      <!-- Résultats de l'analyse -->
      <div v-if="predictions.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <FoodPredictions
          :predictions="predictions"
          :is-loading="isLoading"
          @fetch-nutrition="handleFetchNutrition"
          @fetch-all-nutrition="handleFetchAllNutrition"
          @add-food="handleAddFood"
        />
      </div>

      <!-- Formulaire d'ajout (si aliment sélectionné) -->
      <div v-if="selectedFood" class="mb-6">
        <MealForm
          :meal="selectedFood"
          @submit="handleMealSubmit"
          @cancel="cancelAdd"
        />
      </div>

      <!-- Info Clarifai -->
      <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
        <p class="text-sm text-blue-800 dark:text-blue-200">
          💡 Analyse propulsée par
          <a
            href="https://www.clarifai.com/"
            target="_blank"
            rel="noopener"
            class="font-semibold underline hover:no-underline"
          >
            Clarifai
          </a>
          (1000 analyses gratuites/mois) +
          <a
            href="https://fdc.nal.usda.gov/"
            target="_blank"
            rel="noopener"
            class="font-semibold underline hover:no-underline"
          >
            USDA FoodData
          </a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMealsStore } from '@/stores/meals'
import { usePhoto } from '@/composables/usePhoto'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import PhotoUpload from '@/components/photo/PhotoUpload.vue'
import FoodPredictions from '@/components/photo/FoodPredictions.vue'
import MealForm from '@/components/meals/MealForm.vue'

const router = useRouter()
const mealsStore = useMealsStore()

const {
  isAnalyzing,
  isLoading,
  error,
  photoPreview,
  predictions,
  clarifaiLimitReached,
  uploadPhoto,
  analyzePhoto,
  fetchNutritionData,
  fetchAllNutritionData,
  predictionToMeal,
  reset,
  cleanup
} = usePhoto()

const selectedFood = ref(null)

// Nettoyer au démontage
onUnmounted(() => {
  cleanup()
})

async function handlePhotoUpload(file) {
  try {
    await uploadPhoto(file)
  } catch (err) {
    console.error('Erreur upload:', err)
  }
}

async function handleAnalyze() {
  try {
    await analyzePhoto()
    // Charger automatiquement toutes les données nutritionnelles
    await handleFetchAllNutrition()
  } catch (err) {
    console.error('Erreur analyse:', err)
  }
}

async function handleFetchNutrition(prediction, index) {
  try {
    await fetchNutritionData(prediction, index)
  } catch (err) {
    console.error('Erreur nutrition:', err)
  }
}

async function handleFetchAllNutrition() {
  try {
    await fetchAllNutritionData()
  } catch (err) {
    console.error('Erreur chargement nutrition:', err)
  }
}

function handleAddFood(prediction) {
  try {
    const mealData = predictionToMeal(prediction)

    // Préparer pour le formulaire
    selectedFood.value = {
      ...mealData,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    // Scroll vers le formulaire
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  } catch (err) {
    alert('❌ Erreur: ' + err.message)
  }
}

async function handleMealSubmit(mealData) {
  try {
    await mealsStore.addMeal(mealData)
    alert('✅ Repas ajouté avec succès !')

    // Réinitialiser
    selectedFood.value = null

    // Rediriger vers l'historique
    router.push('/history')
  } catch (error) {
    alert('❌ Erreur: ' + error.message)
  }
}

function cancelAdd() {
  selectedFood.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleReset() {
  reset()
  selectedFood.value = null
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
