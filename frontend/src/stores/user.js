import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // State
  const profile = ref(null)

  // Actions
  async function fetchProfile() {
    try {
      const response = await axios.get('/api/profile')
      profile.value = response.data.data.profile
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      }
    }
  }

  async function updateProfile(profileData) {
    try {
      const response = await axios.put('/api/profile', profileData)
      profile.value = response.data.data.profile
      return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      }
    }
  }

  function clearProfile() {
    profile.value = null
  }

  return {
    profile,
    fetchProfile,
    updateProfile,
    clearProfile
  }
})
