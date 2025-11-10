<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <AppHeader />
    <AppNav />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🔍</div>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Recherche d'Aliments
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Recherchez dans la base USDA FoodData Central
        </p>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <form @submit.prevent="handleSearch" class="search-form">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ex: poulet, riz, pomme, chicken..."
              class="search-input"
              :disabled="isSearching"
            />
            <button
              type="submit"
              class="search-button"
              :disabled="isSearching || searchQuery.trim().length < 2"
            >
              {{ isSearching ? '⏳' : '🔍' }} {{ isSearching ? 'Recherche...' : 'Rechercher' }}
            </button>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Astuce: La recherche fonctionne mieux en anglais (ex: "chicken breast", "brown rice")
          </p>
        </form>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="alert-error mb-6">
        ❌ {{ error }}
      </div>

      <!-- Résultats de recherche -->
      <div v-if="hasSearched && results.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <FoodSearchResults
          :results="results"
          :show-empty-state="false"
          @add-food="handleAddFood"
        />
      </div>

      <!-- État vide après recherche -->
      <div v-if="hasSearched && results.length === 0 && !error" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🤔</div>
          <p class="text-gray-600 dark:text-gray-400">
            Aucun aliment trouvé pour "{{ query }}"
            <br>
            <span class="text-sm mt-2 block">
              Essayez avec des termes différents ou en anglais (ex: "chicken", "rice").
            </span>
          </p>
        </div>
      </div>

      <!-- Formulaire d'ajout (si aliment sélectionné) -->
      <div v-if="selectedFood" class="mb-6">
        <MealForm
          :meal="selectedFood"
          @submit="handleMealSubmit"
          @cancel="cancelAdd"
        />
      </div>

      <!-- Info USDA -->
      <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
        <p class="text-sm text-blue-800 dark:text-blue-200">
          💡 Données nutritionnelles fournies par
          <a
            href="https://fdc.nal.usda.gov/"
            target="_blank"
            rel="noopener"
            class="font-semibold underline hover:no-underline"
          >
            USDA FoodData Central
          </a>
          (base de données gratuite et illimitée)
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMealsStore } from '@/stores/meals'
import { useSearch } from '@/composables/useSearch'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import FoodSearchResults from '@/components/search/FoodSearchResults.vue'
import MealForm from '@/components/meals/MealForm.vue'

const router = useRouter()
const mealsStore = useMealsStore()

const {
  isSearching,
  error,
  query,
  results,
  hasSearched,
  searchFood,
  foodResultToMeal,
  reset
} = useSearch()

const searchQuery = ref('')
const selectedFood = ref(null)

async function handleSearch() {
  try {
    await searchFood(searchQuery.value)
  } catch (err) {
    console.error('Erreur recherche:', err)
  }
}

function handleAddFood(foodResult) {
  try {
    const mealData = foodResultToMeal(foodResult)

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
    searchQuery.value = ''
    reset()

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
</script>

<style scoped>
.search-form {
  @apply space-y-2;
}

.search-input {
  @apply w-full px-4 py-3 pr-32 border-2 border-gray-300 dark:border-gray-600
         rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         transition text-lg;
}

.search-input:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.search-button {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2
         bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg
         font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.alert-error {
  @apply p-4 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700
         rounded-lg text-red-800 dark:text-red-200 text-sm;
}
</style>
