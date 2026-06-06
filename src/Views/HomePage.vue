<template>
  <div class="home-wrapper">

    <!-- ── Hex canvas overlay ── -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <!-- ── Hero Section ── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-img-wrap">
          <img src="/Images/Universe.jpg" class="hero-bg-img" alt="" aria-hidden="true" />
          <div class="hero-img-vignette"></div>
        </div>
      </div>


      <div class="hero-content">
        <div class="hero-tag">
          <span class="tag-dot"></span> Universal File Intelligence
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
          <router-link to="/payment" class="btn-primary">
            <span>Start Building</span>
            <span class="btn-arrow">→</span>
          </router-link>
          <a href="#how" class="btn-ghost">See how it works</a>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="scroll-hint">
        <div class="scroll-line"></div>
        <span>scroll</span>
      </div>
    </section>

    <!-- ── Feature Hints ── -->
    <section class="features" id="features">
      <div class="features-inner">

        <div class="section-label">
          <span class="label-line"></span>
          What it does
          <span class="label-line"></span>
        </div>

        <div class="feat-grid">

          <div class="feat-card" v-for="(feat, i) in features" :key="i"
               :style="{ '--delay': i * 0.1 + 's' }">
            <div class="feat-hex">
              <span class="feat-icon">{{ feat.icon }}</span>
            </div>
            <h3 class="feat-title">{{ feat.title }}</h3>
            <p class="feat-desc">{{ feat.desc }}</p>
            <div class="feat-glow"></div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── How it works ── -->
    <section class="how" id="how">
      <div class="how-inner">
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

    <!-- ── CTA Banner ── -->
    

    <!-- ── Footer ── -->
  
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
          title: 'Organize',
          desc: 'Group files by order, date, or category into clean, structured collections.',
        },
        {
          icon: '⟶',
          title: 'Link',
          desc: 'Connect files with visual string connectors — like wiring nodes in a flow diagram.',
        },
        {
          icon: '⚙',
          title: 'Compile',
          desc: 'Merge linked files into documents, reports, tests, or any output you need.',
        },
      ],
      steps: [
        {
          title: 'Upload your files',
          desc: 'Drop in files from any source — documents, code, media, data.',
        },
        {
          title: 'Define the links',
          desc: 'Draw string connections between files to define relationships and flow.',
        },
        {
          title: 'Set your logic',
          desc: 'Order by date, category, or custom sequence. Save the pipeline.',
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
        const size = 36
        const w = size * 2
        const h = Math.sqrt(3) * size
        const cols = Math.ceil(canvas.width  / w)  + 2
        const rows = Math.ceil(canvas.height / h)  + 2

        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x = col * w * 0.75
            const y = row * h + (col % 2 === 0 ? 0 : h / 2)
            const dist = Math.sqrt(
              Math.pow(x - canvas.width  / 2, 2) +
              Math.pow(y - canvas.height / 2, 2)
            )
            const maxDist = Math.sqrt(
              Math.pow(canvas.width  / 2, 2) +
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
}
</script>
