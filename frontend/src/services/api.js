import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// External API Keys (hardcoded for v1.0)
export const CLARIFAI_API_KEY = '5d6ee14430e642408cc08bd89c64dd28'
export const USDA_API_KEY = 'PS2HqdAYDA7GatNE6wqMdfTvbvJOTG3Ars876FrD'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const response = await apiClient.post('/auth/refresh')
        const { token } = response.data.data

        localStorage.setItem('auth_token', token)
        originalRequest.headers.Authorization = `Bearer ${token}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

// ===== External APIs =====

// Open Food Facts API
export async function searchBarcode(barcode) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Clarifai Food Recognition API
export async function analyzePhotoWithClarifai(base64Image) {
  try {
    const response = await axios.post(
      'https://api.clarifai.com/v2/models/food-item-recognition/outputs',
      {
        inputs: [
          {
            data: {
              image: {
                base64: base64Image
              }
            }
          }
        ]
      },
      {
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// USDA FoodData Central API
export async function searchUSDAFood(query) {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
        params: {
          api_key: USDA_API_KEY,
          query: query,
          pageSize: 25
        }
      }
    )
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
