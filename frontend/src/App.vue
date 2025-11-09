<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isDarkMode = computed(() => userStore.profile?.dark_mode || false)
</script>

<style>
/* Global styles will be imported from style.css */
</style>
