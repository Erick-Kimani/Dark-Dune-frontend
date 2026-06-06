const BASE_URL = 'http://localhost:8000/api'

// Store token in localStorage
const setToken = (token) => localStorage.setItem('dd_token', token)
const getToken = () => localStorage.getItem('dd_token')
const removeToken = () => localStorage.removeItem('dd_token')

// Shared fetch helper
const request = async (endpoint, method = 'GET', body = null) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await response.json()

  if (!response.ok) {
    throw { status: response.status, data }
  }

  return data
}

export const authService = {

  async login(username, password, rememberMe = false) {
    const data = await request('/auth/login', 'POST', {
      username,
      password,
      remember_me: rememberMe,
    })
    setToken(data.token)
    return data
  },

  async register(name, email, username, password, passwordConfirmation) {
    const data = await request('/auth/register', 'POST', {
      name,
      email,
      username,
      password,
      password_confirmation: passwordConfirmation,
    })
    return data
  },

  async logout() {
    try {
      await request('/auth/logout', 'POST')
    } finally {
      removeToken()
    }
  },

  async getUser() {
    return await request('/auth/user', 'GET')
  },

  async forgotPassword(email) {
    return await request('/auth/forgot-password', 'POST', { email })
  },

  async resetPassword(email, code, password, passwordConfirmation) {
    return await request('/auth/reset-password', 'POST', {
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    })
  },

  async verifyEmail(email, code) {
    return await request('/auth/verify-email', 'POST', { email, code })
  },

  isLoggedIn() {
    return !!getToken()
  },

  getToken,
  removeToken,
}
