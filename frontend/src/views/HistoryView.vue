<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
    <!-- Header -->
    <AppHeader />

    <!-- Navigation -->
    <AppNav />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Progression objectif -->
      <div class="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🎯 Objectif du jour
        </h2>

        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ goalProgress.consumed }} / {{ goalProgress.goal }} kcal
            </span>
            <span class="font-semibold text-purple-600 dark:text-purple-400">
              {{ goalProgress.percentage }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: goalProgress.percentage + '%' }"
            ></div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Reste: <span class="font-bold">{{ goalProgress.remaining }}</span> kcal
          <span v-if="goalProgress.exceeded" class="text-orange-600 dark:text-orange-400 font-bold ml-2">
            (⚠️ Objectif dépassé de {{ Math.abs(goalProgress.remaining) }} kcal)
          </span>
        </p>
      </div>

      <!-- Résumé du jour -->
      <div class="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          📊 Résumé du jour
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ todayTotal.calories }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Calories</div>
          </div>
          <div class="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ todayTotal.proteins }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Protéines (g)</div>
          </div>
          <div class="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ todayTotal.carbs }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Glucides (g)</div>
          </div>
          <div class="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400">
              {{ todayTotal.fats }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Lipides (g)</div>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <MealForm
        :meal="editingMeal"
        @submit="handleMealSubmit"
        @cancel="cancelEdit"
      />

      <!-- Boutons d'action -->
      <div class="mb-4 flex gap-2 justify-end">
        <button
          @click="exportCSV"
          class="btn-action bg-blue-600 hover:bg-blue-700"
        >
          📥 Exporter CSV
        </button>
        <button
          @click="clearHistory"
          class="btn-action bg-red-600 hover:bg-red-700"
          v-if="meals.length > 0"
        >
          🗑️ Effacer l'historique
        </button>
      </div>

      <!-- Liste des repas -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          📝 Mes repas ({{ meals.length }})
        </h2>

        <!-- Message si vide -->
        <div
          v-if="meals.length === 0"
          class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div class="text-6xl mb-4">📭</div>
          <p class="text-gray-500 dark:text-gray-400">
            Aucun repas enregistré. Ajoutez votre premier repas ci-dessus !
          </p>
        </div>

        <!-- Repas groupés par date -->
        <div v-else class="space-y-6">
          <div
            v-for="dayGroup in mealsByDate"
            :key="dayGroup.date"
            class="meal-day-group"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300 capitalize">
                {{ dayGroup.dayName }} - {{ formatDate(dayGroup.date) }}
              </h3>
              <div class="text-sm font-semibold text-green-600 dark:text-green-400">
                {{ dayGroup.total.calories }} kcal
              </div>
            </div>

            <div v-if="dayGroup.meals.length > 0" class="space-y-3">
              <MealCard
                v-for="meal in dayGroup.meals"
                :key="meal.id"
                :meal="meal"
                @edit="editMeal"
                @delete="deleteMeal"
              />
            </div>
            <div v-else class="text-center py-4 text-gray-400 dark:text-gray-600 text-sm">
              Aucun repas ce jour-là
            </div>
          </div>
        </div>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <div class="animate-spin text-4xl mb-4">⏳</div>
          <p class="text-gray-700 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMealsStore } from '@/stores/meals'
import { useSettingsStore } from '@/stores/settings'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import MealCard from '@/components/meals/MealCard.vue'
import MealForm from '@/components/meals/MealForm.vue'

const mealsStore = useMealsStore()
const settingsStore = useSettingsStore()

const editingMeal = ref(null)
const isLoading = computed(() => mealsStore.isLoading)

const meals = computed(() => mealsStore.meals)
const todayTotal = computed(() => mealsStore.todayTotal)
const goalProgress = computed(() => mealsStore.goalProgress)
const mealsByDate = computed(() => mealsStore.mealsByDate)

onMounted(async () => {
  // Charger les repas
  await mealsStore.loadMeals()
})

async function handleMealSubmit(mealData) {
  try {
    if (editingMeal.value) {
      // Mode édition
      await mealsStore.updateMeal(editingMeal.value.id, mealData)
      alert('✅ Repas mis à jour !')
      editingMeal.value = null
    } else {
      // Mode ajout
      await mealsStore.addMeal(mealData)
      alert('✅ Repas ajouté !')
    }
  } catch (error) {
    alert('❌ Erreur: ' + error.message)
  }
}

function editMeal(meal) {
  editingMeal.value = { ...meal }
  // Scroll vers le formulaire
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingMeal.value = null
}

async function deleteMeal(mealId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce repas ?')) {
    try {
      await mealsStore.deleteMeal(mealId)
      alert('✅ Repas supprimé !')
    } catch (error) {
      alert('❌ Erreur: ' + error.message)
    }
  }
}

async function clearHistory() {
  if (confirm('⚠️ Êtes-vous sûr de vouloir effacer TOUS les repas ? Cette action est irréversible !')) {
    try {
      await mealsStore.clearAllMeals()
      alert('✅ Historique effacé !')
    } catch (error) {
      alert('❌ Erreur: ' + error.message)
    }
  }
}

async function exportCSV() {
  try {
    await mealsStore.exportToCSV()
    alert('✅ Export CSV réussi ! Le fichier a été téléchargé.')
  } catch (error) {
    alert('❌ Erreur lors de l\'export: ' + error.message)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.btn-action {
  @apply text-white px-4 py-2 rounded-lg font-semibold transition text-sm shadow-lg;
}

.meal-day-group {
  @apply bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
