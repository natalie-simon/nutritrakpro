<template>
  <div class="barcode-scanner">
    <!-- Saisie manuelle -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
        Entrez le code-barre manuellement :
      </label>
      <div class="flex gap-2">
        <input
          v-model="manualBarcode"
          type="text"
          placeholder="Ex: 3017620422003"
          class="input flex-1"
          @keypress.enter="searchManual"
          :disabled="isScanning || isLoading"
        />
        <button
          @click="searchManual"
          :disabled="isScanning || isLoading || !manualBarcode"
          class="btn-primary"
        >
          🔍 Rechercher
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Codes acceptés : EAN-13, EAN-8, UPC (8 à 14 chiffres)
      </p>
    </div>

    <!-- Avertissement HTTPS -->
    <div
      v-if="httpsWarning"
      class="alert-warning mb-6"
    >
      ⚠️ <strong>Scanner caméra non disponible</strong> : Le scanner nécessite HTTPS pour fonctionner.
      Utilisez la saisie manuelle ci-dessus.
    </div>

    <!-- Boutons Scanner Caméra -->
    <div class="mb-6" v-if="!httpsWarning">
      <button
        v-if="!isScanning"
        @click="handleStartScan"
        :disabled="isLoading"
        class="btn-camera w-full"
      >
        📸 Démarrer le scanner caméra
      </button>
      <button
        v-else
        @click="handleStopScan"
        class="btn-stop w-full"
      >
        ⏹️ Arrêter le scanner
      </button>
    </div>

    <!-- Zone de scan caméra -->
    <div
      v-show="isScanning"
      id="reader"
      class="scanner-viewport mb-6"
    ></div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin text-4xl mb-4">⏳</div>
      <p class="text-gray-600 dark:text-gray-400">
        Recherche du produit...
      </p>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="alert-error mb-6">
      ❌ {{ error }}
      <button
        @click="reset"
        class="ml-4 underline hover:no-underline"
      >
        Réessayer
      </button>
    </div>

    <!-- Produit trouvé -->
    <div
      v-if="scannedProduct"
      class="product-card fade-in"
    >
      <div class="flex items-start space-x-4">
        <!-- Image du produit -->
        <img
          v-if="scannedProduct.photo"
          :src="scannedProduct.photo"
          :alt="scannedProduct.name"
          class="w-24 h-24 object-cover rounded-lg"
        />
        <div v-else class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
          📦
        </div>

        <!-- Info produit -->
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">
            {{ scannedProduct.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Code-barre: {{ scannedProduct.barcode }}
          </p>

          <!-- Nutriscore si disponible -->
          <div v-if="scannedProduct._raw?.nutriscore" class="mb-2">
            <span class="nutriscore" :class="`nutriscore-${scannedProduct._raw.nutriscore}`">
              Nutri-Score {{ scannedProduct._raw.nutriscore.toUpperCase() }}
            </span>
          </div>

          <!-- Valeurs nutritionnelles -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div class="text-center bg-green-50 dark:bg-green-900 rounded p-2">
              <div class="text-lg font-bold text-green-600 dark:text-green-400">
                {{ scannedProduct.calories }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">kcal</div>
            </div>
            <div class="text-center bg-blue-50 dark:bg-blue-900 rounded p-2">
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ scannedProduct.proteins }}g
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Prot.</div>
            </div>
            <div class="text-center bg-yellow-50 dark:bg-yellow-900 rounded p-2">
              <div class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {{ scannedProduct.carbs }}g
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Gluc.</div>
            </div>
            <div class="text-center bg-red-50 dark:bg-red-900 rounded p-2">
              <div class="text-lg font-bold text-red-600 dark:text-red-400">
                {{ scannedProduct.fats }}g
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Lip.</div>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            Valeurs pour 100g · Source: Open Food Facts
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4 flex gap-2">
        <button
          @click="$emit('add-product', scannedProduct)"
          class="btn-add flex-1"
        >
          ➕ Ajouter ce produit
        </button>
        <button
          @click="reset"
          class="btn-secondary"
        >
          🔄 Scanner un autre produit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBarcode } from '@/composables/useBarcode'

const emit = defineEmits(['add-product'])

const {
  isScanning,
  isLoading,
  error,
  scannedProduct,
  httpsWarning,
  startScanner,
  stopScanner,
  searchByBarcode,
  validateBarcode,
  checkHTTPS,
  reset,
  cleanup
} = useBarcode()

const manualBarcode = ref('')

// Vérifier HTTPS au montage
onMounted(() => {
  checkHTTPS()
})

// Nettoyer au démontage
onUnmounted(() => {
  cleanup()
})

async function handleStartScan() {
  try {
    await startScanner('reader')
  } catch (err) {
    console.error('Erreur démarrage scanner:', err)
  }
}

async function handleStopScan() {
  await stopScanner()
}

async function searchManual() {
  const barcode = manualBarcode.value.trim()

  if (!barcode) {
    return
  }

  // Valider le code-barre
  const validation = validateBarcode(barcode)
  if (!validation.valid) {
    error.value = validation.error
    return
  }

  try {
    await searchByBarcode(validation.cleaned)
    manualBarcode.value = ''
  } catch (err) {
    console.error('Erreur recherche manuelle:', err)
  }
}
</script>

<style scoped>
.input {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
         focus:ring-2 focus:ring-green-500 focus:border-transparent
         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         disabled:opacity-50 disabled:cursor-not-allowed transition;
}

.btn-primary {
  @apply bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg
         font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-camera {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
         font-semibold transition disabled:opacity-50;
}

.btn-stop {
  @apply bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg
         font-semibold transition;
}

.btn-add {
  @apply bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg
         font-semibold transition;
}

.btn-secondary {
  @apply bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500
         text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition;
}

.alert-warning {
  @apply p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700
         rounded-lg text-yellow-800 dark:text-yellow-200 text-sm;
}

.alert-error {
  @apply p-4 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700
         rounded-lg text-red-800 dark:text-red-200 text-sm;
}

.scanner-viewport {
  @apply border-2 border-dashed border-green-500 rounded-lg overflow-hidden;
  max-width: 500px;
  margin: 0 auto;
}

.product-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border-2 border-green-500;
}

.nutriscore {
  @apply inline-block px-3 py-1 rounded-full text-xs font-bold uppercase;
}

.nutriscore-a {
  @apply bg-green-600 text-white;
}

.nutriscore-b {
  @apply bg-lime-500 text-white;
}

.nutriscore-c {
  @apply bg-yellow-500 text-gray-900;
}

.nutriscore-d {
  @apply bg-orange-500 text-white;
}

.nutriscore-e {
  @apply bg-red-600 text-white;
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
</style>
