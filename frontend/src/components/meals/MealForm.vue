<template>
  <div class="meal-form bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
      {{ isEditMode ? '✏️ Modifier le repas' : '➕ Ajouter un repas' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nom du repas -->
      <div>
        <label class="label">Nom du repas *</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Ex: Salade César, Poulet grillé..."
          class="input"
          required
        />
      </div>

      <!-- Ajustement Portion (si depuis scanner/API) -->
      <div v-if="showPortionAdjustment" class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <label class="label">📏 Ajuster la portion consommée</label>
        <div class="flex gap-2 items-center mb-2">
          <input
            v-model.number="portionQuantity"
            type="number"
            min="1"
            step="1"
            class="input flex-1"
            @input="recalculateNutrients"
          />
          <select
            v-model="portionUnit"
            class="input w-24"
            @change="recalculateNutrients"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
          </select>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          ℹ️ Valeurs de base pour 100g. Les macros sont recalculées automatiquement.
        </p>
      </div>

      <!-- Calories -->
      <div>
        <label class="label">
          Calories (kcal) *
          <span v-if="showPortionAdjustment" class="text-xs text-gray-500">
            (pour {{ portionQuantity }}{{ portionUnit }})
          </span>
        </label>
        <input
          v-model.number="form.calories"
          type="number"
          min="0"
          step="1"
          placeholder="450"
          class="input"
          :readonly="showPortionAdjustment"
          :class="{ 'bg-gray-100 dark:bg-gray-600': showPortionAdjustment }"
          required
        />
      </div>

      <!-- Macros en ligne -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="label">Protéines (g)</label>
          <input
            v-model.number="form.proteins"
            type="number"
            min="0"
            step="0.1"
            placeholder="25"
            class="input"
            :readonly="showPortionAdjustment"
            :class="{ 'bg-gray-100 dark:bg-gray-600': showPortionAdjustment }"
          />
        </div>
        <div>
          <label class="label">Glucides (g)</label>
          <input
            v-model.number="form.carbs"
            type="number"
            min="0"
            step="0.1"
            placeholder="30"
            class="input"
            :readonly="showPortionAdjustment"
            :class="{ 'bg-gray-100 dark:bg-gray-600': showPortionAdjustment }"
          />
        </div>
        <div>
          <label class="label">Lipides (g)</label>
          <input
            v-model.number="form.fats"
            type="number"
            min="0"
            step="0.1"
            placeholder="20"
            class="input"
            :readonly="showPortionAdjustment"
            :class="{ 'bg-gray-100 dark:bg-gray-600': showPortionAdjustment }"
          />
        </div>
      </div>

      <!-- Date et Heure -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Date</label>
          <input
            v-model="form.date"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="label">Heure</label>
          <input
            v-model="form.time"
            type="time"
            class="input"
          />
        </div>
      </div>

      <!-- Méthode (caché pour ajout manuel) -->
      <input type="hidden" v-model="form.method" />
      <input type="hidden" v-model="form.source" />

      <!-- Messages d'erreur -->
      <div v-if="error" class="alert-error">
        ❌ {{ error }}
      </div>

      <!-- Boutons -->
      <div class="flex space-x-3">
        <button
          type="submit"
          class="btn-primary flex-1"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '⏳ Enregistrement...' : (isEditMode ? '💾 Mettre à jour' : '➕ Ajouter') }}
        </button>

        <button
          v-if="isEditMode || showPortionAdjustment"
          type="button"
          @click="handleCancel"
          class="btn-secondary"
        >
          ❌ Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  meal: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0,
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  method: 'manual',
  source: 'manual'
})

const isSubmitting = ref(false)
const error = ref(null)
const isEditMode = ref(false)

// Gestion de l'ajustement de portion
const baseNutrients = ref(null) // Valeurs pour 100g
const portionQuantity = ref(100)
const portionUnit = ref('g')

// Détermine si on affiche l'ajustement de portion
const showPortionAdjustment = computed(() => {
  return baseNutrients.value !== null && (form.value.method === 'barcode' || form.value.method === 'photo')
})

// Initialiser le formulaire si en mode édition
onMounted(() => {
  if (props.meal) {
    loadMealData()
  }
})

// Watcher pour détecter changement de meal
watch(() => props.meal, (newMeal) => {
  if (newMeal) {
    loadMealData()
  } else {
    resetForm()
  }
})

function loadMealData() {
  if (!props.meal) return

  isEditMode.value = true

  // Copier les données du meal
  form.value = {
    ...form.value,
    ...props.meal
  }

  // Si c'est un produit scanné/photo, sauvegarder les valeurs de base
  if (props.meal.method === 'barcode' || props.meal.method === 'photo') {
    // Sauvegarder les valeurs pour 100g
    baseNutrients.value = {
      calories: props.meal.calories,
      proteins: props.meal.proteins,
      carbs: props.meal.carbs,
      fats: props.meal.fats
    }

    // Initialiser la portion
    portionQuantity.value = props.meal.portion?.quantity || 100
    portionUnit.value = props.meal.portion?.unit || 'g'
  } else {
    baseNutrients.value = null
  }
}

function resetForm() {
  isEditMode.value = false
  baseNutrients.value = null
  portionQuantity.value = 100
  portionUnit.value = 'g'

  form.value = {
    name: '',
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    method: 'manual',
    source: 'manual'
  }
  error.value = null
}

/**
 * Recalcule les valeurs nutritionnelles selon la portion
 */
function recalculateNutrients() {
  if (!baseNutrients.value || !portionQuantity.value) return

  const ratio = portionQuantity.value / 100

  form.value.calories = Math.round(baseNutrients.value.calories * ratio)
  form.value.proteins = parseFloat((baseNutrients.value.proteins * ratio).toFixed(1))
  form.value.carbs = parseFloat((baseNutrients.value.carbs * ratio).toFixed(1))
  form.value.fats = parseFloat((baseNutrients.value.fats * ratio).toFixed(1))
}

async function handleSubmit() {
  try {
    isSubmitting.value = true
    error.value = null

    // Validation basique
    if (!form.value.name.trim()) {
      throw new Error('Le nom du repas est requis')
    }

    if (form.value.calories < 0) {
      throw new Error('Les calories ne peuvent pas être négatives')
    }

    // Ajouter les infos de portion si applicable
    const mealData = { ...form.value }
    if (showPortionAdjustment.value) {
      mealData.portion = {
        quantity: portionQuantity.value,
        unit: portionUnit.value
      }
    }

    // Émettre l'événement
    emit('submit', mealData)

    // Réinitialiser le formulaire si ajout (pas édition)
    if (!isEditMode.value) {
      resetForm()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<style scoped>
.label {
  @apply block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1;
}

.input {
  @apply w-full px-4 py-2 border border-gray-300 dark:border-gray-600
         rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         transition;
}

.input:read-only {
  @apply cursor-not-allowed;
}

.input::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}

.btn-primary {
  @apply bg-green-600 hover:bg-green-700 text-white px-6 py-3
         rounded-lg font-semibold transition disabled:opacity-50
         disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500
         text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition;
}

.alert-error {
  @apply p-3 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700
         rounded-lg text-red-800 dark:text-red-200 text-sm;
}
</style>
