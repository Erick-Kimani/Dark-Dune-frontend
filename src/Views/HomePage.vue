<template>
  <div class="home-wrapper">

    <!-- Hex canvas overlay -->
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-bg">
        <img src="/Images/black-sand-dunes-smartphone-wallpaper-free-image.webp" class="hero-bg-img" alt="" aria-hidden="true" />
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
          Any file comes in, becomes a native DarkDune document, and links to
          the next one — all without touching the original.
        </p>

        <div class="demo-stage">

          <!-- Consolidated input cluster: all accepted formats fan from one stack -->
          <div class="demo-cluster">
            <div
              class="demo-node demo-node-a demo-node-stack"
              v-for="(file, i) in inputFiles"
              :key="file.label"
              :style="{ '--i': i }"
            >
              <div class="demo-icon demo-icon-file">
                <img v-if="file.img" :src="file.img" alt="" class="demo-icon-img-inline" />
                <span v-else>{{ file.label }}</span>
              </div>
            </div>
            <div class="demo-cluster-label"><h3><b>docx · ppt · xlsx · jpg / jpeg / png / gif</b></h3></div>
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

    <!-- ── Product Tour: real screens, sample data ── -->
    <section class="tour" id="tour">
      <div class="section-inner">
        <div class="section-label">
          <span class="label-line"></span>
          Take a look inside
          <span class="label-line"></span>
        </div>
        <p class="tour-sub">
          Three real DarkDune screens, filled in with sample data, showing
          how files get wired, stored, and worked on.
        </p>
      </div>

      <div class="tour-wrap">
        <div class="tour-tabs">
          <button
            v-for="(tab, i) in tourTabs"
            :key="tab.id"
            type="button"
            class="tour-tab"
            :class="{ 'is-active': activeTour === i }"
            @click="activeTour = i"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tour-window">
          <div class="tour-chrome">
            <span class="chrome-dot chrome-dot-r"></span>
            <span class="chrome-dot chrome-dot-y"></span>
            <span class="chrome-dot chrome-dot-g"></span>
            <span class="chrome-url">darkdune.app/{{ tourTabs[activeTour].path }}</span>
          </div>

          <!-- ── File & Document Connector ── -->
          <div class="tour-screen tour-screen-file" v-show="activeTour === 0">
            <div class="tour-screen-head">
              <div>
                <h4 class="tour-screen-title">File &amp; Document Connector</h4>
                <p class="tour-screen-hint">Drag from output to input to wire files together</p>
              </div>
              <div class="tour-screen-actions">
                <span class="tour-btn tour-btn-primary">+ New File</span>
                <span class="tour-btn">Add File</span>
                <span class="tour-btn">Clear Links</span>
              </div>
            </div>

            <div class="tour-canvas">
              <svg viewBox="0 0 100 60" class="tour-canvas-svg" preserveAspectRatio="none">
                <path d="M 20 14 C 32 20, 30 34, 42 38" class="tour-link-path" />
                <path d="M 55 38 C 64 30, 62 18, 74 14" class="tour-link-path" />
                <path d="M 82 20 C 88 30, 84 42, 76 48" class="tour-link-path" />
              </svg>

              <div class="tour-file-node" style="left: 6%; top: 12%;">
                <span class="tour-file-icon tour-file-icon--docx">DOCX</span>
                <span class="tour-file-name">Campaign_Brief.docx</span>
              </div>
              <div class="tour-file-node" style="left: 34%; top: 56%;">
                <span class="tour-file-icon tour-file-icon--jpg">JPG</span>
                <span class="tour-file-name">Product_Shots.jpg</span>
              </div>
              <div class="tour-file-node" style="left: 62%; top: 10%;">
                <span class="tour-file-icon tour-file-icon--xlsx">XLS</span>
                <span class="tour-file-name">Budget_Overview.xlsx</span>
              </div>
              <div class="tour-file-node" style="left: 70%; top: 62%;">
                <span class="tour-file-icon tour-file-icon--ppt">PPT</span>
                <span class="tour-file-name">Launch_Deck.pptx</span>
              </div>
            </div>

            <div class="tour-screen-foot">
              <span class="tour-conn-count">⟡ 3 connections</span>
              <span class="tour-conn-pill">1 → 2</span>
              <span class="tour-conn-pill">2 → 3</span>
              <span class="tour-conn-pill">3 → 4</span>
            </div>
          </div>

          <!-- ── Your Documents (Dashboard) ── -->
          <div class="tour-screen tour-screen-dash" v-show="activeTour === 1">
            <div class="tour-screen-head">
              <div>
                <h4 class="tour-screen-title">Your Documents</h4>
                <p class="tour-screen-hint">Every file opened in DarkDune, saved in native .dd format</p>
              </div>
              <div class="tour-screen-actions">
                <span class="tour-btn tour-btn-primary">+ New File</span>
                <span class="tour-btn">Add / Link Files</span>
              </div>
            </div>

            <div class="tour-doc-grid">
              <div class="tour-doc-card" v-for="doc in sampleDocs" :key="doc.name">
                <span class="tour-doc-icon"></span>
                <div class="tour-doc-meta">
                  <span class="tour-doc-name">{{ doc.name }}</span>
                  <span class="tour-doc-sub">.dd Document · {{ doc.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── AI Assistant ── -->
          <div class="tour-screen tour-screen-ai" v-show="activeTour === 2">
            <div class="tour-ai-layout">
              <div class="tour-ai-sidebar">
                <span class="tour-btn tour-btn-primary tour-btn-block">+ New conversation</span>
                <span class="tour-ai-convo">Link the Q3 report to proposal</span>
              </div>

              <div class="tour-ai-thread">
                <div class="tour-msg tour-msg-user">Can you link the Q3 report to the client proposal?</div>
                <div class="tour-msg tour-msg-bot">
                  Sure — I'll connect <strong>Budget_Overview.xlsx</strong> to
                  <strong>Client_Proposal_Draft.dd</strong> as a reference link.
                </div>
                <div class="tour-ai-action">
                  <span>⇢ Link the two files</span>
                  <span class="tour-btn tour-btn-primary tour-btn-sm">Confirm</span>
                  <span class="tour-btn tour-btn-sm">Cancel</span>
                </div>

                <div class="tour-msg tour-msg-user">Also summarize the brand guidelines doc.</div>
                <div class="tour-msg tour-msg-bot">
                  Here's a quick summary of <strong>Brand_Guidelines_Summary.dd</strong> —
                  covers tone, color palette, and logo usage rules.
                  <div class="tour-doc-preview">
                    <span class="tour-doc-preview-line" style="width: 80%;"></span>
                    <span class="tour-doc-preview-line" style="width: 60%;"></span>
                    <span class="tour-doc-preview-line" style="width: 70%;"></span>
                    <span class="tour-doc-preview-line" style="width: 45%;"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="how" id="how">
      <div class="section-inner">
        <div class="section-label">
          <span class="label-line"></span>
          A few names from the archive
          <span class="label-line"></span>
        </div>
        <p class="collab-sub">
          Some of these companies don't exist anymore. DarkDune still would have worked.
        </p>
      </div>

      <div class="logo-strip" aria-label="Vantar, Norrix, Halcyon Labs, Ferro Systems, Quill and Co, Meridian OS, Driftline">
        <div
          class="logo-track"
          :class="{ 'is-paused': stripPaused }"
        >
          <div
            class="logo-chip"
            v-for="(c, i) in [...archiveLogos, ...archiveLogos]"
            :key="'lg-' + i"
            :aria-hidden="i >= archiveLogos.length"
          >
            <span class="logo-mark" :class="'logo-mark--' + c.id" v-if="c.hasIcon">
              <svg v-if="c.id === 'norrix'" viewBox="0 0 24 24" class="logo-svg">
                <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
              </svg>
              <svg v-else-if="c.id === 'halcyon'" viewBox="0 0 24 24" class="logo-svg">
                <circle cx="12" cy="12" r="8" fill="none" stroke-width="2" />
              </svg>
              <svg v-else-if="c.id === 'quill'" viewBox="0 0 24 24" class="logo-svg">
                <path d="M4 20 C4 20 13 18 17 8 C18.5 4.5 20 4 20 4 C20 4 17.5 6.5 14.5 7.5 C7.5 9.5 4 20 4 20 Z" />
              </svg>
              <svg v-else-if="c.id === 'meridian'" viewBox="0 0 24 24" class="logo-svg">
                <circle cx="12" cy="12" r="9" fill="none" stroke-width="1.6" />
                <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke-width="1.6" />
                <line x1="3" y1="12" x2="21" y2="12" stroke-width="1.6" />
              </svg>
              <svg v-else-if="c.id === 'driftline'" viewBox="0 0 24 24" class="logo-svg">
                <path d="M2 14 Q7 6 12 14 T22 14" fill="none" stroke-width="2" />
              </svg>
            </span>

            <span class="logo-wordmark" :class="'logo-wordmark--' + c.id">
              <template v-if="c.stacked">
                <span class="wm-line">{{ c.stacked[0] }}</span>
                <span class="wm-line">{{ c.stacked[1] }}</span>
              </template>
              <template v-else>{{ c.name }}</template>
            </span>
          </div>
        </div>

        <button
          type="button"
          class="strip-toggle"
          @click="stripPaused = !stripPaused"
          :aria-label="stripPaused ? 'Play logo animation' : 'Pause logo animation'"
        >
          <svg v-if="!stripPaused" viewBox="0 0 24 24" class="toggle-icon">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="toggle-icon">
            <polygon points="7,4 20,12 7,20" />
          </svg>
        </button>
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
      inputFiles: [
        { label: 'DOCX', img: '/Images/Microsoft word icon.png' },
        { label: 'PPT', img: '/Images/Power point presentation icon.jpg' },
        { label: 'XLSX', img: '/Images/Excel spread sheet.png' },
        { label: 'IMG', img: '/Images/Normal.png' },
      ],
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
      activeTour: 0,
      tourTabs: [
        { id: 'file', label: 'File', path: 'startbuilding' },
        { id: 'dashboard', label: 'Dashboard', path: 'dashboard' },
        { id: 'ai', label: 'AI Assistant', path: 'assistant' },
      ],
      sampleDocs: [
        { name: 'Q3_Marketing_Plan', date: '19 Jul 2026' },
        { name: 'Client_Proposal_Draft', date: '19 Jul 2026' },
        { name: 'Team_Retro_Notes', date: '18 Jul 2026' },
        { name: 'Brand_Guidelines_Summary', date: '18 Jul 2026' },
        { name: 'Product_Roadmap_2026', date: '17 Jul 2026' },
      ],
      // Entirely invented brand marks — no real company, past or present,
      // is represented here. Styled as a "retired tech" archive strip.
      archiveLogos: [
        { id: 'vantar',     name: 'VANTAR',        hasIcon: false },
        { id: 'norrix',     name: 'NORRIX',        hasIcon: true },
        { id: 'halcyon',    name: 'Halcyon Labs',  hasIcon: true },
        { id: 'ferro',      name: 'FERRO SYSTEMS', hasIcon: false },
        { id: 'quill',      name: 'Quill & Co.',   hasIcon: true },
        { id: 'meridian',   name: 'Meridian OS',   hasIcon: true, stacked: ['Meridian', 'OS'] },
        { id: 'driftline',  name: 'driftline',     hasIcon: true },
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