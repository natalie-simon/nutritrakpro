<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
    <AppHeader />
    <AppNav />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">📷</div>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Scanner de Codes-Barres
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Scannez ou saisissez un code-barre pour trouver les informations nutritionnelles
        </p>
      </div>

      <!-- Scanner -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <BarcodeScanner @add-product="handleAddProduct" />
      </div>

      <!-- Formulaire d'ajout (si produit sélectionné) -->
      <div v-if="selectedProduct" class="mb-6">
        <MealForm
          :meal="selectedProduct"
          @submit="handleMealSubmit"
          @cancel="cancelAdd"
        />
      </div>

      <!-- Info Open Food Facts -->
      <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
        <p class="text-sm text-blue-800 dark:text-blue-200">
          💡 Données fournies par
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noopener"
            class="font-semibold underline hover:no-underline"
          >
            Open Food Facts
          </a>
          - Base de données libre et collaborative
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMealsStore } from '@/stores/meals'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import BarcodeScanner from '@/components/scanner/BarcodeScanner.vue'
import MealForm from '@/components/meals/MealForm.vue'

const router = useRouter()
const mealsStore = useMealsStore()

const selectedProduct = ref(null)

function handleAddProduct(product) {
  // Préparer les données pour le formulaire
  selectedProduct.value = {
    ...product,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  // Scroll vers le formulaire
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, 100)
}

async function handleMealSubmit(mealData) {
  try {
    await mealsStore.addMeal(mealData)
    alert('✅ Repas ajouté avec succès !')

    // Réinitialiser
    selectedProduct.value = null

    // Rediriger vers l'historique
    router.push('/history')
  } catch (error) {
    alert('❌ Erreur: ' + error.message)
  }
}

function cancelAdd() {
  selectedProduct.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
