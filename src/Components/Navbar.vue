<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled, 'navbar--menu-open': menuOpen }">
    <!-- Scanline shimmer -->
    <div class="navbar__scanline" aria-hidden="true"></div>

    <div class="navbar__inner">

      <!-- ── Logo ── -->
      <a href="/" class="navbar__logo" aria-label="DarkDune home">
        <span class="navbar__logo-hex" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="11,1 21,6 21,16 11,21 1,16 1,6"
              stroke="currentColor" stroke-width="1.4" fill="none" class="hex-outline"/>
            <polygon points="11,5 17,8.5 17,13.5 11,17 5,13.5 5,8.5"
              fill="currentColor" opacity="0.25"/>
          </svg>
        </span>
        <span class="navbar__logo-text">
          DARK<span class="navbar__logo-accent">DUNE</span>
        </span>
      </a>

      <!-- ── Desktop Links ── -->
      <nav class="navbar__links" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="navbar__link"
          :class="{ 'navbar__link--active': activeLink === link.label }"
          @click="setActive(link.label)"
        >
          <span class="navbar__link-text">{{ link.label }}</span>
          <span class="navbar__link-bar" aria-hidden="true"></span>
        </a>
      </nav>

      <!-- ── Desktop Right ── -->
      <div class="navbar__right">
        <button class="navbar__icon-btn" aria-label="Search" @click="toggleSearch">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.4"/>
            <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Logged out: GET STARTED -->
        <a v-if="!isLoggedIn" href="/login" class="navbar__cta">
          <span>GET STARTED</span>
          <span class="navbar__cta-arrow" aria-hidden="true">→</span>
        </a>

        <!-- Logged in: LOG OUT -->
        <button v-else class="navbar__cta navbar__cta--logout" :disabled="loggingOut" @click="handleLogout">
          <span>{{ loggingOut ? 'LOGGING OUT...' : 'LOG OUT' }}</span>
          <span class="navbar__cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <!-- ── Hamburger ── -->
      <button
        class="navbar__burger"
        aria-label="Toggle menu"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <span class="navbar__burger-line"></span>
        <span class="navbar__burger-line"></span>
        <span class="navbar__burger-line"></span>
      </button>
    </div>

    <!-- ── Search Bar (slide-down) ── -->
    <transition name="search-slide">
      <div v-if="searchOpen" class="navbar__search-bar" role="search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-icon" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.4"/>
          <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input
          ref="searchInput"
          type="search"
          placeholder="Search DarkDune…"
          class="navbar__search-input"
          aria-label="Search"
          @keydown.esc="toggleSearch"
        />
        <button class="navbar__search-close" @click="toggleSearch" aria-label="Close search">✕</button>
      </div>
    </transition>

    <!-- ── Mobile Drawer ── -->
    <transition name="drawer-slide">
      <nav v-if="menuOpen" class="navbar__drawer" aria-label="Mobile navigation">
        <div class="navbar__drawer-hex" aria-hidden="true">⬡</div>
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="navbar__drawer-link"
          @click="menuOpen = false"
        >
          <span class="drawer-num">0{{ navLinks.indexOf(link) + 1 }}</span>
          {{ link.label }}
        </a>

        <!-- Logged out: GET STARTED -->
        <a v-if="!isLoggedIn" href="/login" class="btn-primary navbar__drawer-cta">
          GET STARTED
          <span class="btn-arrow">→</span>
        </a>

        <!-- Logged in: LOG OUT -->
        <button v-else class="btn-primary navbar__drawer-cta" :disabled="loggingOut" @click="handleLogout">
          {{ loggingOut ? 'LOGGING OUT...' : 'LOG OUT' }}
          <span class="btn-arrow">→</span>
        </button>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.js'

const router = useRouter()

const navLinks = [
  { label: 'HOME',      href: '/' },
  { label: 'File',      href: '/startbuilding' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'AI Assistant', href: '/ai-assistant' },
  { label: 'Planning',  href: '/planning' },
]

const scrolled    = ref(false)
const menuOpen    = ref(false)
const searchOpen  = ref(false)
const activeLink  = ref(null)
const searchInput = ref(null)
const loggingOut  = ref(false)

// Reactive login state — re-checks localStorage on every render
const isLoggedIn = computed(() => authService.isLoggedIn())

async function handleLogout() {
  if (loggingOut.value) return  // Prevent double-click
  loggingOut.value = true
  menuOpen.value = false
  try {
    await authService.logout()
  } catch (e) {
    // Even if the API call fails, clear the local token
    authService.removeToken()
  } finally {
    loggingOut.value = false
    router.push('/login')
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) searchOpen.value = false
}

async function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    menuOpen.value = false
    await nextTick()
    searchInput.value?.focus()
  }
}

function setActive(label) {
  activeLink.value = label
  menuOpen.value = false
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;700&display=swap');

:root {
  --bg:             #090909;
  --surface:        #0f0f0f;
  --card:           #141414;
  --raised:         #1a1a1a;
  --border:         #242424;
  --volcanic:       #c0392b;
  --volcanic-glow:  #e74c3c;
  --volcanic-dim:   #5a1a12;
  --gold:           #d4a84b;
  --text-primary:   #ede8df;
  --text-secondary: #6e6a64;
  --text-muted:     #353330;
  --font-display:   'Cormorant Garamond', serif;
  --font-body:      'Syne', sans-serif;
}

.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  font-family: var(--font-body);
  background: transparent;
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease;
  border-bottom: 1px solid transparent;
}

.navbar--scrolled {
  background: rgba(9, 9, 9, 0.82);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 0 rgba(192, 57, 43, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5);
}

.navbar__scanline {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--volcanic-dim) 20%, var(--volcanic-glow) 50%, var(--volcanic-dim) 80%, transparent 100%);
  background-size: 200% 100%;
  animation: scanline 4s linear infinite;
  opacity: 0.7;
}

@keyframes scanline {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  height: 72px;
  position: relative;
  z-index: 2;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  user-select: none;
}

.navbar__logo-hex {
  color: var(--volcanic);
  filter: drop-shadow(0 0 6px rgba(192, 57, 43, 0.55));
  transition: filter 0.2s, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.navbar__logo:hover .navbar__logo-hex {
  filter: drop-shadow(0 0 12px rgba(231, 76, 60, 0.9));
  transform: rotate(30deg) scale(1.1);
}

.hex-outline { animation: hexPulse 3s ease-in-out infinite; }

@keyframes hexPulse {
  0%, 100% { stroke: var(--volcanic);      opacity: 1; }
  50%       { stroke: var(--volcanic-glow); opacity: 0.7; }
}

.navbar__logo-text {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.navbar__logo-accent { color: var(--volcanic-glow); }

.navbar__links {
  display: flex;
  align-items: center;
  gap: 2.8rem;
}

.navbar__link {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.22s ease;
}

.navbar__link:hover,
.navbar__link--active { color: var(--text-primary); }

.navbar__link-bar {
  display: block;
  height: 1px;
  width: 0;
  background: linear-gradient(90deg, var(--volcanic), var(--volcanic-glow));
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(231, 76, 60, 0.5);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar__link:hover .navbar__link-bar,
.navbar__link--active .navbar__link-bar { width: 100%; }

.navbar__link--active .navbar__link-text::before {
  content: '';
  display: inline-block;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--volcanic-glow);
  box-shadow: 0 0 6px var(--volcanic-glow);
  margin-right: 6px;
  vertical-align: middle;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.6); }
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: 1.4rem;
}

.navbar__icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s;
}

.navbar__icon-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.navbar__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(192, 57, 43, 0.55);
  background: rgba(192, 57, 43, 0.09);
  color: var(--volcanic-glow);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease, transform 0.15s ease;
  position: relative;
  overflow: hidden;
}

.navbar__cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(231,76,60,0.15) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.navbar__cta:hover::before { transform: translateX(100%); }

.navbar__cta:hover:not(:disabled) {
  background: rgba(192, 57, 43, 0.2);
  border-color: var(--volcanic-glow);
  box-shadow: 0 0 18px rgba(192,57,43,0.25), inset 0 0 12px rgba(192,57,43,0.06);
  transform: translateY(-1px);
}

.navbar__cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.navbar__cta-arrow {
  transition: transform 0.2s ease;
  font-size: 13px;
}

.navbar__cta:hover:not(:disabled) .navbar__cta-arrow { transform: translateX(4px); }

.navbar__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 5px;
  width: 36px; height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.navbar__burger:hover { background: rgba(255,255,255,0.04); }

.navbar__burger-line {
  display: block;
  height: 1.5px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: width 0.25s ease, transform 0.25s ease, opacity 0.25s ease, background 0.2s;
}

.navbar__burger-line:nth-child(1) { width: 22px; }
.navbar__burger-line:nth-child(2) { width: 16px; }
.navbar__burger-line:nth-child(3) { width: 22px; }

.navbar__burger:hover .navbar__burger-line { background: var(--text-primary); }

.navbar--menu-open .navbar__burger-line:nth-child(1) {
  width: 20px;
  transform: translateY(6.5px) rotate(45deg);
  background: var(--volcanic-glow);
}
.navbar--menu-open .navbar__burger-line:nth-child(2) { opacity: 0; width: 0; }
.navbar--menu-open .navbar__burger-line:nth-child(3) {
  width: 20px;
  transform: translateY(-6.5px) rotate(-45deg);
  background: var(--volcanic-glow);
}

.navbar__search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 3rem;
  border-top: 1px solid var(--border);
  background: rgba(9,9,9,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: relative;
  z-index: 1;
}

.search-icon { color: var(--text-muted); flex-shrink: 0; }

.navbar__search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  caret-color: var(--volcanic-glow);
}

.navbar__search-input::placeholder { color: var(--text-muted); }
.navbar__search-input::-webkit-search-cancel-button { display: none; }

.navbar__search-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.navbar__search-close:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }

.search-slide-enter-active,
.search-slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
  max-height: 80px;
}
.search-slide-enter-from,
.search-slide-leave-to { max-height: 0; opacity: 0; }

.navbar__drawer {
  position: fixed;
  top: 72px; left: 0; right: 0; bottom: 0;
  background: rgba(9,9,9,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 2rem 4rem;
  gap: 0.5rem;
  overflow: hidden;
  z-index: 1;
  border-top: 1px solid var(--border);
}

.navbar__drawer-hex {
  position: absolute;
  right: -2rem; top: 50%;
  transform: translateY(-50%);
  font-size: 280px;
  color: rgba(192,57,43,0.04);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.navbar__drawer-link {
  display: flex;
  align-items: baseline;
  gap: 1.2rem;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.6rem 0;
  border-bottom: 1px solid transparent;
  width: 100%;
  transition: color 0.2s, border-color 0.2s, padding-left 0.25s ease;
  position: relative;
  z-index: 1;
}

.navbar__drawer-link:hover {
  color: var(--text-primary);
  border-bottom-color: var(--border);
  padding-left: 0.5rem;
}

.drawer-num {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--volcanic);
  opacity: 0.7;
  flex-shrink: 0;
}

.navbar__drawer-cta {
  margin-top: 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--volcanic-dim), var(--volcanic), var(--volcanic-dim));
  color: #fff;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid rgba(231,76,60,0.4);
  box-shadow: 0 4px 20px rgba(192,57,43,0.3);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.navbar__drawer-cta:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(192,57,43,0.45);
}

.navbar__drawer-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to { opacity: 0; transform: translateY(-16px); }

@media (max-width: 900px) {
  .navbar__links { display: none; }
  .navbar__right { display: none; }
  .navbar__burger { display: flex; }
}

@media (max-width: 600px) {
  .navbar__inner { padding: 0 1.5rem; height: 64px; }
  .navbar__search-bar { padding: 0.75rem 1.5rem; }
  .navbar__drawer { top: 64px; padding: 2.5rem 1.5rem 3rem; }
  .navbar__drawer-link { font-size: 28px; }
}
</style>