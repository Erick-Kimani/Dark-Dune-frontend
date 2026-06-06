<template>
  <div class="auth-wrapper">

    <!-- Hex canvas overlay -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <!-- Main Content -->
    <main class="auth-main">
      <div class="auth-container">

        <!-- Left Side - Branding -->
        <div class="auth-panel auth-branding">
          <div class="branding-content">

            <!-- Logo mark (SVG hex, no emoji) -->
            <div class="branding-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,2 44,13 44,35 24,46 4,35 4,13"
                  stroke="currentColor" stroke-width="1.5" fill="none"/>
                <polygon points="24,10 37,17 37,31 24,38 11,31 11,17"
                  stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
              </svg>
            </div>

            <h1 class="branding-title">Welcome Back</h1>
            <p class="branding-desc">
              Access your organized file systems, collaborate with teams, and manage your projects seamlessly.
            </p>

            <div class="branding-features">
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 9H17M7 13H17M9 17H15M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Visual File Linking</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7M3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7M3 7H21M8 11L12 15M12 15L16 11M12 15V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Smart Organization</span>
              </div>
              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9M9 3L3 9M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>AI-Powered Features</span>
              </div>
            </div>

            <!-- SVG hex decoration replacing ⬡ emoji -->
            <div class="hex-decoration hex-left">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="40,4 74,22 74,58 40,76 6,58 6,22"
                  stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/>
              </svg>
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

            <form @submit.prevent="handleLogin" class="auth-form">

              <!-- Username Field -->
              <div class="form-group">
                <label for="username" class="form-label">Username or Email</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <input
                    id="username"
                    v-model="formData.username"
                    type="text"
                    placeholder="your_username"
                    class="form-input"
                    @focus="activeField = 'username'"
                    @blur="activeField = ''"
                    required
                  />
                </div>
                <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  </svg>
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="form-input"
                    @focus="activeField = 'password'"
                    @blur="activeField = ''"
                    required
                  />
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <!-- Eye open -->
                    <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <!-- Eye closed -->
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/>
                  </svg>
                </span>
              </button>

              <!-- Divider -->
              <div class="form-divider">
                <span>or continue with</span>
              </div>

              <!-- Social Login -->
              <div class="social-login">
                <button type="button" class="social-btn" @click="loginWithGoogle">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" class="social-btn" @click="loginWithGithub">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <!-- Sign Up Link -->
              <p class="form-footer">
                New to Project X? <router-link to="/signup" class="link-primary">Create an account</router-link>
              </p>

            </form>
          </div>

          <!-- Terms -->
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

export default {
  name: 'LoginPage',

  data() {
    return {
      formData: {
        username: '',
        password: '',
        rememberMe: false
      },
      errors: {},
      isLoading: false,
      showPassword: false,
      activeField: ''
    }
  },

  methods: {
    handleLogin() {
      this.errors = {}

      if (!this.formData.username) {
        this.errors.username = 'Username or email is required'
      }
      if (!this.formData.password) {
        this.errors.password = 'Password is required'
      }

      if (Object.keys(this.errors).length > 0) return

      this.isLoading = true

      setTimeout(() => {
        console.log('Login attempt:', {
          username: this.formData.username,
          rememberMe: this.formData.rememberMe
        })
        this.$router.push('/dashboard')
        this.isLoading = false
      }, 1500)
    },

    loginWithGoogle() {
      console.log('Login with Google')
    },

    loginWithGithub() {
      console.log('Login with GitHub')
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
        const size = 36
        const w = size * 2
        const h = Math.sqrt(3) * size
        const cols = Math.ceil(canvas.width / w) + 2
        const rows = Math.ceil(canvas.height / h) + 2

        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x = col * w * 0.75
            const y = row * h + (col % 2 === 0 ? 0 : h / 2)
            const dist = Math.sqrt(
              Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2)
            )
            const maxDist = Math.sqrt(
              Math.pow(canvas.width / 2, 2) +
              Math.pow(canvas.height / 2, 2)
            )
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
    }
  },

  mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    this.animateHex()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
    cancelAnimationFrame(this._hexRaf)
  }
}
</script>

<style scoped>
.input-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.feature-icon {
  width: 24px;
  height: 24px;
}

.social-btn svg {
  width: 16px;
  height: 16px;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.branding-icon svg {
  width: 52px;
  height: 52px;
  color: var(--volcanic);
  filter: drop-shadow(0 0 10px rgba(192, 57, 43, 0.5));
}

.hex-decoration svg {
  width: 100%;
  height: 100%;
  color: var(--volcanic);
}

.loading-spinner svg {
  width: 20px;
  height: 20px;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>