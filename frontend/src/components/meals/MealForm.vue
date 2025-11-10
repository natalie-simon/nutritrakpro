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

      <!-- Calories -->
      <div>
        <label class="label">Calories (kcal) *</label>
        <input
          v-model.number="form.calories"
          type="number"
          min="0"
          step="1"
          placeholder="450"
          class="input"
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
          v-if="isEditMode"
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
import { ref, watch, onMounted } from 'vue'

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
  isEditMode.value = true
  form.value = {
    ...form.value,
    ...props.meal
  }
}

function resetForm() {
  isEditMode.value = false
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

    // Émettre l'événement
    emit('submit', { ...form.value })

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
