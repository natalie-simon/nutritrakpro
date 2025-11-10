<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md mt-4 overflow-x-auto transition-colors">
    <div class="container mx-auto px-4">
      <div class="flex justify-start md:justify-center space-x-1 min-w-max">
        <router-link
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="nav-tab"
          :class="{ 'active': isActive(tab.path) }"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/history', label: 'Historique', icon: '📊' },
  { path: '/scanner', label: 'Scanner', icon: '📷' },
  // { path: '/photo', label: 'Photo', icon: '🍽️' }, // Désactivé temporairement (nécessite backend pour CORS)
  { path: '/search', label: 'Recherche', icon: '🔍' },
  { path: '/settings', label: 'Paramètres', icon: '⚙️' }
]

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
.nav-tab {
  @apply px-4 py-3 font-semibold text-gray-500 dark:text-gray-400
         hover:text-green-600 dark:hover:text-green-400
         transition whitespace-nowrap border-b-2 border-transparent;
}

.nav-tab.active {
  @apply text-green-600 dark:text-green-400 border-green-600 dark:border-green-400;
}
</style>
