<template>
  <div class="planning-wrapper">

    <!-- ── Hex canvas overlay ── -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>


    <!-- ── Mobile sidebar trigger ── -->
    <button type="button" class="sidebar-fab" @click="sidebarOpen = true" v-if="!sidebarOpen">
      <span class="sidebar-fab-icon">⚙</span> Filters
    </button>

    <!-- ── Sidebar ── -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h3>Plan Filters</h3>
        <button class="sidebar-close" @click="sidebarOpen = false" aria-label="Close filters">✕</button>
      </div>

      <div class="sidebar-content">

        <!-- Plan Selection -->
        <div class="sidebar-section">
          <h4 class="section-title">Show tiers</h4>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="free" />
              <span>Free</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="silver" />
              <span>Silver</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="premium" />
              <span>Premium</span>
            </label>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Feature Filters -->
        <div class="sidebar-section">
          <h4 class="section-title">Filter by capability</h4>
          <p class="section-hint" v-if="viewMode === 'Cards'">Switch to Table or Detailed view to see these applied.</p>
          <div class="filter-group">
            <button
              class="filter-btn"
              v-for="filter in featureFilters"
              :key="filter"
              @click="toggleFilter(filter)"
              :class="{ active: activeFilters.includes(filter) }"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Tier Comparison -->
        <div class="sidebar-section">
          <h4 class="section-title">At a glance</h4>
          <div class="comparison-quick">
            <div class="comp-item">
              <span class="comp-label">Storage</span>
              <div class="comp-values">
                <span class="comp-free">Local</span>
                <span class="comp-silver">+50GB</span>
                <span class="comp-premium">∞</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">Price</span>
              <div class="comp-values">
                <span class="comp-free">Free</span>
                <span class="comp-silver">$9.99</span>
                <span class="comp-premium">$29.99</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">Collaborators</span>
              <div class="comp-values">
                <span class="comp-free">1</span>
                <span class="comp-silver">5</span>
                <span class="comp-premium">∞</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">AI Features</span>
              <div class="comp-values">
                <span class="comp-free">Basic</span>
                <span class="comp-silver">—</span>
                <span class="comp-premium">Full</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- View Mode -->
        <div class="sidebar-section">
          <h4 class="section-title">View as</h4>
          <div class="view-mode-group">
            <button
              class="view-btn"
              v-for="mode in ['Cards', 'Table', 'Detailed']"
              :key="mode"
              @click="viewMode = mode"
              :class="{ active: viewMode === mode }"
            >
              {{ mode }}
            </button>
          </div>
        </div>

      </div>

      <div class="sidebar-footer">
        <button class="sidebar-cta" @click="goToCheckout">Start Free Trial</button>
      </div>
    </aside>

    <!-- ── Overlay (when sidebar open on mobile) ── -->
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>

    <!-- ── Main Content ── -->
    <main class="planning-main">

      <!-- Hero/Intro Section -->
      <section class="planning-hero">
        <div class="hero-tag">
          <span class="tag-dot"></span>
          Plans &amp; Pricing
        </div>
        <h1 class="planning-title">
          Every tier still<br /><span class="title-accent">compiles</span> the same way.
        </h1>
        <p class="planning-subtitle">
          Start free with local-first storage, then unlock cloud sync, collaborators,
          and full AI automation as your workspace grows.
        </p>
      </section>

      <!-- Plans Section -->
      <section class="plans" id="plans">
        <div class="section-label">
          <span class="label-line"></span>
          Available Tiers
          <span class="label-line"></span>
        </div>

        <!-- Cards View -->
        <div v-if="viewMode === 'Cards'" class="plans-grid">
          <div
            v-for="plan in filteredPlans"
            :key="plan.id"
            class="plan-card"
            :class="['tier-' + plan.id, { featured: plan.featured }]"
          >
            <div class="plan-badge" v-if="plan.featured">Most Popular</div>

            <div class="plan-header">
              <h2 class="plan-name">{{ plan.name }}</h2>
              <p class="plan-subtitle">{{ plan.subtitle }}</p>
            </div>

            <div class="plan-pricing">
              <span class="plan-price">${{ plan.price }}</span>
              <span class="plan-period" v-if="plan.price > 0">/month</span>
              <span class="plan-trial" v-else>30-day trial</span>
            </div>

            <p class="plan-description">{{ plan.description }}</p>

            <button class="plan-cta" @click="selectPlan(plan.id)" :class="'cta-' + plan.id">
              {{ plan.ctaText }}
              <span class="btn-arrow">→</span>
            </button>

            <div class="plan-divider"></div>

            <div class="features-list">
              <h4 class="features-title">What's included</h4>
              <ul class="features">
                <li v-for="(feature, idx) in plan.features" :key="idx" class="feature-item">
                  <span class="feature-check">✓</span>
                  <span class="feature-text">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'Table'" class="comparison-table">
          <p class="filter-empty" v-if="filteredComparisonFeatures.length === 0">
            No features match the selected filters — try clearing one in the sidebar.
          </p>
          <table v-else>
            <thead>
              <tr>
                <th>Feature</th>
                <th v-for="plan in filteredPlans" :key="plan.id" :class="'th-' + plan.id">{{ plan.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(feature, idx) in filteredComparisonFeatures" :key="idx">
                <td class="feature-name">{{ feature.name }}</td>
                <td v-for="plan in filteredPlans" :key="plan.id" class="feature-value">
                  <span v-if="typeof feature.values[plan.id] === 'boolean'" :class="feature.values[plan.id] ? 'val-yes' : 'val-no'">
                    {{ feature.values[plan.id] ? '✓' : '—' }}
                  </span>
                  <span v-else>{{ feature.values[plan.id] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Detailed View -->
        <div v-if="viewMode === 'Detailed'" class="detailed-view">
          <div v-for="plan in filteredPlans" :key="plan.id" class="detailed-card" :class="'tier-' + plan.id">
            <h3 class="detailed-title">{{ plan.name }}</h3>
            <p class="detailed-price">${{ plan.price }}<span v-if="plan.price > 0">/mo</span></p>
            <p class="detailed-desc">{{ plan.description }}</p>

            <p class="filter-empty" v-if="filteredCategories(plan).length === 0">
              No feature groups on this tier match the selected filters.
            </p>

            <div class="detail-sections" v-else>
              <div v-for="(category, catIdx) in filteredCategories(plan)" :key="catIdx" class="detail-category">
                <h5 class="category-title">{{ category.title }}</h5>
                <ul class="category-items">
                  <li v-for="(item, itemIdx) in category.items" :key="itemIdx">
                    <span class="check-icon">✓</span> {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- FAQ Section -->
      <section class="faq" id="faq">
        <div class="section-label">
          <span class="label-line"></span>
          Common Questions
          <span class="label-line"></span>
        </div>

        <div class="faq-list">
          <div class="faq-item" v-for="(item, idx) in faqs" :key="idx" :class="{ open: openFaqs.includes(idx) }">
            <button class="faq-question" @click="toggleFaq(idx)">
              {{ item.q }}
              <span class="faq-caret">{{ openFaqs.includes(idx) ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer" v-if="openFaqs.includes(idx)">{{ item.a }}</div>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="footer-logo">
        <span class="nav-hex">⬡</span>
        Dark<span class="nav-accent">Dune</span>
      </div>
      <p class="footer-copy">© 2026 DarkDune. All rights reserved.</p>
    </footer>

  </div>
</template>

<script>
import '../assets/PlanningPage.css'

export default {
  name: 'PlanningPage',

  data() {
    return {
      sidebarOpen: false,
      selectedPlans: ['free', 'silver', 'premium'],
      activeFilters: [],
      viewMode: 'Cards',
      openFaqs: [],

      featureFilters: [
        'Storage',
        'Collaboration',
        'AI Features',
        'Security',
        'Integrations',
        'Automation',
        'Support',
      ],

      // Keywords used to match the quick filter buttons against comparison
      // rows and detailed feature-group titles below. Kept intentionally
      // simple — this is a quick filter, not an exhaustive search.
      filterKeywordMap: {
        'Storage': ['storage'],
        'Collaboration': ['collab', 'workspace', 'sharing'],
        'AI Features': ['ai'],
        'Security': ['security', 'compliance'],
        'Integrations': ['integrat'],
        'Automation': ['automat'],
        'Support': ['support'],
      },

      plans: [
        {
          id: 'free',
          name: 'Free',
          subtitle: 'Start with the essentials',
          price: 0,
          ctaText: 'Start Free Trial',
          featured: false,
          description: 'Local-first file organization for individuals — unlimited storage on your own machine, no strings attached.',
          features: [
            'Unlimited local storage (uses your device)',
            'AI auto-tagging (10 tags/day)',
            'Drag-and-drop linking (10 connections)',
            'Single local workspace',
            'Basic file preview',
            'Full-text search, local',
            '1GB cloud metadata storage',
            '30-day free trial',
          ],
          detailedFeatures: [
            {
              title: 'Storage & Organization',
              items: [
                'Unlimited local storage on your device',
                '1GB cloud metadata storage',
                'Single workspace',
                'Flat folder structure',
                'Manual tagging',
              ],
            },
            {
              title: 'Core Features',
              items: [
                'AI auto-tagging (10/day limit)',
                'Drag-and-drop file linking (10 max)',
                'Basic file preview',
                'Local full-text search',
              ],
            },
            {
              title: 'Access & Support',
              items: [
                'Desktop app (Windows/Mac)',
                'Web dashboard, read-only',
                'Community support',
                '30-day trial period',
              ],
            },
          ],
        },
        {
          id: 'silver',
          name: 'Silver',
          subtitle: 'For growing teams',
          price: 9.99,
          ctaText: 'Upgrade to Silver',
          featured: true,
          description: 'Cloud backup, mobile access, and room for up to five collaborators wiring files together.',
          features: [
            'Unlimited local storage',
            '50GB cloud backup, optional',
            'Mobile app (iOS/Android)',
            'Up to 5 collaborators',
            'Unlimited nested networks & folders',
            'Advanced filtering & search',
            'File versioning, 5 versions',
            'Activity logs & audit trails',
            'Shareable links with expiry',
            'Custom metadata fields',
            'Batch file operations',
            'Email notifications',
          ],
          detailedFeatures: [
            {
              title: 'Storage & Cloud',
              items: [
                'Unlimited local storage',
                '50GB cloud backup storage',
                'Selective file sync to cloud',
                'Cloud-synced access on mobile',
              ],
            },
            {
              title: 'Organization & Search',
              items: [
                'Unlimited networks & folders',
                'Nested folder structures, 5 levels',
                'Advanced filtering by date, type, size',
                'Custom metadata fields',
                'Saved searches',
                'Smart views',
              ],
            },
            {
              title: 'Collaboration',
              items: [
                'Up to 5 team members',
                'Role-based permissions',
                'Activity logs',
                'Shareable links with expiry',
                'Real-time notifications',
                'Email digest options',
              ],
            },
            {
              title: 'Apps & Tools',
              items: [
                'Desktop app, Windows/Mac/Linux',
                'Mobile apps, iOS/Android',
                'Full web dashboard control',
                'Business-hours email support',
              ],
            },
          ],
        },
        {
          id: 'premium',
          name: 'Premium',
          subtitle: 'Everything unlocked',
          price: 29.99,
          ctaText: 'Upgrade to Premium',
          featured: false,
          description: 'Unlimited storage, full AI automation, every integration, and enterprise-grade security.',
          features: [
            'Unlimited storage, local + cloud',
            'Unlimited collaborators',
            'AI auto-organization & suggestions',
            'Duplicate file detection',
            'Intelligent file-relationship discovery',
            'Unlimited version history',
            'Cloud integrations — Drive, OneDrive, Dropbox',
            'Slack integration & webhooks',
            'Full workflow automation, node editor',
            'Advanced security — E2EE, 2FA, IP restrict',
            'API access for developers',
            'White-label & custom branding',
            'Advanced analytics dashboard',
            '24/7 priority support',
            'Scheduled backups & disaster recovery',
            'GDPR & HIPAA compliance features',
          ],
          detailedFeatures: [
            {
              title: 'Storage & Backup',
              items: [
                'Unlimited local storage',
                'Unlimited cloud storage',
                'Full bi-directional cloud sync',
                'Complete version history',
                'Automatic daily backups',
                'Multi-location redundancy',
              ],
            },
            {
              title: 'AI & Automation',
              items: [
                'AI auto-organization suggestions',
                'Duplicate file detection & cleanup',
                'Intelligent relationship discovery',
                'Visual workflow automation, node editor',
                'Scheduled automation workflows',
                'Custom workflow templates',
              ],
            },
            {
              title: 'Collaboration & Sharing',
              items: [
                'Unlimited team members',
                'Advanced role-based access control',
                'Watermarked file sharing',
                'Download limits & IP restrictions',
                'Conditional sharing policies',
              ],
            },
            {
              title: 'Integrations & API',
              items: [
                'Google Drive, OneDrive, Dropbox sync',
                'Slack integration',
                'Full REST API access',
                'Webhook support',
                'SDK support — JS, Python, Go',
              ],
            },
            {
              title: 'Security & Compliance',
              items: [
                'End-to-end encryption',
                'Two-factor authentication',
                'IP whitelisting',
                'GDPR data processing agreement',
                'HIPAA compliance ready',
              ],
            },
            {
              title: 'Enterprise Features',
              items: [
                'White-label & custom branding',
                'Advanced analytics dashboard',
                'Dedicated account manager',
                '24/7 priority phone support',
                'SLA guarantee',
              ],
            },
          ],
        },
      ],

      comparisonFeatures: [
        { name: 'Local Storage', values: { free: 'Unlimited', silver: 'Unlimited', premium: 'Unlimited' } },
        { name: 'Cloud Storage', values: { free: '1GB metadata', silver: '50GB', premium: 'Unlimited' } },
        { name: 'File Linking', values: { free: '10 connections', silver: 'Unlimited', premium: 'Unlimited' } },
        { name: 'Workspaces', values: { free: '1', silver: 'Unlimited', premium: 'Unlimited' } },
        { name: 'Collaborators', values: { free: '0', silver: '5', premium: 'Unlimited' } },
        { name: 'Version History', values: { free: 'None', silver: '5 versions', premium: 'Unlimited' } },
        { name: 'AI Features', values: { free: 'Basic tagging', silver: 'None', premium: 'Full suite' } },
        { name: 'Custom Metadata', values: { free: false, silver: true, premium: true } },
        { name: 'API Access', values: { free: false, silver: false, premium: true } },
        { name: 'Support', values: { free: 'Community', silver: 'Business hours', premium: '24/7 Priority' } },
      ],

      faqs: [
        {
          q: 'Can I switch tiers later?',
          a: 'Yes — upgrade or downgrade anytime from your account settings. Your local files and links stay exactly where they are; only your cloud allowance and collaborator limits change.',
        },
        {
          q: 'What happens to my files if I cancel?',
          a: 'Nothing — your files live on your device first. Cancelling Silver or Premium just stops cloud sync and collaborator access; your local .dd documents and links remain fully usable on the Free tier.',
        },
        {
          q: 'Is my data encrypted?',
          a: 'On Premium, files are protected with end-to-end encryption both in transit and at rest. Free and Silver use standard encryption in transit; local files are only as secure as your own device.',
        },
        {
          q: 'Do you offer discounts for teams or students?',
          a: 'Team and education pricing is available on request — reach out through the AI Assistant or support email and we\'ll get a custom quote sorted.',
        },
      ],
    }
  },

  computed: {
    filteredPlans() {
      return this.plans.filter(plan => this.selectedPlans.includes(plan.id))
    },

    filteredComparisonFeatures() {
      if (!this.activeFilters.length) return this.comparisonFeatures
      const keywords = this.activeFilters.flatMap(f => this.filterKeywordMap[f] || [])
      return this.comparisonFeatures.filter(feat =>
        keywords.some(k => feat.name.toLowerCase().includes(k))
      )
    },
  },

  methods: {
    toggleFilter(filter) {
      const idx = this.activeFilters.indexOf(filter)
      if (idx > -1) {
        this.activeFilters.splice(idx, 1)
      } else {
        this.activeFilters.push(filter)
      }
    },

    filteredCategories(plan) {
      if (!this.activeFilters.length) return plan.detailedFeatures
      const keywords = this.activeFilters.flatMap(f => this.filterKeywordMap[f] || [])
      return plan.detailedFeatures.filter(cat =>
        keywords.some(k => cat.title.toLowerCase().includes(k))
      )
    },

    toggleFaq(idx) {
      const faqIdx = this.openFaqs.indexOf(idx)
      if (faqIdx > -1) {
        this.openFaqs.splice(faqIdx, 1)
      } else {
        this.openFaqs.push(idx)
      }
    },

    selectPlan(planId) {
      this.$router.push('/checkout?plan=' + planId)
    },

    goToCheckout() {
      this.$router.push('/checkout')
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
    },
  },

  mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    this.animateHex()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
    cancelAnimationFrame(this._hexRaf)
  },
}
</script>