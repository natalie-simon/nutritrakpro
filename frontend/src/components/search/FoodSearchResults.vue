<template>
  <div class="food-search-results">
    <!-- En-tête avec compteur -->
    <div v-if="results.length > 0" class="mb-4">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white">
        🍽️ {{ results.length }} aliment{{ results.length > 1 ? 's' : '' }} trouvé{{ results.length > 1 ? 's' : '' }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Cliquez sur "Ajouter" pour inclure un aliment dans votre journal
      </p>
    </div>

    <!-- Liste des résultats --><div class="space-y-3">
      <div
        v-for="food in results"
        :key="food.fdcId"
        class="result-card"
      >
        <div class="flex items-start justify-between">
          <!-- Info aliment -->
          <div class="flex-1">
            <div class="mb-2">
              <h4 class="text-lg font-bold text-gray-800 dark:text-white">
                {{ food.name }}
              </h4>

              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mt-2">
                <!-- Type de données -->
                <span v-if="food.dataType" class="badge badge-blue">
                  {{ getDataTypeLabel(food.dataType) }}
                </span>

                <!-- Marque -->
                <span v-if="food.brandOwner" class="badge badge-purple">
                  {{ food.brandOwner }}
                </span>

                <!-- Catégorie -->
                <span v-if="food.category" class="badge badge-gray">
                  {{ food.category }}
                </span>
              </div>
            </div>

            <!-- Valeurs nutritionnelles -->
            <div class="nutrition-grid">
              <div class="macro-box">
                <div class="macro-value text-green-600 dark:text-green-400">
                  {{ food.calories }}
                </div>
                <div class="macro-label">kcal</div>
              </div>

              <div class="macro-box">
                <div class="macro-value text-blue-600 dark:text-blue-400">
                  {{ food.proteins }}g
                </div>
                <div class="macro-label">Prot.</div>
              </div>

              <div class="macro-box">
                <div class="macro-value text-yellow-600 dark:text-yellow-400">
                  {{ food.carbs }}g
                </div>
                <div class="macro-label">Gluc.</div>
              </div>

              <div class="macro-box">
                <div class="macro-value text-red-600 dark:text-red-400">
                  {{ food.fats }}g
                </div>
                <div class="macro-label">Lip.</div>
              </div>

              <div v-if="food.fiber > 0" class="macro-box">
                <div class="macro-value text-orange-600 dark:text-orange-400">
                  {{ food.fiber }}g
                </div>
                <div class="macro-label">Fibres</div>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Valeurs pour 100g · Source: USDA FoodData Central
            </p>
          </div>

          <!-- Bouton Ajouter -->
          <div class="ml-4">
            <button
              @click="$emit('add-food', food)"
              class="btn-add"
              title="Ajouter au journal"
            >
              ➕ Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-if="results.length === 0 && showEmptyState" class="empty-state">
      <div class="text-6xl mb-4">🤔</div>
      <p class="text-gray-600 dark:text-gray-400">
        {{ emptyMessage || 'Aucun aliment trouvé pour cette recherche.' }}
        <br>
        <span class="text-sm">
          Essayez avec des termes différents ou en anglais (ex: "chicken", "rice").
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Array,
    required: true
  },
  showEmptyState: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: null
  }
})

defineEmits(['add-food'])

/**
 * Convertit le type de données USDA en label lisible
 */
function getDataTypeLabel(dataType) {
  const labels = {
    'Branded': 'Marque',
    'Survey (FNDDS)': 'Base',
    'SR Legacy': 'Standard',
    'Foundation': 'Fondation',
    'Experimental': 'Expérimental'
  }
  return labels[dataType] || dataType
}
</script>

<style scoped>
.result-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4
         border-2 border-transparent hover:border-green-500
         transition;
}

.badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.badge-blue {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200;
}

.badge-purple {
  @apply bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200;
}

.badge-gray {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}

.nutrition-grid {
  @apply grid grid-cols-2 md:grid-cols-5 gap-2 mt-2;
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

.btn-add {
  @apply bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg
         font-semibold transition whitespace-nowrap;
}

.empty-state {
  @apply text-center py-12 bg-white dark:bg-gray-800 rounded-lg;
}
</style>
