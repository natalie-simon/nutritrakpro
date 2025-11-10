<template>
  <div class="photo-upload">
    <!-- Zone de drop -->
    <div
      v-if="!photoPreview"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="['drop-zone', { 'dragging': isDragging }]"
    >
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="drop-zone-content">
        <div class="text-6xl mb-4">📸</div>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          Glissez-déposez une photo ici
        </p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mb-4">ou</p>
        <button
          type="button"
          @click="$refs.fileInput.click()"
          class="btn-upload"
        >
          📂 Sélectionner un fichier
        </button>
        <p class="text-xs text-gray-400 dark:text-gray-600 mt-4">
          Formats acceptés : JPG, PNG, WEBP (max 10MB)
        </p>
      </div>
    </div>

    <!-- Preview de la photo -->
    <div v-else class="photo-preview fade-in">
      <div class="relative">
        <img
          :src="photoPreview"
          alt="Photo à analyser"
          class="preview-image"
        />
        <button
          @click="removePhoto"
          class="btn-remove"
          title="Supprimer la photo"
        >
          ✕
        </button>
      </div>

      <!-- Bouton Analyser -->
      <button
        v-if="!isAnalyzing && !hasResults"
        @click="$emit('analyze')"
        class="btn-analyze w-full mt-4"
      >
        🔍 Analyser cette photo
      </button>

      <!-- État d'analyse -->
      <div v-if="isAnalyzing" class="analyzing-state">
        <div class="inline-block animate-spin text-4xl mb-3">⏳</div>
        <p class="text-gray-700 dark:text-gray-300 font-semibold">
          Analyse en cours avec Clarifai...
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Détection des aliments dans l'image
        </p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="alert-error mt-4">
      ❌ {{ error }}
      <button
        @click="removePhoto"
        class="ml-4 underline hover:no-underline"
      >
        Réessayer
      </button>
    </div>

    <!-- Limite Clarifai atteinte -->
    <div v-if="clarifaiLimitReached" class="alert-warning mt-4">
      ⚠️ <strong>Limite mensuelle atteinte</strong> : Vous avez utilisé vos 1000 requêtes Clarifai ce mois-ci.
      <br>
      Utilisez la <router-link to="/search" class="underline hover:no-underline font-semibold">recherche manuelle</router-link> à la place.
    </div>

    <!-- Compteur Clarifai -->
    <div class="clarifai-counter">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Utilisation Clarifai ce mois :
        <span class="font-semibold" :class="usageClass">
          {{ clarifaiUsage }}/1000
        </span>
        ({{ clarifaiRemaining }} restantes)
      </p>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
        <div
          class="h-1 rounded-full transition-all"
          :class="usageBarClass"
          :style="{ width: clarifaiUsagePercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  photoPreview: {
    type: String,
    default: null
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  hasResults: {
    type: Boolean,
    default: false
  },
  clarifaiLimitReached: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['upload', 'analyze', 'remove'])

const settingsStore = useSettingsStore()
const fileInput = ref(null)
const isDragging = ref(false)

// Compteur Clarifai
const clarifaiUsage = computed(() => settingsStore.clarifaiUsage)
const clarifaiRemaining = computed(() => settingsStore.clarifaiRemaining)
const clarifaiUsagePercentage = computed(() => settingsStore.clarifaiUsagePercentage)

const usageClass = computed(() => {
  const percentage = clarifaiUsagePercentage.value
  if (percentage >= 90) return 'text-red-600 dark:text-red-400'
  if (percentage >= 70) return 'text-orange-600 dark:text-orange-400'
  return 'text-green-600 dark:text-green-400'
})

const usageBarClass = computed(() => {
  const percentage = clarifaiUsagePercentage.value
  if (percentage >= 90) return 'bg-red-600'
  if (percentage >= 70) return 'bg-orange-600'
  return 'bg-green-600'
})

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    emit('upload', file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    emit('upload', file)
  }
}

function removePhoto() {
  emit('remove')
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.drop-zone {
  @apply border-2 border-dashed border-gray-300 dark:border-gray-600
         rounded-lg p-12 text-center
         hover:border-green-500 dark:hover:border-green-400
         transition cursor-pointer
         bg-white dark:bg-gray-800;
}

.drop-zone.dragging {
  @apply border-green-500 dark:border-green-400
         bg-green-50 dark:bg-green-900/20;
}

.drop-zone-content {
  @apply pointer-events-none;
}

.btn-upload {
  @apply pointer-events-auto
         bg-green-600 hover:bg-green-700 text-white
         px-6 py-3 rounded-lg font-semibold transition;
}

.photo-preview {
  @apply bg-white dark:bg-gray-800 rounded-lg p-4;
}

.preview-image {
  @apply rounded-lg shadow-lg max-w-full h-auto mx-auto max-h-96 object-contain;
}

.btn-remove {
  @apply absolute top-2 right-2 bg-red-600 hover:bg-red-700
         text-white w-8 h-8 rounded-full
         flex items-center justify-center
         font-bold transition shadow-lg;
}

.btn-analyze {
  @apply bg-blue-600 hover:bg-blue-700 text-white
         px-6 py-3 rounded-lg font-semibold transition;
}

.analyzing-state {
  @apply text-center py-8;
}

.alert-error {
  @apply p-4 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700
         rounded-lg text-red-800 dark:text-red-200 text-sm;
}

.alert-warning {
  @apply p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700
         rounded-lg text-yellow-800 dark:text-yellow-200 text-sm;
}

.clarifai-counter {
  @apply mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg;
}

.fade-in {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.hidden {
  display: none;
}
</style>
