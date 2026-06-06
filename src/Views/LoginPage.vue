<template>
  <div class="auth-wrapper">
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>
    <main class="auth-main">
      <div class="auth-container">

        <!-- Left Side - Branding -->
        <div class="auth-panel auth-branding">
          <div class="branding-content">
            <div class="branding-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <polygon points="24,10 37,17 37,31 24,38 11,31 11,17" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
              </svg>
            </div>
            <h1 class="branding-title">Welcome Back</h1>
            <p class="branding-desc">Access your organized file systems, collaborate with teams, and manage your projects seamlessly.</p>
            <div class="branding-features">
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M7 9H17M7 13H17M9 17H15M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Visual File Linking</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7M3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7M3 7H21M8 11L12 15M12 15L16 11M12 15V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Smart Organization</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9M9 3L3 9M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>AI-Powered Features</span>
              </div>
            </div>
            <div class="hex-decoration hex-left">
              <svg viewBox="0 0 80 80" fill="none"><polygon points="40,4 74,22 74,58 40,76 6,58 6,22" stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/></svg>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="auth-panel auth-form-panel">
          <div class="form-wrapper">
            <div class="form-header">
              <h2 class="form-title">Login</h2>
              <p class="form-subtitle">Access your Project X account</p>
            </div>

            <!-- API error banner -->
            <div v-if="apiError" class="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              {{ apiError }}
            </div>

            <!-- Success banner -->
            <div v-if="successMessage" class="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              {{ successMessage }}
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">

              <!-- Username Field -->
              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <input
                    id="username"
                    v-model="formData.username"
                    type="text"
                    placeholder="your_username"
                    class="form-input"
                    :class="{ 'input-error': errors.username }"
                    autocomplete="username"
                    required
                  />
                </div>
                <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="form-input"
                    :class="{ 'input-error': errors.password }"
                    autocomplete="current-password"
                    required
                  />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                    <svg v-if="showPassword" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.rememberMe" class="checkbox-input" />
                  <span>Remember me</span>
                </label>
                <router-link to="/forgot-password" class="link-secondary">Forgot password?</router-link>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn-submit" :disabled="isLoading">
                <span v-if="!isLoading">Login to Project X</span>
                <span v-else class="loading-spinner">
                  <svg viewBox="0 0 24 24" fill="none" class="spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
                  Signing in...
                </span>
              </button>

              <!-- Sign Up Link -->
              <p class="form-footer">
                New to Project X? <router-link to="/signup" class="link-primary">Create an account</router-link>
              </p>

            </form>
          </div>
          <div class="form-terms">
            By logging in, you agree to our <a href="#" class="link-secondary">Terms of Service</a> and <a href="#" class="link-secondary">Privacy Policy</a>.
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import '@/assets/AuthPages.css'
import { authService } from '@/services/auth.js'

export default {
  name: 'LoginPage',

  data() {
    return {
      formData: {
        username: '',
        password: '',
        rememberMe: false,
      },
      errors: {},
      apiError: '',
      successMessage: '',
      isLoading: false,
      showPassword: false,
    }
  },

  mounted() {
    // Redirect if already logged in
    if (authService.isLoggedIn()) {
      this.$router.push('/createfile')
    }
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    this.animateHex()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
    cancelAnimationFrame(this._hexRaf)
  },

  methods: {
    validate() {
      this.errors = {}
      if (!this.formData.username.trim()) {
        this.errors.username = 'Username is required'
      }
      if (!this.formData.password) {
        this.errors.password = 'Password is required'
      }
      return Object.keys(this.errors).length === 0
    },

    async handleLogin() {
      this.apiError = ''
      this.successMessage = ''

      if (!this.validate()) return

      this.isLoading = true

      try {
        await authService.login(
          this.formData.username,
          this.formData.password,
          this.formData.rememberMe
        )
        this.successMessage = 'Login successful! Redirecting...'
        setTimeout(() => this.$router.push('/createfile'), 800)

      } catch (err) {
        if (err.status === 401) {
          this.apiError = 'Invalid username or password. Please try again.'
        } else if (err.status === 422 && err.data?.errors) {
          // Map backend validation errors to fields
          const backendErrors = err.data.errors
          if (backendErrors.username) this.errors.username = backendErrors.username[0]
          if (backendErrors.password) this.errors.password = backendErrors.password[0]
        } else if (err.status === 0 || err instanceof TypeError) {
          this.apiError = 'Cannot reach the server. Make sure the backend is running on http://localhost:8000'
        } else {
          this.apiError = err.data?.error || 'Something went wrong. Please try again.'
        }
      } finally {
        this.isLoading = false
      }
    },

    drawHexGrid() {
      const canvas = this.$refs.hexCanvas
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    },

    animateHex() {
      const canvas = this.$refs.hexCanvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      let tick = 0
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const size = 36, w = size * 2, h = Math.sqrt(3) * size
        const cols = Math.ceil(canvas.width / w) + 2
        const rows = Math.ceil(canvas.height / h) + 2
        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x = col * w * 0.75
            const y = row * h + (col % 2 === 0 ? 0 : h / 2)
            const dist = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2))
            const maxDist = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
            const pulse = Math.sin(tick * 0.015 + dist * 0.008) * 0.5 + 0.5
            const alpha = (1 - dist / maxDist) * 0.18 * pulse + 0.04
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i - Math.PI / 6
              const px = x + size * 0.88 * Math.cos(angle)
              const py = y + size * 0.88 * Math.sin(angle)
              i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
            }
            ctx.closePath()
            ctx.strokeStyle = `rgba(192, 57, 43, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        tick++
        this._hexRaf = requestAnimationFrame(draw)
      }
      draw()
    },
  },
}
</script>

<style scoped>
.input-icon { width: 20px; height: 20px; color: var(--text-secondary); }
.feature-icon { width: 24px; height: 24px; }
.toggle-password svg { width: 18px; height: 18px; }
.branding-icon svg { width: 52px; height: 52px; color: var(--volcanic); filter: drop-shadow(0 0 10px rgba(192, 57, 43, 0.5)); }
.hex-decoration svg { width: 100%; height: 100%; color: var(--volcanic); }
.loading-spinner { display: flex; align-items: center; gap: 8px; }
.loading-spinner svg { width: 20px; height: 20px; }
.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.input-error { border-color: var(--volcanic) !important; }

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 1rem;
}
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }
.alert-success { background: rgba(39,174,96,0.1); border: 1px solid rgba(39,174,96,0.3); color: #27ae60; }
</style>
