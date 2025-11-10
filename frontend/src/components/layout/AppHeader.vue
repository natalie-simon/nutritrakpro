<template>
  <header class="bg-white dark:bg-gray-800 shadow-lg transition-colors">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <!-- Logo et Titre -->
        <div class="flex items-center space-x-3">
          <div class="text-4xl">🥗</div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
              ScanAssiette
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Suivi nutritionnel 100% local
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Résumé calories du jour -->
          <div class="hidden md:block text-right">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ todayTotal.calories }} kcal
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ todayTotal.mealCount }} repas
            </div>
          </div>

          <!-- Toggle Dark Mode -->
          <button
            @click="toggleDarkMode"
            class="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Changer le thème"
          >
            <span class="text-2xl">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useMealsStore } from '@/stores/meals'

const settingsStore = useSettingsStore()
const mealsStore = useMealsStore()

const darkMode = computed(() => settingsStore.darkMode)
const todayTotal = computed(() => mealsStore.todayTotal)

function toggleDarkMode() {
  settingsStore.toggleDarkMode()
}
</script>

<style scoped>
/* Animations optionnelles */
.transition {
  transition: all 0.3s ease;
}
</style>
