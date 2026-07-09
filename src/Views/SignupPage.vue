<template>
  <div class="auth-wrapper">
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>
    <main class="auth-main">
      <div class="auth-container">

        <!-- Left Side - Branding -->
        <div class="auth-panel auth-branding">
          <div class="branding-content">
            <div class="branding-icon">
              <svg viewBox="0 0 48 48" fill="none"><polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="24,10 37,17 37,31 24,38 11,31 11,17" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/></svg>
            </div>
            <h1 class="branding-title">Join Dark Dune</h1>
            <p class="branding-desc">Start organizing your files smarter, collaborate with teams, and unlock powerful features.</p>
            <div class="branding-features">
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M5 12H3L12 3L21 12H19M5 12V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Local-First Storage</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Start Free Today</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Scale Unlimited</span>
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
              <h2 class="form-title">Create Account</h2>
              <p class="form-subtitle">Join thousands organizing files smarter</p>
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

            <form @submit.prevent="handleSignUp" class="auth-form">

              <!-- Full Name -->
              <div class="form-group">
                <label for="fullname" class="form-label">Full Name</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <input id="fullname" v-model="formData.fullName" type="text" placeholder="John Doe" class="form-input" :class="{ 'input-error': errors.fullName }" autocomplete="name" required />
                </div>
                <span v-if="errors.fullName" class="form-error">{{ errors.fullName }}</span>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                  <input id="email" v-model="formData.email" type="email" placeholder="you@example.com" class="form-input" :class="{ 'input-error': errors.email }" autocomplete="email" required />
                </div>
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>

              <!-- Username -->
              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <input id="username" v-model="formData.username" type="text" placeholder="your_username" class="form-input" :class="{ 'input-error': errors.username }" autocomplete="username" required />
                </div>
                <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
                <span v-else class="form-hint">3–20 characters, letters, numbers, underscores or hyphens</span>
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                  <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="form-input" :class="{ 'input-error': errors.password }" autocomplete="new-password" required />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                    <svg v-if="showPassword" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
                <div class="password-strength" v-if="formData.password">
                  <div class="strength-track"><div class="strength-bar" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div></div>
                  <span class="strength-label" :class="passwordStrength.class">{{ passwordStrength.text }}</span>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 16.5L11.5 18L14.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <input id="confirmPassword" v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••" class="form-input" :class="{ 'input-error': errors.confirmPassword }" autocomplete="new-password" required />
                  <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
                <span v-else-if="formData.confirmPassword && formData.password === formData.confirmPassword" class="form-hint success">Passwords match</span>
              </div>

              <!-- Terms -->
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.acceptTerms" class="checkbox-input" />
                  <span>I agree to the <a href="#" class="link-secondary">Terms of Service</a> and <a href="#" class="link-secondary">Privacy Policy</a></span>
                </label>
              </div>
              <span v-if="errors.acceptTerms" class="form-error">{{ errors.acceptTerms }}</span>

              <!-- Submit Button -->
              <button type="submit" class="btn-submit" :disabled="isLoading">
                <span v-if="!isLoading">Create Account</span>
                <span v-else class="loading-spinner">
                  <svg viewBox="0 0 24 24" fill="none" class="spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
                  Creating account...
                </span>
              </button>

              <!-- Login Link -->
              <p class="form-footer">
                Already have an account? <router-link to="/login" class="link-primary">Log In</router-link>
              </p>

            </form>
          </div>
          <div class="form-terms">
            By signing up, you agree to our <a href="#" class="link-secondary">Terms of Service</a> and <a href="#" class="link-secondary">Privacy Policy</a>.
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
  name: 'SignUpPage',

  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      },
      errors: {},
      apiError: '',
      successMessage: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
    }
  },

  computed: {
    passwordStrength() {
      const pwd = this.formData.password
      if (!pwd) return { text: '', class: '', width: '0%' }
      let score = 0
      if (pwd.length >= 8) score++
      if (pwd.length >= 12) score++
      if (/[A-Z]/.test(pwd)) score++
      if (/[a-z]/.test(pwd)) score++
      if (/[0-9]/.test(pwd)) score++
      if (/[^A-Za-z0-9]/.test(pwd)) score++
      if (score < 3) return { text: 'Weak',   class: 'weak',   width: '33%'  }
      if (score < 5) return { text: 'Good',   class: 'good',   width: '66%'  }
      return              { text: 'Strong', class: 'strong', width: '100%' }
    },
  },

  mounted() {
    if (authService.isLoggedIn()) {
      this.$router.push('/startbuilding')
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
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    validate() {
      this.errors = {}
      if (!this.formData.fullName.trim())
        this.errors.fullName = 'Full name is required'
      if (!this.formData.email.trim())
        this.errors.email = 'Email is required'
      else if (!this.isValidEmail(this.formData.email))
        this.errors.email = 'Invalid email address'
      if (!this.formData.username.trim())
        this.errors.username = 'Username is required'
      else if (this.formData.username.length < 3)
        this.errors.username = 'Username must be at least 3 characters'
      else if (!/^[a-zA-Z0-9_-]+$/.test(this.formData.username))
        this.errors.username = 'Only letters, numbers, underscores, and hyphens allowed'
      if (!this.formData.password)
        this.errors.password = 'Password is required'
      else if (this.formData.password.length < 8)
        this.errors.password = 'Password must be at least 8 characters'
      if (this.formData.password !== this.formData.confirmPassword)
        this.errors.confirmPassword = 'Passwords do not match'
      if (!this.formData.acceptTerms)
        this.errors.acceptTerms = 'You must accept the terms to continue'
      return Object.keys(this.errors).length === 0
    },

    async handleSignUp() {
      this.apiError = ''
      this.successMessage = ''

      if (!this.validate()) return

      this.isLoading = true

      try {
        await authService.register(
          this.formData.fullName,
          this.formData.email,
          this.formData.username,
          this.formData.password,
          this.formData.confirmPassword
        )

        this.successMessage = 'Account created! Please check your email to verify your account.'
        // Clear form
        this.formData = { fullName: '', email: '', username: '', password: '', confirmPassword: '', acceptTerms: false }
        setTimeout(() => this.$router.push('/login'), 3000)

      } catch (err) {
        if (err.status === 422 && err.data?.errors) {
          // Map backend validation errors to fields
          const backendErrors = err.data.errors
          if (backendErrors.name)     this.errors.fullName = backendErrors.name[0]
          if (backendErrors.email)    this.errors.email    = backendErrors.email[0]
          if (backendErrors.username) this.errors.username = backendErrors.username[0]
          if (backendErrors.password) this.errors.password = backendErrors.password[0]
        } else if (err.status === 0 || err instanceof TypeError) {
          this.apiError = 'Cannot reach the server. Make sure the backend is running on http://localhost:8000'
        } else {
          this.apiError = err.data?.error || 'Registration failed. Please try again.'
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
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-radius: 8px;
  font-size: 13px; margin-bottom: 1rem;
}
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error  { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }
.alert-success { background: rgba(39,174,96,0.1); border: 1px solid rgba(39,174,96,0.3); color: #27ae60; }

.form-hint.success { color: #27ae60; }

.password-strength { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.strength-track { flex: 1; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.strength-bar { height: 100%; border-radius: 2px; transition: width 0.3s ease, background-color 0.3s ease; }
.strength-bar.weak   { background: #e74c3c; }
.strength-bar.good   { background: #f39c12; }
.strength-bar.strong { background: #27ae60; }
.strength-label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; min-width: 40px; }
.strength-label.weak   { color: #e74c3c; }
.strength-label.good   { color: #f39c12; }
.strength-label.strong { color: #27ae60; }
</style>
