const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export const API_ENDPOINTS = {
  auth: {
    register: '/account/',
    login: '/account/api/token/',
    logout: '/account/api/token/blacklist/',
    forgotPassword: '/account/api/password-forget/',
    verifyOtp: '/account/api/verify-otp/',
    resetPassword: '/account/api/password-reset/',
  },
  profile: {
    root: '/profile/',
  },
}

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`

export const resolveMediaUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})
