<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const isDarkMode = computed(() => settingsStore.darkMode)

// Charger les settings au démarrage
onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style>
/* Global styles will be imported from style.css */
</style>
