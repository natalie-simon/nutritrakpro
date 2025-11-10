<template>
  <div class="meal-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 hover:shadow-xl transition-shadow">
    <div class="flex items-start justify-between">
      <!-- Info principale -->
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ meal.name }}
          </h3>
          <span class="badge" :class="methodColor">
            {{ methodIcon }} {{ methodLabel }}
          </span>
        </div>

        <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>🕐 {{ meal.time }}</span>
          <span class="ml-4">📅 {{ formatDate(meal.date) }}</span>
        </div>

        <!-- Macros -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="macro-item">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ meal.calories }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Calories</div>
          </div>
          <div class="macro-item">
            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
              {{ meal.proteins }}g
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Protéines</div>
          </div>
          <div class="macro-item">
            <div class="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ meal.carbs }}g
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Glucides</div>
          </div>
          <div class="macro-item">
            <div class="text-xl font-bold text-red-600 dark:text-red-400">
              {{ meal.fats }}g
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Lipides</div>
          </div>
        </div>

        <!-- Photo si disponible -->
        <div v-if="meal.photo" class="mt-3">
          <img :src="meal.photo" alt="Photo du repas" class="rounded-lg max-h-32 object-cover" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col space-y-2 ml-4">
        <button
          @click="$emit('edit', meal)"
          class="btn-icon btn-edit"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete', meal.id)"
          class="btn-icon btn-delete"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meal: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const methodLabel = computed(() => {
  const labels = {
    photo: 'Photo',
    barcode: 'Scanner',
    manual: 'Manuel'
  }
  return labels[props.meal.method] || 'Inconnu'
})

const methodIcon = computed(() => {
  const icons = {
    photo: '📸',
    barcode: '📱',
    manual: '✍️'
  }
  return icons[props.meal.method] || '❓'
})

const methodColor = computed(() => {
  const colors = {
    photo: 'badge-blue',
    barcode: 'badge-purple',
    manual: 'badge-gray'
  }
  return colors[props.meal.method] || 'badge-gray'
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short'
  })
}
</script>

<style scoped>
.meal-card {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.macro-item {
  @apply text-center;
}

.btn-icon {
  @apply p-2 rounded-lg transition text-xl;
}

.btn-edit {
  @apply bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800;
}

.btn-delete {
  @apply bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800;
}

.badge {
  @apply px-2 py-1 rounded text-xs font-semibold;
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
</style>
