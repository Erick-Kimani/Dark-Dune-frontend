<template>
  <footer class="footer">
    <!-- Hexagon pattern background -->
    <div class="footer__hex-pattern" aria-hidden="true">
      <svg class="hex-bg" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <polygon points="60,0 120,30 120,90 60,120 0,90 0,30" fill="none" stroke="url(#volcanoGradient)" stroke-width="0.8" opacity="0.15"/>
          </pattern>
          <linearGradient id="volcanoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: #c0392b; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #e74c3c; stop-opacity: 0.7" />
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#hexPattern)"/>
      </svg>
    </div>

    <!-- Volcanic red edge accents -->
    <div class="footer__edge-accent footer__edge-top" aria-hidden="true"></div>
    <div class="footer__edge-accent footer__edge-left" aria-hidden="true"></div>
    <div class="footer__edge-accent footer__edge-right" aria-hidden="true"></div>

    <!-- Main content -->
    <div class="footer__container">
      
      <!-- Content grid -->
      <div class="footer__grid">
        
        <!-- Column 1: Brand -->
        <div class="footer__column footer__column--brand">
          <div class="footer__logo">
            <span class="footer__logo-hex">⬡</span>
            <div class="footer__logo-text">
              <span class="footer__logo-main">DARKDUNE</span>
              <span class="footer__logo-sub">Project X</span>
            </div>
          </div>
          <p class="footer__description">
            Organize files smarter, collaborate seamlessly, and unlock powerful features with intelligent file management.
          </p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>
              </svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Discord">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C1.533 9.046.913 13.585 1.157 18.083a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.1 10.1 0 00.372-.294.075.075 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 01.079.009c.12.098.246.198.373.294a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.076.076 0 00-.041.107c.352.699.764 1.364 1.225 1.994a.077.077 0 00.084.028 19.839 19.839 0 005.993-3.03.077.077 0 00.032-.056c.27-4.496-.45-8.389-1.901-11.85a.06.06 0 00-.031-.029zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.974-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.191-.964 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.974-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.191-.964 2.156-2.157 2.156z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Product -->
        <div class="footer__column">
          <h3 class="footer__heading">Product</h3>
          <nav class="footer__nav">
            <a href="#" class="footer__link">Features</a>
            <a href="/planning" class="footer__link">Pricing</a>
            <a href="#" class="footer__link">Security</a>
            <a href="#" class="footer__link">Roadmap</a>
            <a href="#" class="footer__link">Updates</a>
            <a href="#" class="footer__link">Status</a>
          </nav>
        </div>

        <!-- Column 3: Company -->
        <div class="footer__column">
          <h3 class="footer__heading">Company</h3>
          <nav class="footer__nav">
            <a href="#" class="footer__link">About Us</a>
            <a href="#" class="footer__link">Blog</a>
            <a href="#" class="footer__link">Careers</a>
            <a href="#" class="footer__link">Press</a>
            <a href="#" class="footer__link">Partners</a>
            <a href="#" class="footer__link">Contact</a>
          </nav>
        </div>

        <!-- Column 4: Resources -->
        <div class="footer__column">
          <h3 class="footer__heading">Resources</h3>
          <nav class="footer__nav">
            <a href="#" class="footer__link">Documentation</a>
            <a href="#" class="footer__link">API Reference</a>
            <a href="#" class="footer__link">Guides</a>
            <a href="#" class="footer__link">Community</a>
            <a href="#" class="footer__link">Help Center</a>
            <a href="#" class="footer__link">FAQ</a>
          </nav>
        </div>

        <!-- Column 5: Legal -->
        <div class="footer__column">
          <h3 class="footer__heading">Legal</h3>
          <nav class="footer__nav">
            <a href="#" class="footer__link">Privacy Policy</a>
            <a href="#" class="footer__link">Terms of Service</a>
            <a href="#" class="footer__link">Cookie Policy</a>
            <a href="#" class="footer__link">GDPR</a>
            <a href="#" class="footer__link">Compliance</a>
            <a href="#" class="footer__link">Report Bug</a>
          </nav>
        </div>

      </div>

      <!-- Divider -->
      <div class="footer__divider" aria-hidden="true"></div>

      <!-- Bottom section -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © <span id="year"></span> DarkDune. All rights reserved. | Made with <span class="footer__heart">♥</span> for builders.
        </p>
        <div class="footer__bottom-links">
          <a href="#" class="footer__bottom-link">Privacy</a>
          <span class="footer__divider-dot">•</span>
          <a href="#" class="footer__bottom-link">Terms</a>
          <span class="footer__divider-dot">•</span>
          <a href="#" class="footer__bottom-link">Cookies</a>
        </div>
      </div>

    </div>

    <!-- Scrollback to top button (hidden by default) -->
    <button
      v-if="showScrollTop"
      class="footer__scroll-top"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 15L12 10L17 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  
  data() {
    return {
      showScrollTop: false
    }
  },

  mounted() {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear()

    // Listen for scroll events
    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      this.showScrollTop = window.scrollY > 300
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;700&display=swap');

/* ════════════════════════════
   CSS VARIABLES
════════════════════════════ */
:root {
  --bg:              #090909;
  --surface:         #0f0f0f;
  --card:            #141414;
  --raised:          #1a1a1a;
  --border:          #242424;
  --volcanic:        #c0392b;
  --volcanic-glow:   #e74c3c;
  --volcanic-dim:    #5a1a12;
  --gold:            #d4a84b;
  --text-primary:    #ede8df;
  --text-secondary:  #6e6a64;
  --text-muted:      #353330;
  --font-display:    'Cormorant Garamond', serif;
  --font-body:       'Syne', sans-serif;
}

/* ════════════════════════════
   FOOTER CONTAINER
════════════════════════════ */
.footer {
  position: relative;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  margin-top: auto;
  overflow: hidden;
}

/* Hexagon pattern background */
.footer__hex-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
}

.hex-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Edge accents */
.footer__edge-accent {
  position: absolute;
  background: linear-gradient(
    90deg,
    var(--volcanic),
    var(--volcanic-glow),
    var(--volcanic-dim)
  );
  z-index: 1;
  opacity: 0.3;
}

.footer__edge-top {
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}

.footer__edge-left {
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  opacity: 0.2;
}

.footer__edge-right {
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  opacity: 0.2;
}

/* ════════════════════════════
   MAIN CONTENT
════════════════════════════ */
.footer__container {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 3rem;
}

/* ════════════════════════════
   GRID LAYOUT
════════════════════════════ */
.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer__column--brand {
  gap: 2rem;
}

/* ════════════════════════════
   BRAND SECTION
════════════════════════════ */
.footer__logo {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.footer__logo-hex {
  font-size: 32px;
  color: var(--volcanic);
  filter: drop-shadow(0 0 6px rgba(192, 57, 43, 0.6));
  line-height: 1;
  flex-shrink: 0;
}

.footer__logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer__logo-main {
  display: block;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.footer__logo-sub {
  display: block;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--volcanic-glow);
}

.footer__description {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 280px;
}

/* ════════════════════════════
   SOCIAL LINKS
════════════════════════════ */
.footer__social {
  display: flex;
  gap: 1rem;
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(192, 57, 43, 0.1);
  color: var(--volcanic-glow);
  border: 1px solid rgba(192, 57, 43, 0.2);
  transition: all 0.2s;
}

.footer__social-link:hover {
  background: rgba(192, 57, 43, 0.2);
  border-color: var(--volcanic-glow);
  box-shadow: 0 0 12px rgba(192, 57, 43, 0.3);
  transform: translateY(-2px);
}

.footer__social-link svg {
  width: 16px;
  height: 16px;
}

/* ════════════════════════════
   HEADINGS & LINKS
════════════════════════════ */
.footer__heading {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer__heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 28px;
  height: 2px;
  background: linear-gradient(90deg, var(--volcanic), var(--volcanic-glow));
  border-radius: 1px;
  box-shadow: 0 0 8px rgba(231, 76, 60, 0.4);
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s, padding-left 0.2s;
  padding-left: 0;
  position: relative;
}

.footer__link:hover {
  color: var(--volcanic-glow);
  padding-left: 4px;
}

.footer__link::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--volcanic-glow);
  border-radius: 2px;
  transition: height 0.2s;
}

.footer__link:hover::before {
  height: 12px;
}

/* ════════════════════════════
   DIVIDER
════════════════════════════ */
.footer__divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--border),
    transparent
  );
  margin: 3rem 0;
}

/* ════════════════════════════
   BOTTOM SECTION
════════════════════════════ */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(192, 57, 43, 0.1);
}

.footer__copyright {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.footer__heart {
  color: var(--volcanic-glow);
  margin: 0 4px;
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.footer__bottom-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer__bottom-link {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__bottom-link:hover {
  color: var(--volcanic-glow);
  text-decoration: underline;
}

.footer__divider-dot {
  color: var(--border);
}

/* ════════════════════════════
   SCROLL TO TOP BUTTON
════════════════════════════ */
.footer__scroll-top {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(192, 57, 43, 0.15);
  border: 1px solid var(--volcanic-glow);
  color: var(--volcanic-glow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  animation: fadeIn 0.3s ease forwards;
  z-index: 10;
}

.footer__scroll-top:hover {
  background: rgba(192, 57, 43, 0.25);
  box-shadow: 0 0 16px rgba(192, 57, 43, 0.3);
  transform: translateY(-4px);
}

.footer__scroll-top svg {
  width: 18px;
  height: 18px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ════════════════════════════
   RESPONSIVE
════════════════════════════ */
@media (max-width: 1200px) {
  .footer__grid {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 900px) {
  .footer__container {
    padding: 3rem 2rem;
  }

  .footer__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .footer__column--brand {
    grid-column: 1 / -1;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .footer__container {
    padding: 2rem 1.5rem;
  }

  .footer__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer__divider {
    margin: 2rem 0;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 1rem;
  }

  .footer__scroll-top {
    width: 36px;
    height: 36px;
    bottom: 1rem;
    right: 1rem;
  }

  .footer__heading {
    font-size: 14px;
  }

  .footer__link,
  .footer__copyright,
  .footer__bottom-link {
    font-size: 12px;
  }
}
</style>