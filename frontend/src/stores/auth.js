import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: authToken, user: userData } = response.data.data

      token.value = authToken
      user.value = userData
      localStorage.setItem('auth_token', authToken)

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  async function register(email, password, passwordConfirmation, name) {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        password_confirmation: passwordConfirmation,
        name
      })

      const { token: authToken, user: userData } = response.data.data

      token.value = authToken
      user.value = userData
      localStorage.setItem('auth_token', authToken)

      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  async function logout() {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  async function refreshToken() {
    try {
      const response = await axios.post('/api/auth/refresh')
      const { token: newToken } = response.data.data

      token.value = newToken
      localStorage.setItem('auth_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      return { success: true }
    } catch (error) {
      // If refresh fails, logout user
      await logout()
      return { success: false }
    }
  }

  function initializeAuth() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    initializeAuth
  }
})
