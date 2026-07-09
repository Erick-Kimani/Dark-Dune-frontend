<template>
  <div class="home-wrapper">

    <!-- Hex canvas overlay -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-bg">
        <img src="/Images/Universe.jpg" class="hero-bg-img" alt="" aria-hidden="true" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-tag">
          <span class="tag-dot"></span>
          Universal File Intelligence
        </div>

        <h1 class="hero-title">
          Connect.<br />
          <span class="title-accent">Organize.</span><br />
          Compile.
        </h1>

        <p class="hero-sub">
          Wire your files like a circuit. Link by order, date, or category —
          then let DarkDune compile them into something powerful.
        </p>

        <div class="hero-actions">
          <router-link to="/startbuilding" class="btn-primary">
            <span>Start Building</span>
            <span class="btn-arrow">→</span>
          </router-link>
          <a href="#how" class="btn-ghost">See how it works</a>
        </div>
      </div>

      <div class="scroll-hint">
        <div class="scroll-line"></div>
        <span>scroll</span>
      </div>
    </section>

    <!-- ── Services ── -->
    <section class="features" id="features">
      <div class="section-inner">
        <div class="section-label">
          <span class="label-line"></span>
          Services
          <span class="label-line"></span>
        </div>

        <div class="feat-grid">
          <div class="feat-card" v-for="(feat, i) in features" :key="i" :style="{ '--delay': i * 0.12 + 's' }">
            <div class="feat-hex">{{ feat.icon }}</div>
            <h3 class="feat-title">{{ feat.title }}</h3>
            <p class="feat-desc">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Demo ── -->
    <section class="demo" id="demo">
      <div class="section-inner">
        <div class="section-label">
          <span class="label-line"></span>
          See it work
          <span class="label-line"></span>
        </div>

        <p class="demo-sub">
          A file comes in, becomes a native DarkDune document, and links to
          the next one — all without touching the original.
        </p>

        <div class="demo-stage">
          <!-- Node A: incoming file -->
          <div class="demo-node demo-node-a">
            <div class="demo-icon demo-icon-file">
              <span>DOCX</span>
            </div>
            <div class="demo-node-label">imported.docx</div>
          </div>

          <!-- Convert arrow + pulse -->
          <div class="demo-convert">
            <svg viewBox="0 0 120 24" class="demo-convert-svg">
              <line x1="4" y1="12" x2="100" y2="12" class="demo-convert-line" />
              <polygon points="100,6 116,12 100,18" class="demo-convert-arrow" />
            </svg>
            <span class="demo-convert-label">auto-convert</span>
          </div>

          <!-- Node B: native .dd document, content typing in -->
          <div class="demo-node demo-node-b">
            <div class="demo-icon demo-icon-dd">
              <span>DD</span>
            </div>
            <div class="demo-doc">
              <div class="demo-doc-line demo-doc-line-1"></div>
              <div class="demo-doc-line demo-doc-line-2"></div>
              <div class="demo-doc-line demo-doc-line-3"></div>
            </div>
            <div class="demo-node-label">native · editable</div>
          </div>

          <!-- Link connector to a second file -->
          <div class="demo-link">
            <svg viewBox="0 0 24 120" class="demo-link-svg">
              <line x1="12" y1="4" x2="12" y2="116" class="demo-link-line" />
              <circle cx="12" cy="40" r="3" class="demo-link-node demo-link-node-1" />
              <circle cx="12" cy="60" r="3" class="demo-link-node demo-link-node-2" />
              <circle cx="12" cy="80" r="3" class="demo-link-node demo-link-node-3" />
            </svg>
          </div>

          <div class="demo-node demo-node-c">
            <div class="demo-icon demo-icon-img">
              <span>IMG</span>
            </div>
            <div class="demo-node-label">linked · annotated</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── How it works ── -->
    <section class="how" id="how">
      <div class="section-inner">
        <div class="section-label">
          <span class="label-line"></span>
          How it works
          <span class="label-line"></span>
        </div>

        <div class="steps">
          <div class="step" v-for="(step, i) in steps" :key="i">
            <div class="step-num">0{{ i + 1 }}</div>
            <div class="step-connector" v-if="i < steps.length - 1">
              <div class="connector-line"></div>
              <div class="connector-nodes">
                <span class="node" v-for="n in 3" :key="n"></span>
              </div>
            </div>
            <div class="step-body">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import '../assets/HomePage.css'

export default {
  name: 'HomePage',

  data() {
    return {
      features: [
        {
          icon: '⬡',
          title: 'Universal Import',
          desc: 'Bring in documents, spreadsheets, and images from any source — DarkDune accepts the formats you already work with.',
        },
        {
          icon: '◈',
          title: 'Native Editing',
          desc: 'Every file you open is converted into a DarkDune-native document, safe to edit freely while the original stays untouched.',
        },
        {
          icon: '⟶',
          title: 'Visual Linking',
          desc: 'Wire files together on the canvas — connect by order, date, or category to define how they relate.',
        },
        {
          icon: '✎',
          title: 'Image Annotation',
          desc: 'Mark up images directly with strokes and notes, without altering the source file underneath.',
        },
      ],
      steps: [
        {
          title: 'Upload your files',
          desc: 'Drop in files from any source — documents, code, media, data.',
        },
        {
          title: 'Open & edit natively',
          desc: 'DarkDune converts what you open into an editable native document automatically.',
        },
        {
          title: 'Define the links',
          desc: 'Draw connections between files to define relationships and flow.',
        },
        {
          title: 'Compile & export',
          desc: 'Generate your final output — one click, any format.',
        },
      ],
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
      canvas.width  = window.innerWidth
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
        const cols = Math.ceil(canvas.width  / w) + 2
        const rows = Math.ceil(canvas.height / h) + 2

        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x = col * w * 0.75
            const y = row * h + (col % 2 === 0 ? 0 : h / 2)
            const dist    = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2))
            const maxDist = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
            const pulse   = Math.sin(tick * 0.015 + dist * 0.008) * 0.5 + 0.5
            const alpha   = (1 - dist / maxDist) * 0.18 * pulse + 0.04

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