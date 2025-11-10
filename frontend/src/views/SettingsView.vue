<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <AppHeader />
    <AppNav />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Objectif calorique -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🎯 Objectif Calorique Quotidien
        </h2>
        <div class="flex gap-4 items-center">
          <input
            v-model.number="calorieGoal"
            type="number"
            min="0"
            step="50"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <span class="text-gray-600 dark:text-gray-400">kcal/jour</span>
          <button
            @click="saveGoal"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            💾 Enregistrer
          </button>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Objectif actuel : <span class="font-bold">{{ settingsStore.dailyCalorieGoal }}</span> kcal
        </p>
      </div>

      <!-- Mode sombre -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🌙 Thème de l'Application
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-300">Mode Sombre</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Protège vos yeux la nuit</p>
          </div>
          <button
            @click="settingsStore.toggleDarkMode()"
            :class="settingsStore.darkMode ? 'bg-green-600' : 'bg-gray-300'"
            class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
          >
            <span
              :class="settingsStore.darkMode ? 'translate-x-7' : 'translate-x-1'"
              class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
            />
          </button>
        </div>
      </div>

      <!-- Données -->
      <div class="bg-red-50 dark:bg-red-900 rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          ⚠️ Gestion des Données
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Attention : Cette action est irréversible !
        </p>
        <button
          @click="clearAllData"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition w-full"
        >
          🗑️ Effacer Toutes les Données
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'

const settingsStore = useSettingsStore()
const calorieGoal = ref(settingsStore.dailyCalorieGoal)

function saveGoal() {
  try {
    settingsStore.updateCalorieGoal(calorieGoal.value)
    alert('✅ Objectif calorique mis à jour !')
  } catch (error) {
    alert('❌ Erreur: ' + error.message)
  }
}

function clearAllData() {
  if (confirm('⚠️ Êtes-vous VRAIMENT sûr de vouloir effacer TOUTES les données ? Cette action est IRRÉVERSIBLE !')) {
    try {
      settingsStore.clearAllData()
      alert('✅ Toutes les données ont été effacées !')
      window.location.reload()
    } catch (error) {
      alert('❌ Erreur: ' + error.message)
    }
  }
}
</script>
