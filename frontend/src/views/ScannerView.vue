<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <AppHeader />
    <AppNav />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 text-center">
        <div class="text-8xl mb-6">📷</div>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Scanner de Codes-Barres
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Cette fonctionnalité sera bientôt disponible !
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          En attendant, utilisez l'ajout manuel dans l'onglet Historique.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
</script>
