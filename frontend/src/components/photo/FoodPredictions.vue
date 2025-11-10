<template>
  <div class="food-predictions">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white">
        🍽️ Aliments détectés ({{ predictions.length }})
      </h3>
      <button
        v-if="!allNutritionLoaded"
        @click="$emit('fetch-all-nutrition')"
        :disabled="isLoading"
        class="btn-load-all"
      >
        {{ isLoading ? '⏳ Chargement...' : '📊 Charger toutes les valeurs' }}
      </button>
    </div>

    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Cliquez sur "Ajouter" pour inclure un aliment dans votre journal
    </p>

    <!-- Liste des prédictions -->
    <div class="space-y-3">
      <div
        v-for="(prediction, index) in predictions"
        :key="index"
        class="prediction-card"
      >
        <div class="flex items-start justify-between">
          <!-- Info aliment -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="text-lg font-bold text-gray-800 dark:text-white capitalize">
                {{ prediction.name }}
              </h4>
              <span class="confidence-badge" :class="getConfidenceClass(prediction.confidence)">
                {{ Math.round(prediction.confidence * 100) }}% sûr
              </span>
            </div>

            <!-- Données nutritionnelles (si chargées) -->
            <div v-if="prediction.nutritionData" class="nutrition-data">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ prediction.nutritionData.description }}
              </p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="macro-box">
                  <div class="macro-value text-green-600 dark:text-green-400">
                    {{ prediction.nutritionData.calories }}
                  </div>
                  <div class="macro-label">kcal</div>
                </div>
                <div class="macro-box">
                  <div class="macro-value text-blue-600 dark:text-blue-400">
                    {{ prediction.nutritionData.proteins }}g
                  </div>
                  <div class="macro-label">Prot.</div>
                </div>
                <div class="macro-box">
                  <div class="macro-value text-yellow-600 dark:text-yellow-400">
                    {{ prediction.nutritionData.carbs }}g
                  </div>
                  <div class="macro-label">Gluc.</div>
                </div>
                <div class="macro-box">
                  <div class="macro-value text-red-600 dark:text-red-400">
                    {{ prediction.nutritionData.fats }}g
                  </div>
                  <div class="macro-label">Lip.</div>
                </div>
              </div>

              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Valeurs pour 100g · Source: USDA FoodData Central
              </p>
            </div>

            <!-- Loading nutrition -->
            <div v-else-if="prediction.isLoading" class="nutrition-loading">
              <div class="inline-block animate-spin text-xl mr-2">⏳</div>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Recherche des valeurs nutritionnelles...
              </span>
            </div>

            <!-- Pas encore chargé -->
            <div v-else class="nutrition-empty">
              <button
                @click="$emit('fetch-nutrition', prediction, index)"
                class="btn-load-nutrition"
              >
                📊 Charger les valeurs nutritionnelles
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="ml-4">
            <button
              v-if="prediction.nutritionData"
              @click="$emit('add-food', prediction)"
              class="btn-add"
              title="Ajouter au journal"
            >
              ➕ Ajouter
            </button>
            <button
              v-else
              disabled
              class="btn-add-disabled"
              title="Chargez d'abord les valeurs nutritionnelles"
            >
              ➕ Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune prédiction -->
    <div v-if="predictions.length === 0" class="empty-state">
      <div class="text-6xl mb-4">🤔</div>
      <p class="text-gray-600 dark:text-gray-400">
        Aucun aliment détecté dans cette photo.
        <br>
        Essayez avec une photo plus claire ou utilisez la recherche manuelle.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  predictions: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['fetch-nutrition', 'fetch-all-nutrition', 'add-food'])

// Vérifie si toutes les données nutritionnelles sont chargées
const allNutritionLoaded = computed(() => {
  return props.predictions.every(p => p.nutritionData !== null)
})

function getConfidenceClass(confidence) {
  if (confidence >= 0.95) return 'confidence-high'
  if (confidence >= 0.85) return 'confidence-medium'
  return 'confidence-low'
}
</script>

<style scoped>
.prediction-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4
         border-2 border-transparent hover:border-green-500
         transition;
}

.confidence-badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.confidence-high {
  @apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200;
}

.confidence-medium {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200;
}

.confidence-low {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}

.nutrition-data {
  @apply mt-2;
}

.macro-box {
  @apply text-center bg-gray-50 dark:bg-gray-700 rounded p-2;
}

.macro-value {
  @apply text-lg font-bold;
}

.macro-label {
  @apply text-xs text-gray-600 dark:text-gray-400;
}

.nutrition-loading {
  @apply mt-2 text-center py-4;
}

.nutrition-empty {
  @apply mt-2;
}

.btn-load-nutrition {
  @apply text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200
         px-3 py-2 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-800
         transition;
}

.btn-load-all {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
         font-semibold transition text-sm disabled:opacity-50
         disabled:cursor-not-allowed;
}

.btn-add {
  @apply bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg
         font-semibold transition whitespace-nowrap;
}

.btn-add-disabled {
  @apply bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400
         px-4 py-2 rounded-lg font-semibold cursor-not-allowed
         whitespace-nowrap opacity-50;
}

.empty-state {
  @apply text-center py-12 bg-white dark:bg-gray-800 rounded-lg;
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
