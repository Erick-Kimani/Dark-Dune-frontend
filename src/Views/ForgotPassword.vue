<template>
  <div class="auth-wrapper">

    <!-- Navigation -->
    

    <!-- Main Content -->
    <main class="auth-main">
      <div class="auth-container">

        <!-- Branding Panel -->
        <div class="auth-panel auth-branding">
          <div class="branding-content">

            <!-- SVG Icon replacing  -->
            <div class="branding-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="22" width="28" height="20" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M16 22V15C16 10.582 19.582 7 24 7C28.418 7 32 10.582 32 15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="24" cy="32" r="3" stroke="currentColor" stroke-width="1.5"/>
                <path d="M24 35V39" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>

            <h1 class="branding-title">
              Recover Your Account
            </h1>

            <p class="branding-desc">
              Securely reset your password using a verification code sent to
              your registered email address.
            </p>

            <div class="branding-features">

              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 7L12 13L22 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>Email Verification</span>
              </div>

              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L4 7V13C4 17.418 7.582 21 12 21C16.418 21 20 17.418 20 13V7L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Secure Recovery Process</span>
              </div>

              <div class="feature">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Reset Codes Expire After 30 Minutes</span>
              </div>

            </div>

          </div>

          <div class="hex-decoration hex-left">
            <svg viewBox="0 0 80 80" fill="none">
              <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/>
            </svg>
          </div>
        </div>

        <!-- Form Panel -->
        <div class="auth-panel auth-form-panel">

          <div class="form-wrapper">

            <div class="form-header">
              <h2 class="form-title">Forgot Password</h2>
              <p class="form-subtitle">Recover access to your account</p>
            </div>

            <!-- Progress -->
            <div class="form-progress">
              <div class="progress-steps">
                <div class="step" :class="{ active: step === 1, completed: step > 1 }">1</div>
                <div class="step" :class="{ active: step === 2 }">2</div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ errorMessage }}
            </div>

            <form class="auth-form" @submit.prevent>

              <!-- STEP 1 -->
              <div v-if="step === 1" class="form-step">

                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M2 7L12 13L22 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <input
                      v-model="email"
                      type="email"
                      class="form-input"
                      placeholder="Enter your registered email"
                      autocomplete="email"
                      required
                    />
                  </div>
                </div>

                <button class="btn-submit" :disabled="loading" @click="sendResetCode">
                  <span v-if="loading" class="loading-spinner">
                    <svg viewBox="0 0 24 24" fill="none" class="spin">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/>
                    </svg>
                    Sending...
                  </span>
                  <span v-else>Send Reset Code <span class="btn-arrow">→</span></span>
                </button>

              </div>

              <!-- STEP 2 -->
              <div v-if="step === 2" class="form-step">

                <div class="form-group">
                  <label class="form-label">Verification Code</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                      <circle cx="8" cy="15" r="4" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M11.5 11.5L20 3M18 5L20 7M16 7L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input
                      v-model="code"
                      type="text"
                      maxlength="6"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      class="form-input"
                      placeholder="Enter 6-character reset code"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input"
                      placeholder="Enter new password"
                      autocomplete="new-password"
                    />
                    <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                      <svg v-if="showPassword" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm Password</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                    <input
                      v-model="password_confirmation"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input"
                      placeholder="Confirm new password"
                      autocomplete="new-password"
                    />
                  </div>
                </div>

                <button class="btn-submit" :disabled="loading" @click="resetPassword">
                  <span v-if="loading" class="loading-spinner">
                    <svg viewBox="0 0 24 24" fill="none" class="spin">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/>
                    </svg>
                    Resetting...
                  </span>
                  <span v-else>Reset Password <span class="btn-arrow">→</span></span>
                </button>

              </div>

            </form>

            <div class="form-divider">
              <span>OR</span>
            </div>

            <div class="form-footer">
              <router-link to="/login" class="link-secondary">
                Return to Login
              </router-link>
            </div>

          </div>

        </div>

      </div>
    </main>

    

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

import '@/assets/AuthPages.css'

const router = useRouter()

const step = ref(1)

const email = ref('')
const code = ref('')
const password = ref('')
const password_confirmation = ref('')

const loading = ref(false)
const showPassword = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

const currentYear = computed(() => new Date().getFullYear())

const sendResetCode = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const response = await api.post('/auth/forgot-password', {
      email: email.value
    })

    successMessage.value =
      response.data.message ||
      'Password reset code sent successfully.'

    step.value = 2
  } catch (error) {
    if (error.response?.data?.errors) {
      errorMessage.value = Object.values(
        error.response.data.errors
      ).flat()[0]
    } else {
      errorMessage.value =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to send reset code.'
    }
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const response = await api.post('/auth/reset-password', {
      email: email.value,
      code: code.value.trim(),
      password: password.value,
      password_confirmation: password_confirmation.value
    })

    successMessage.value =
      response.data.message ||
      'Password reset successfully.'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    if (error.response?.data?.errors) {
      errorMessage.value = Object.values(
        error.response.data.errors
      ).flat()[0]
    } else {
      errorMessage.value =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Password reset failed.'
    }
  } finally {
    loading.value = false
  }
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