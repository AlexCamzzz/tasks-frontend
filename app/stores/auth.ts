// stores/auth.ts
import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  // API client
  const apiClient = useApiClient()
  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 1 semana
  // Actions
  async function register(email: string, password: string, name: string) {
    try {
      const { data, error } = await apiClient.post<User>('/auth/register', {
        email,
        password,
        name
      })
      if (error.value) {
        throw createError({
          message: error.value.message || 'Error al registrar usuario',
          statusCode: error.value.statusCode || 500
        })
      }
      return data.value
    } catch (err) {
      throw err
    }
  }
  async function login(email: string, password: string) {
    try {
      const { data, error } = await apiClient.post<{ access_token: string, user: User }>('/auth/login', {
        email,
        password
      })
      if (error.value) {
        throw createError({
          message: error.value.message || 'Credenciales inválidas',
          statusCode: error.value.statusCode || 401
        })
      }
      if (data.value) {
        user.value = data.value.user
        token.value = data.value.access_token
        tokenCookie.value = data.value.access_token
      }
      return data.value
    } catch (err) {
      throw err
    }
  }
  function logout() {
    user.value = null
    token.value = null
    tokenCookie.value = null
  }
  // Init method to restore state from cookies
  function init() {
    if (tokenCookie.value) {
      token.value = tokenCookie.value
    }
  }
  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    init
  }
})
