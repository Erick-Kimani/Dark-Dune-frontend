<template>
  <div class="planning-wrapper">
    
    <!-- ── Hex canvas overlay ── -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    

    <!-- ── Sidebar ── -->
    <div class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h3>Plan Features</h3>
        <button class="sidebar-close" @click="sidebarOpen = false">✕</button>
      </div>

      <div class="sidebar-content">
        
        <!-- Plan Selection -->
        <div class="sidebar-section">
          <h4 class="section-title">Select Plans to View</h4>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="free" />
              <span>Free Tier</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="silver" />
              <span>Silver Tier</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="selectedPlans" value="premium" />
              <span>Premium Tier</span>
            </label>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Feature Filters -->
        <div class="sidebar-section">
          <h4 class="section-title">Filter by Feature</h4>
          <div class="filter-group">
            <button class="filter-btn" 
                    v-for="filter in featureFilters" 
                    :key="filter"
                    @click="toggleFilter(filter)"
                    :class="{ active: activeFilters.includes(filter) }">
              {{ filter }}
            </button>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Tier Comparison -->
        <div class="sidebar-section">
          <h4 class="section-title">Quick Comparison</h4>
          <div class="comparison-quick">
            <div class="comp-item">
              <span class="comp-label">Storage:</span>
              <div class="comp-values">
                <span class="comp-free">1GB</span>
                <span class="comp-silver">50GB</span>
                <span class="comp-premium">∞</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">Price:</span>
              <div class="comp-values">
                <span class="comp-free">Free</span>
                <span class="comp-silver">$9.99</span>
                <span class="comp-premium">$29.99</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">Users:</span>
              <div class="comp-values">
                <span class="comp-free">1</span>
                <span class="comp-silver">5</span>
                <span class="comp-premium">∞</span>
              </div>
            </div>
            <div class="comp-item">
              <span class="comp-label">AI Features:</span>
              <div class="comp-values">
                <span class="comp-free">Basic</span>
                <span class="comp-silver">None</span>
                <span class="comp-premium">Full</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- View Mode -->
        <div class="sidebar-section">
          <h4 class="section-title">View Mode</h4>
          <div class="view-mode-group">
            <button class="view-btn" 
                    v-for="mode in ['Cards', 'Table', 'Detailed']"
                    :key="mode"
                    @click="viewMode = mode"
                    :class="{ active: viewMode === mode }">
              {{ mode }}
            </button>
          </div>
        </div>

      </div>

      <div class="sidebar-footer">
        <button class="sidebar-cta" @click="goToCheckout">Start Free Trial</button>
      </div>
    </div>

    <!-- ── Overlay (when sidebar open on mobile) ── -->
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>

    <!-- ── Main Content ── -->
    <main class="planning-main">

      <!-- Hero/Intro Section -->
      <section class="planning-hero">
        <h1 class="planning-title">Choose Your Plan</h1>
        <p class="planning-subtitle">
          Select the tier that fits your workflow. Start free, upgrade anytime.
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
          <div v-for="plan in filteredPlans" 
               :key="plan.id" 
               class="plan-card" 
               :class="{ 'featured': plan.featured }">
            
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

            <button class="plan-cta" @click="selectPlan(plan.id)" :class="plan.ctaStyle">
              {{ plan.ctaText }}
              <span class="btn-arrow">→</span>
            </button>

            <div class="plan-divider"></div>

            <div class="features-list">
              <h4 class="features-title">What's Included:</h4>
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
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th v-for="plan in filteredPlans" :key="plan.id">{{ plan.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(feature, idx) in comparisonFeatures" :key="idx">
                <td class="feature-name">{{ feature.name }}</td>
                <td v-for="plan in filteredPlans" :key="plan.id" class="feature-value">
                  <span v-if="typeof feature.values[plan.id] === 'boolean'">
                    {{ feature.values[plan.id] ? '✓' : '✗' }}
                  </span>
                  <span v-else>{{ feature.values[plan.id] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Detailed View -->
        <div v-if="viewMode === 'Detailed'" class="detailed-view">
          <div v-for="plan in filteredPlans" :key="plan.id" class="detailed-card">
            <h3 class="detailed-title">{{ plan.name }}</h3>
            <p class="detailed-price">${{ plan.price }}<span v-if="plan.price > 0">/mo</span></p>
            <p class="detailed-desc">{{ plan.description }}</p>
            
            <div class="detail-sections">
              <div v-for="(category, catIdx) in plan.detailedFeatures" :key="catIdx" class="detail-category">
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
    </main>

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="footer-logo">
        <span class="nav-bolt">⬡</span>
        Dark<span class="nav-accent">Dune</span>
      </div>
      <p class="footer-copy">© 2025 DarkDune. All rights reserved.</p>
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
        'Support'
      ],

      plans: [
        {
          id: 'free',
          name: 'Free',
          subtitle: 'Start with the essentials',
          price: 0,
          ctaText: 'Start Free Trial',
          ctaStyle: 'primary',
          featured: false,
          description: 'Perfect for individuals exploring local-first file organization. Unlimited local storage on your computer.',
          features: [
            'Unlimited local storage (uses your PC)',
            'Auto-tagging with AI (10 tags/day)',
            'Drag-and-drop linking (10 connections)',
            'Single workspace (local)',
            'Basic file preview',
            'Full-text search (local)',
            '1GB cloud metadata storage',
            '30-day free trial'
          ],
          detailedFeatures: [
            {
              title: 'Storage & Organization',
              items: [
                'Unlimited local storage on your computer',
                '1GB cloud metadata storage',
                'Single workspace',
                'Basic folder structure (flat)',
                'Manual tagging'
              ]
            },
            {
              title: 'Core Features',
              items: [
                'Auto-tag with AI (10/day limit)',
                'Drag-and-drop file linking (10 max)',
                'Basic file preview',
                'Local full-text search'
              ]
            },
            {
              title: 'Access & Support',
              items: [
                'Desktop app (Windows/Mac)',
                'Web dashboard (read-only)',
                'Community support',
                '30-day trial period'
              ]
            }
          ]
        },
        {
          id: 'silver',
          name: 'Silver',
          subtitle: 'For growing teams',
          price: 9.99,
          ctaText: 'Upgrade to Silver',
          ctaStyle: 'primary',
          featured: true,
          description: 'Expand with cloud backup, mobile access, and team collaboration for up to 5 members.',
          features: [
            'Unlimited local storage',
            '50GB cloud backup (optional)',
            'Mobile app (iOS/Android)',
            'Up to 5 collaborators',
            'Unlimited networks & folders (nested)',
            'Advanced filtering & search',
            'File versioning (5 versions)',
            'Activity logs & audit trails',
            'Shareable links with expiry',
            'Custom metadata fields',
            'Batch file operations',
            'Email notifications'
          ],
          detailedFeatures: [
            {
              title: 'Storage & Cloud',
              items: [
                'Unlimited local storage',
                '50GB cloud backup storage',
                'Selective file sync to cloud',
                'Cloud-synced file access on mobile'
              ]
            },
            {
              title: 'Organization & Search',
              items: [
                'Unlimited networks & folders',
                'Nested folder structures (5 levels)',
                'Advanced filtering (date, type, size)',
                'Custom metadata fields',
                'Saved searches',
                'Smart views'
              ]
            },
            {
              title: 'Collaboration',
              items: [
                'Up to 5 team members',
                'Role-based permissions',
                'Activity logs',
                'Shareable links with expiry',
                'Real-time notifications',
                'Email digest options'
              ]
            },
            {
              title: 'Apps & Tools',
              items: [
                'Desktop app (Windows/Mac/Linux)',
                'Mobile apps (iOS/Android)',
                'Web dashboard (full control)',
                'Business hours email support'
              ]
            }
          ]
        },
        {
          id: 'premium',
          name: 'Premium',
          subtitle: 'Everything unlocked',
          price: 29.99,
          ctaText: 'Upgrade to Premium',
          ctaStyle: 'premium',
          featured: false,
          description: 'Full power: unlimited storage, AI automation, integrations, and enterprise security.',
          features: [
            'Unlimited storage (local + cloud)',
            'Unlimited cloud storage',
            'Unlimited collaborators',
            'AI auto-organization & suggestions',
            'Duplicate file detection',
            'Intelligent file relationship discovery',
            'Unlimited version history',
            'Cloud integrations (Google Drive, OneDrive, Dropbox)',
            'Slack integration & webhooks',
            'Full workflow automation (node editor)',
            'Advanced security (E2EE, 2FA, IP restrict)',
            'API access for developers',
            'White-label & custom branding',
            'Advanced analytics dashboard',
            '24/7 priority support',
            'Scheduled backups & disaster recovery',
            'GDPR & HIPAA compliance features',
            'Custom integrations support'
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
                'Ransomware protection'
              ]
            },
            {
              title: 'AI & Automation',
              items: [
                'AI auto-organization suggestions',
                'Duplicate file detection & cleanup',
                'Intelligent relationship discovery',
                'Visual workflow automation (node editor)',
                'Scheduled automation workflows',
                'Custom workflow templates'
              ]
            },
            {
              title: 'Collaboration & Sharing',
              items: [
                'Unlimited team members',
                'Advanced role-based access control',
                'Watermarked file sharing',
                'Download limits & IP restrictions',
                'Device compliance checking',
                'Conditional sharing policies',
                'Advanced sharing analytics'
              ]
            },
            {
              title: 'Integrations & API',
              items: [
                'Google Drive, OneDrive, Dropbox sync',
                'Slack integration',
                'Full REST API access',
                'Webhook support',
                'Custom MCP server integration',
                'SDK support (JS, Python, Go)',
                'Zapier & n8n workflows'
              ]
            },
            {
              title: 'Security & Compliance',
              items: [
                'End-to-end encryption (E2EE)',
                'Two-factor authentication',
                'IP whitelisting',
                'Device fingerprinting',
                'GDPR data processing agreement',
                'HIPAA compliance ready',
                'SOC 2 Type II certified'
              ]
            },
            {
              title: 'Enterprise Features',
              items: [
                'White-label & custom branding',
                'Advanced analytics dashboard',
                'Custom integrations development',
                'Dedicated account manager',
                '24/7 priority phone support',
                'SLA guarantee',
                'Custom contract terms'
              ]
            }
          ]
        }
      ],

      
      comparisonFeatures: [
        {
          name: 'Local Storage',
          values: { free: 'Unlimited', silver: 'Unlimited', premium: 'Unlimited' }
        },
        {
          name: 'Cloud Storage',
          values: { free: '1GB metadata', silver: '50GB', premium: 'Unlimited' }
        },
        {
          name: 'File Linking',
          values: { free: '10 connections', silver: 'Unlimited', premium: 'Unlimited' }
        },
        {
          name: 'Workspaces',
          values: { free: '1', silver: 'Unlimited', premium: 'Unlimited' }
        },
        {
          name: 'Collaborators',
          values: { free: '0', silver: '5', premium: 'Unlimited' }
        },
        {
          name: 'Version History',
          values: { free: 'None', silver: '5 versions', premium: 'Unlimited' }
        },
        {
          name: 'AI Features',
          values: { free: 'Basic tagging', silver: 'None', premium: 'Full suite' }
        },
        {
          name: 'Custom Metadata',
          values: { free: false, silver: true, premium: true }
        },
        {
          name: 'API Access',
          values: { free: false, silver: false, premium: true }
        },
        {
          name: 'Support',
          values: { free: 'Community', silver: 'Business hours', premium: '24/7 Priority' }
        }
      ],

    }
  },

  computed: {
    filteredPlans() {
      return this.plans.filter(plan => this.selectedPlans.includes(plan.id))
    }
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

    toggleFaq(idx) {
      const faqIdx = this.openFaqs.indexOf(idx)
      if (faqIdx > -1) {
        this.openFaqs.splice(faqIdx, 1)
      } else {
        this.openFaqs.push(idx)
      }
    },

    selectPlan(planId) {
      console.log('Selected plan:', planId)
      this.$router.push('/checkout?plan=' + planId)
    },

    goToCheckout() {
      this.$router.push('/checkout')
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
  },

  methods: {
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
  }
}
</script>