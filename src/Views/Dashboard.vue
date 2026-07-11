<template>
  <div class="db-wrapper">
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <div class="db-container">

      <!-- ── Header ── -->
      <div class="page-header">
        <div class="page-header__left">
          
          <h2 class="page-title"><i>Your Documents</i></h2>
          <p class="page-subtitle">Every file you've opened in DarkDune Writer, saved in DarkDune's native <code>.dd</code> format</p>
        </div>
        <div class="page-header__right">
          <button class="btn-new" @click="$router.push('/editor')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            New File
          </button>
          <router-link to="/startbuilding" class="btn-ghost">
            <svg viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M12 3V15M12 3L7 8M12 3L17 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Add / Link Files
          </router-link>
        </div>
      </div>

      <!-- ── Global error ── -->
      <div v-if="globalError" class="alert alert-error">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ globalError }}
        <button class="alert-close" @click="globalError = ''">✕</button>
      </div>

      <!-- ── Loading ── -->
      <div v-if="isLoading" class="loading-overlay">
        <svg viewBox="0 0 24 24" fill="none" class="spin large-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
        <span>Loading your documents...</span>
      </div>

      <!-- ── Toolbar ── -->
      <div v-else class="db-toolbar">
        <div class="db-search">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input v-model="search" type="text" placeholder="Search documents..." />
        </div>
        <div class="db-count">{{ filteredDocs.length }} document{{ filteredDocs.length === 1 ? '' : 's' }}</div>
      </div>

      <!-- ── Empty state ── -->
      <div v-if="!isLoading && filteredDocs.length === 0" class="db-empty">
        <svg viewBox="0 0 18 22" fill="none" class="empty-icon"><path d="M10 1H3C1.895 1 1 1.895 1 3V19C1 20.105 1.895 21 3 21H15C16.105 21 17 20.105 17 19V8L10 1Z" stroke="currentColor" stroke-width="1.2"/><path d="M10 1V8H17" stroke="currentColor" stroke-width="1.2"/></svg>
        <p v-if="docs.length === 0">
          <strong>No documents yet.</strong><br/>
          Open any file from <router-link to="/startbuilding">Start Building</router-link> in DarkDune Writer and it'll show up here automatically.
        </p>
        <p v-else>No documents match "<strong>{{ search }}</strong>".</p>
      </div>

      <!-- ── Document grid ── -->
      <div v-else-if="!isLoading" class="db-grid">
        <div v-for="doc in filteredDocs" :key="doc.id" class="db-card" @click="openDoc(doc)">
          <div class="db-card__icon">
            <svg viewBox="0 0 18 22" fill="none"><path d="M10 1H3C1.895 1 1 1.895 1 3V19C1 20.105 1.895 21 3 21H15C16.105 21 17 20.105 17 19V8L10 1Z" fill="url(#dbDocGrad)"/><path d="M10 1V8H17" fill="#5a1208"/><defs><linearGradient id="dbDocGrad" x1="1" y1="1" x2="17" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs></svg>
          </div>

          <div class="db-card__body">
            <span v-if="renamingId !== doc.id" class="db-card__name" @dblclick.stop="startRename(doc)">{{ doc.name }}</span>
            <input
              v-else
              :ref="el => setRenameRef(el, doc.id)"
              v-model="renameValue"
              class="db-card__rename-input"
              @click.stop
              @blur="commitRename(doc)"
              @keydown.enter="commitRename(doc)"
              @keydown.escape="cancelRename"
            />
            <span class="db-card__meta">
              .dd Document
              <span class="db-dot">·</span>
              {{ formatDate(doc.updated_at || doc.created_at) }}
            </span>
          </div>

          <div class="db-card__actions">
            <button class="db-icon-btn" title="Rename" @click.stop="startRename(doc)">
              <svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.1022 19.5 3.5C19.8978 3.8978 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.1022 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="db-icon-btn db-icon-btn--danger" title="Delete" @click.stop="deleteDoc(doc)">
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth.js'

const BASE_URL = 'http://localhost:8000/api'

export default {
  name: 'Dashboard',

  data() {
    return {
      isLoading:   true,
      globalError: '',
      docs:        [],
      search:      '',
      renamingId:  null,
      renameValue: '',
      renameRefs:  {},
    }
  },

  computed: {
    filteredDocs() {
      const q = this.search.trim().toLowerCase()
      const sorted = [...this.docs].sort((a, b) =>
        new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
      )
      if (!q) return sorted
      return sorted.filter(d => (d.name || '').toLowerCase().includes(q))
    },
  },

  async mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    await this.loadDocs()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
  },

  methods: {
    async api(method, endpoint, body = null) {
      const token   = authService.getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      const res  = await fetch(`${BASE_URL}${endpoint}`, options)
      const data = await res.json()
      if (!res.ok) throw { status: res.status, data }
      return data
    },

    // Dashboard only ever shows native .dd DarkDune documents — the
    // editable copies created when a file is opened in the Writer.
    // Original uploaded files (pdf, docx, images, etc.) live on the
    // Start Building canvas instead, so nothing is listed twice.
    async loadDocs() {
      this.isLoading   = true
      this.globalError = ''
      try {
        const res = await this.api('GET', '/files')
        this.docs = (res.files || []).filter(f => f.extension === 'dd')
      } catch (err) {
        this.globalError = err?.data?.error || 'Could not load your documents. Make sure the backend is running.'
      } finally {
        this.isLoading = false
      }
    },

    openDoc(doc) {
      this.$router.push(`/editor/${doc.id}`)
    },

    startRename(doc) {
      this.renamingId  = doc.id
      this.renameValue = doc.name
      this.$nextTick(() => this.renameRefs[doc.id]?.select())
    },

    setRenameRef(el, id) {
      if (el) this.renameRefs[id] = el
    },

    cancelRename() {
      this.renamingId = null
    },

    async commitRename(doc) {
      if (this.renamingId !== doc.id) return
      const newName = this.renameValue.trim()
      this.renamingId = null
      if (!newName || newName === doc.name) return
      try {
        await this.api('PUT', `/files/${doc.id}`, { name: newName })
        doc.name = newName
      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to rename document.'
      }
    },

    async deleteDoc(doc) {
      if (!confirm(`Delete "${doc.name}"? This can't be undone.`)) return
      try {
        await this.api('DELETE', `/files/${doc.id}`)
        this.docs = this.docs.filter(d => d.id !== doc.id)
      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to delete document.'
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      if (Number.isNaN(d.getTime())) return ''
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    },

    // ── Background hex grid (matches Start Building's ambience) ──
    drawHexGrid() {
      const canvas = this.$refs.hexCanvas
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(192,57,43,0.05)'
      ctx.lineWidth = 1
      const size = 34
      const h = size * Math.sqrt(3)
      for (let y = -h; y < canvas.height + h; y += h * 0.75) {
        for (let x = -size; x < canvas.width + size; x += size * 1.5) {
          const offsetY = (Math.round(x / (size * 1.5)) % 2 === 0) ? 0 : h * 0.375
          this.drawHex(ctx, x, y + offsetY, size)
        }
      }
    },

    drawHex(ctx, cx, cy, size) {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const px = cx + size * Math.cos(angle)
        const py = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    },
  },
}
</script>

<style scoped>
:root {
  --bg:             #090909;
  --surface:        #0f0f0f;
  --card:           #141414;
  --raised:         #1a1a1a;
  --border:         #242424;
  --volcanic:       #c0392b;
  --volcanic-glow:  #e74c3c;
  --text-primary:   #ede8df;
  --text-secondary: #6e6a64;
  --text-muted:     #353330;
  --font-display:   'Cormorant Garamond', serif;
  --font-body:      'Syne', sans-serif;
}

.db-wrapper { position: relative; min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: var(--font-body); }
.hex-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.55; }
.db-container { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

.alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 1.25rem; }
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }
.alert-close { margin-left: auto; background: none; border: none; cursor: pointer; color: inherit; font-size: 13px; padding: 0 4px; opacity: 0.7; }
.alert-close:hover { opacity: 1; }

.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 5rem 0; color: var(--text-muted); font-size: 13px; }
.spin { animation: spin 0.9s linear infinite; }
.large-spin { width: 36px; height: 36px; color: var(--volcanic); }
@keyframes spin { to { transform: rotate(360deg); } }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
.page-header__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; padding-top: 0.5rem; }
.page-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 0.75rem; }
.breadcrumb-link { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
.breadcrumb-link:hover { color: var(--volcanic-glow); }
.breadcrumb-link svg { width: 13px; height: 13px; }
.breadcrumb-sep { width: 14px; height: 14px; color: var(--text-muted); }
.breadcrumb-current { font-size: 12px; color: var(--volcanic-glow); }
.page-title { font-family: var(--font-display); font-size: 2.4rem; font-weight: 600; margin: 0 0 6px; letter-spacing: 0.01em; }
.page-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6; }
.page-subtitle code { background: var(--raised); padding: 1px 5px; border-radius: 4px; color: var(--volcanic-glow); }

.btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); font-family: var(--font-body); font-size: 12px; font-weight: 600; text-decoration: none; cursor: pointer; transition: all 0.15s; }
.btn-ghost svg { width: 15px; height: 15px; }
.btn-ghost:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); background: rgba(231,76,60,0.05); }
.btn-new { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; background: var(--volcanic); border: 1px solid var(--volcanic); border-radius: 8px; color: #fff; font-family: var(--font-body); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.btn-new svg { width: 15px; height: 15px; }
.btn-new:hover { background: var(--volcanic-glow); border-color: var(--volcanic-glow); }

.db-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.db-search { display: flex; align-items: center; gap: 8px; padding: 9px 14px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; flex: 1; max-width: 340px; }
.db-search svg { width: 15px; height: 15px; color: var(--text-muted); flex-shrink: 0; }
.db-search input { background: none; border: none; outline: none; color: var(--text-primary); font-family: var(--font-body); font-size: 13px; width: 100%; }
.db-search input::placeholder { color: var(--text-muted); }
.db-count { font-size: 12px; color: var(--text-muted); }

.db-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 5rem 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 14px; text-align: center; }
.empty-icon { width: 40px; height: 48px; color: var(--text-muted); opacity: 0.4; }
.db-empty p { font-size: 13px; color: var(--text-muted); line-height: 1.7; max-width: 340px; margin: 0; }
.db-empty p strong { color: var(--text-secondary); }
.db-empty a { color: var(--volcanic-glow); text-decoration: none; }
.db-empty a:hover { text-decoration: underline; }

.db-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

.db-card { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--card); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s; }
.db-card:hover { border-color: rgba(192,57,43,0.4); box-shadow: 0 4px 20px rgba(192,57,43,0.12); transform: translateY(-1px); }

.db-card__icon { flex-shrink: 0; width: 28px; height: 34px; display: flex; align-items: center; }
.db-card__icon svg { width: 100%; height: 100%; filter: drop-shadow(0 1px 3px rgba(192,57,43,0.3)); }

.db-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.db-card__name { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: text; }
.db-card__rename-input { background: rgba(255,255,255,0.06); border: 1px solid var(--volcanic); border-radius: 4px; color: var(--text-primary); font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 2px 6px; outline: none; width: 100%; }
.db-card__meta { font-size: 10px; color: var(--text-muted); letter-spacing: 0.02em; }
.db-dot { margin: 0 4px; }

.db-card__actions { display: flex; gap: 4px; flex-shrink: 0; }
.db-icon-btn { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: none; border: none; border-radius: 6px; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.db-icon-btn svg { width: 13px; height: 13px; }
.db-icon-btn:hover { background: var(--raised); color: var(--text-secondary); }
.db-icon-btn--danger:hover { color: var(--volcanic-glow); background: rgba(231,76,60,0.1); }

@media (max-width: 700px) {
  .db-container { padding: 1.5rem 1rem 3rem; }
  .page-title { font-size: 1.8rem; }
  .db-grid { grid-template-columns: 1fr; }
}
</style>