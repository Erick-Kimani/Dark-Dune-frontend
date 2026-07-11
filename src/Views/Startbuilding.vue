<template>
  <div class="sb-wrapper">
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <div class="sb-container">

      <!-- ── Header ── -->
      <div class="page-header">
        <div class="page-header__left">
         
          <h1 class="page-title"><i>Start Building</i></h1>
          <p class="page-subtitle">Link files and documents from your device using connectors</p>
        </div>
        
      </div>

      <!-- ── Global error ── -->
      <div v-if="globalError" class="alert alert-error">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ globalError }}
        <button class="alert-close" @click="globalError = ''">✕</button>
      </div>

      <!-- ── Loading overlay ── -->
      <div v-if="isLoading" class="loading-overlay">
        <svg viewBox="0 0 24 24" fill="none" class="spin large-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
        <span>Loading your files...</span>
      </div>

      <!-- ── Node Linker ── -->
      <div class="linker-section" v-show="!isLoading">

        <div class="linker-header">
          <div class="linker-header__left">
            <h2 class="panel-label">File & Document Connector</h2>
            <p class="linker-subtitle">
              Drag from the <span class="hint-port out"></span> output port to the
              <span class="hint-port in"></span> input port to wire files together
              · <strong>Click</strong> a node to open and edit it
            </p>
          </div>
          <div class="linker-controls">
            <button class="btn-control btn-new" @click="$router.push('/editor')" title="Start a blank document from scratch">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              New File
            </button>
            <label class="btn-control btn-upload" title="Register a file from your device">
              <svg viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M12 3V15M12 3L7 8M12 3L17 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Add File
              <input type="file" class="file-input" @change="handleFileSelect" :accept="acceptedTypes" ref="fileInput"/>
            </label>
            <button class="btn-control" @click="clearAllLinks" :disabled="connections.length === 0 || isBusy">
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Clear Links
            </button>
            <div class="link-mode-toggle">
              <span class="link-mode-label">Link Mode</span>
              <button class="toggle-btn" :class="{ active: linkMode }" @click="linkMode = !linkMode">
                <span class="toggle-knob"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div
          class="linker-canvas"
          ref="linkerCanvas"
          @mousemove="onCanvasMouseMove"
          @mouseup="onCanvasMouseUp"
          @mouseleave="onCanvasMouseUp"
        >
          <!-- SVG connections layer -->
          <svg class="connections-svg">
            <defs>
              <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#c0392b" stop-opacity="0.2"/>
                <stop offset="50%"  stop-color="#e74c3c" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#c0392b" stop-opacity="0.2"/>
                <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="1.8s" repeatCount="indefinite"/>
              </linearGradient>
              <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g v-for="(conn, i) in connections" :key="'conn-' + i">
              <path :d="getBezier(conn)" fill="none" stroke="#242424" stroke-width="5" stroke-linecap="round"/>
              <path :d="getBezier(conn)" fill="none" stroke="url(#wireGrad)" stroke-width="2" stroke-linecap="round" filter="url(#wireGlow)" class="wire-animated"/>
              <g :transform="`translate(${getMidPoint(conn).x}, ${getMidPoint(conn).y})`" class="conn-delete" @click="removeConnection(conn)" style="cursor:pointer">
                <circle r="9" fill="#1a1a1a" stroke="#c0392b" stroke-width="1.2"/>
                <path d="M-3.5-3.5L3.5 3.5M-3.5 3.5L3.5-3.5" stroke="#e74c3c" stroke-width="1.5" stroke-linecap="round"/>
              </g>
            </g>
            <path v-if="draggingWire" :d="getDragBezier()" fill="none" stroke="#e74c3c" stroke-width="1.5" stroke-dasharray="7 4" stroke-linecap="round" opacity="0.75"/>
          </svg>

          <!-- File Nodes -->
          <div
            v-for="node in nodes"
            :key="node.id"
            class="file-node"
            :class="{
              selected:    selectedNode === node.id,
              linking:     linkMode && wireFrom === node.id,
              'is-source': connections.some(c => c.from === node.id),
              'is-target': connections.some(c => c.to   === node.id),
            }"
            :style="{ left: node.x + 'px', top: node.y + 'px' }"
            @mousedown.stop="startDrag(node, $event)"
            @click.stop="onNodeClick(node, $event)"
          >
            <!-- Output port -->
            <div class="port port-out" :class="{ active: linkMode }" @mousedown.stop="startWire(node, $event)" title="Drag to connect">
              <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/></svg>
            </div>
            <!-- Input port -->
            <div class="port port-in" :class="{ active: linkMode && draggingWire && wireFrom !== node.id }" @mouseup.stop="endWire(node)" title="Drop connection here">
              <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" fill="currentColor"/></svg>
            </div>

            <!-- File icon -->
            <div class="node-icon">
              <svg v-if="node.category === 'image'" viewBox="0 0 22 18" fill="none">
                <rect x="1" y="1" width="20" height="16" rx="2" fill="url(#nodeImg)"/>
                <circle cx="7" cy="7" r="2" fill="rgba(255,255,255,0.3)"/>
                <path d="M1 13L6 8L10 12L14 9L21 14" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round"/>
                <defs><linearGradient id="nodeImg" x1="1" y1="1" x2="21" y2="17" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs>
              </svg>
              <svg v-else-if="node.category === 'spreadsheet'" viewBox="0 0 18 20" fill="none">
                <rect x="1" y="1" width="16" height="18" rx="2" fill="url(#nodeSheet)"/>
                <line x1="1" y1="7" x2="17" y2="7" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <line x1="1" y1="12" x2="17" y2="12" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <line x1="7" y1="7" x2="7" y2="19" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <defs><linearGradient id="nodeSheet" x1="1" y1="1" x2="17" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs>
              </svg>
              <svg v-else viewBox="0 0 18 22" fill="none">
                <path d="M10 1H3C1.895 1 1 1.895 1 3V19C1 20.105 1.895 21 3 21H15C16.105 21 17 20.105 17 19V8L10 1Z" fill="url(#nodeDoc)"/>
                <path d="M10 1V8H17" fill="#5a1208"/>
                <defs><linearGradient id="nodeDoc" x1="1" y1="1" x2="17" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs>
              </svg>
            </div>

            <!-- Body -->
            <div class="node-body">
              <span class="node-name" :title="node.label">{{ node.label }}</span>
              <span class="node-type">{{ node.extension?.toUpperCase() || node.category }}</span>
            </div>

            <div class="node-meta">{{ node.human_size || formatSize(node.size) }}</div>

            <!-- Open button (visible on hover) -->
            <button class="node-open" @click.stop="openViewer(node)" title="Open file">
              <svg viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
            </button>

            <!-- Remove button -->
            <button class="node-remove" @click.stop="removeNode(node)" title="Delete file" :disabled="isBusy">
              <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="nodes.length === 0" class="linker-empty">
            <svg viewBox="0 0 24 24" fill="none" class="empty-icon">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13 2V9H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>No files yet</p>
            <p class="empty-sub">Click <strong>Add File</strong> to register a file from your device</p>
          </div>

          <!-- Link mode hint -->
          <div v-if="linkMode && nodes.length > 1" class="link-mode-hint">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Drag from <span class="hint-port out"></span> output to <span class="hint-port in"></span> input to connect
          </div>

          <!-- Busy overlay -->
          <div v-if="isBusy" class="canvas-busy">
            <svg viewBox="0 0 24 24" fill="none" class="spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
          </div>
        </div>

        <!-- Connection list -->
        <div v-if="connections.length > 0" class="connection-list">
          <div class="connection-list__header">
            <svg viewBox="0 0 24 24" fill="none"><path d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6898C16.4231 14.4393 17.0331 14.0471 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33397 21.9434 7.02299C21.932 5.71201 21.4061 4.45794 20.4791 3.53087C19.5521 2.6038 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997M14 11C13.5705 10.4259 13.0226 9.95078 12.3934 9.60703C11.7642 9.26328 11.0684 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05963 8.24861 9.31018C7.57685 9.56073 6.96684 9.95293 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59379 19.5421 3.52086 20.4691C4.44793 21.3962 5.702 21.922 7.013 21.9334C8.324 21.9448 9.58701 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ connections.length }} connection{{ connections.length !== 1 ? 's' : '' }}
          </div>
          <div class="connection-chips">
            <div v-for="(conn, i) in connections" :key="'chip-' + i" class="connection-chip">
              <span class="chip-from">{{ getNodeLabel(conn.from) }}</span>
              <svg viewBox="0 0 24 24" fill="none" class="chip-arrow"><path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="chip-to">{{ getNodeLabel(conn.to) }}</span>
              <button class="chip-remove" @click="removeConnection(conn)" :disabled="isBusy">
                <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="linker-footer">
          <p class="footer-note">
            <svg viewBox="0 0 24 24" fill="none"><path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            {{ nodes.length }} file{{ nodes.length !== 1 ? 's' : '' }}, {{ connections.length }} connection{{ connections.length !== 1 ? 's' : '' }}
          </p>
          <div class="footer-actions">
            <button class="btn-ghost" @click="$router.push('/')">Cancel</button>
          </div>
        </div>

      </div>
    </div>

    <!-- ── File Viewer Modal ── -->
    <FileViewerModal
      :show="viewerOpen"
      :file="viewerFile"
      @close="closeViewer"
      @updated="onFileUpdated"
    />

  </div>
</template>

<script>
import { authService } from '@/services/auth.js'
import FileViewerModal from '@/Components/FileViewerModal.vue'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const BASE_URL = 'http://localhost:8000/api'

export default {
  name: 'StartBuilding',
  components: { FileViewerModal },

  data() {
    return {
      isLoading:   true,
      isBusy:      false,
      globalError: '',
      linkMode:    false,

      nodes:       [],
      connections: [],

      draggingNode:  null,
      dragOffsetX:   0,
      dragOffsetY:   0,
      draggingWire:  false,
      wireFrom:      null,
      wireMouseX:    0,
      wireMouseY:    0,
      selectedNode:  null,
      isDragging:    false,   // tracks whether mousedown became a drag

      // Viewer modal
      viewerOpen: false,
      viewerFile: null,

      acceptedTypes: '.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg',
    }
  },

  async mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    this.animateHex()
    await this.loadFilesAndLinks()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
    cancelAnimationFrame(this._hexRaf)
  },

  methods: {

    // ── API helper ──
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

    // ── Load data ──
    // Opening a file in DarkDune Writer creates a linked native .dd copy
    // (see WordEditor's loadFile -> convert-to-dd). That .dd copy is an
    // editing artifact, not something the user uploaded — showing both
    // it and the original on this canvas reads as duplicate files, so
    // Start Building only ever renders the original, real-format files.
    // The .dd copies are surfaced in the Dashboard instead.
    async loadFilesAndLinks() {
      this.isLoading   = true
      this.globalError = ''
      try {
        const [filesRes, linksRes] = await Promise.all([
          this.api('GET', '/files'),
          this.api('GET', '/file-links'),
        ])

        const canvas = this.$refs.linkerCanvas
        const colW   = 200, rowH = 110
        const cols   = Math.max(1, Math.floor((canvas?.offsetWidth || 800) / colW))

        // Also excludes "New File" seed records (see WordEditor's
        // saveDocument) — internal stepping stones, not real uploads.
        // Checked by name marker first since that's guaranteed to round
        // -trip through the backend; tags are checked too in case the
        // backend does persist them, but aren't relied on alone.
        const realFiles = (filesRes.files || []).filter(file => {
          if (file.extension === 'dd') return false
          if (String(file.name || '').startsWith('__dd_seed__')) return false
          if ((file.tags || []).includes('__dd_seed__')) return false
          return true
        })

        this.nodes = realFiles.map((file, i) => ({
          ...file,
          x: 40 + (i % cols) * colW,
          y: 30 + Math.floor(i / cols) * rowH,
        }))

        const visibleIds = new Set(this.nodes.map(n => n.id))
        this.connections = (linksRes.links || [])
          .filter(link => visibleIds.has(link.source_file_id) && visibleIds.has(link.target_file_id))
          .map(link => ({
            id:   link.id,
            from: link.source_file_id,
            to:   link.target_file_id,
          }))

      } catch (err) {
        this.globalError = err?.data?.error || 'Could not load files. Make sure the backend is running.'
      } finally {
        this.isLoading = false
      }
    },

    // ── File upload ──
    async handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      this.isBusy      = true
      this.globalError = ''

      try {
        const ext     = file.name.split('.').pop().toLowerCase()
        const payload = {
          name:          file.name.replace(/\.[^/.]+$/, ''),
          original_name: file.name,
          local_path:    file.name,
          mime_type:     file.type || 'application/octet-stream',
          extension:     ext,
          size:          file.size,
          description:   '',
          tags:          [],
        }

        // Extract real text/HTML in the browser for formats DarkDune
        // knows how to read, so it can carry over into the .dd copy
        // instead of a placeholder note. The original file itself is
        // never modified by this — we just read it once, here.
        const extracted = await this.extractContent(file, ext)
        if (extracted) {
          payload.content = extracted
        }

        const res     = await this.api('POST', '/files', payload)
        const newFile = res.file

        const canvas = this.$refs.linkerCanvas
        const maxX   = (canvas?.offsetWidth  || 800) - 200
        const maxY   = (canvas?.offsetHeight || 420) - 100

        this.nodes.push({
          ...newFile,
          x: Math.max(20, Math.floor(Math.random() * maxX)),
          y: Math.max(20, Math.floor(Math.random() * maxY)),
        })

      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to register file. Check the file type.'
      } finally {
        this.isBusy = false
        if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      }
    },

    // ── Client-side content extraction ──
    // Best-effort only: failures here are swallowed (logged, not thrown)
    // so a broken/unsupported file still registers normally — it just
    // won't have pre-extracted content, and convert-to-dd will fall
    // back to a placeholder note for it instead.
    //
    // Only covers extensions FileController's allowedExtensions() /
    // allowedMimeTypes() actually accept — anything else 422s before
    // this code would ever run, so there's no point extracting for it.
    async extractContent(file, ext) {
      try {
        if (ext === 'docx') {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          return result.value || null
        }

        if (ext === 'txt') {
          const text = await file.text()
          return this.textToParagraphs(text)
        }

        if (ext === 'rtf') {
          const text = await file.text()
          return this.textToParagraphs(this.rtfToPlainText(text))
        }

        if (ext === 'csv') {
          const text = await file.text()
          return this.csvToTable(text)
        }

        if (ext === 'xls' || ext === 'xlsx') {
          return await this.spreadsheetToHtml(file)
        }

        if (ext === 'pdf') {
          return await this.pdfToHtml(file)
        }

        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
          return await this.imageToHtml(file)
        }

        if (ext === 'svg') {
          const text = await file.text()
          return `<p>${text.replace(/<script[\s\S]*?<\/script>/gi, '')}</p>`
        }

        return null
      } catch (err) {
        console.error('Content extraction failed, continuing without it', err)
        return null
      }
    },

    // Plain text -> <p> per line/paragraph
    textToParagraphs(text) {
      return text
        .split(/\r?\n\r?\n|\r?\n/)
        .map(line => `<p>${this.escapeHtml(line) || '<br>'}</p>`)
        .join('')
    },

    // Strip RTF control words/groups down to readable plain text
    rtfToPlainText(rtf) {
      return rtf
        .replace(/\\par[d]?/g, '\n')
        .replace(/\{\\[^{}]*\}/g, '')
        .replace(/\\'[0-9a-fA-F]{2}/g, '')
        .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
        .replace(/[{}]/g, '')
        .trim()
    },

    // CSV -> an editable HTML table, same markup the editor's own
    // "Insert table" tool produces
    csvToTable(text) {
      const rows = text.split(/\r?\n/).filter(r => r.length)
      if (!rows.length) return null
      let html = '<table class="we-doc-table"><tbody>'
      for (const row of rows) {
        const cells = row.split(',')
        html += '<tr>' + cells.map(c => `<td>${this.escapeHtml(c.trim())}</td>`).join('') + '</tr>'
      }
      html += '</tbody></table><p><br></p>'
      return html
    },

    // xls / xlsx / ods -> HTML table via SheetJS (first sheet)
    async spreadsheetToHtml(file) {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[firstSheetName]
      if (!sheet) return null
      const tableHtml = XLSX.utils.sheet_to_html(sheet, { id: undefined, editable: false })
      // Re-tag the generated <table> so it picks up the editor's styling
      return tableHtml.replace('<table', '<table class="we-doc-table"') + '<p><br></p>'
    },

    // PDF -> paragraphs of extracted text, one page at a time, via pdf.js
    async pdfToHtml(file) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let html = ''
      const maxPages = Math.min(pdf.numPages, 40) // guard against huge files
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const text = content.items.map(item => item.str).join(' ')
        if (text.trim()) html += `<p>${this.escapeHtml(text.trim())}</p>`
        if (i < maxPages) html += '<p><br></p>'
      }
      return html || null
    },

    // Images -> embedded as an editable <img> so they open directly
    // inside the Word editor instead of just showing a placeholder note
    async imageToHtml(file) {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      return `<p><img src="${dataUrl}" class="we-doc-img" style="max-width:100%;height:auto;" alt="${this.escapeHtml(file.name)}"/></p><p><br></p>`
    },

    escapeHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },

    // ── Remove node ──
    async removeNode(node) {
      if (!confirm(`Delete "${node.label}" and all its connections?`)) return
      this.isBusy      = true
      this.globalError = ''
      try {
        await this.api('DELETE', `/files/${node.id}`)
        this.nodes       = this.nodes.filter(n => n.id !== node.id)
        this.connections = this.connections.filter(c => c.from !== node.id && c.to !== node.id)
        if (this.selectedNode === node.id) this.selectedNode = null
      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to delete file.'
      } finally {
        this.isBusy = false
      }
    },

    // ── Remove connection ──
    async removeConnection(conn) {
      this.isBusy      = true
      this.globalError = ''
      try {
        await this.api('DELETE', `/file-links/${conn.id}`)
        this.connections = this.connections.filter(c => c.id !== conn.id)
      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to remove connection.'
      } finally {
        this.isBusy = false
      }
    },

    // ── Clear all connections ──
    async clearAllLinks() {
      if (!confirm('Remove all connections? Files will not be deleted.')) return
      this.isBusy      = true
      this.globalError = ''
      try {
        await Promise.all(this.connections.map(conn => this.api('DELETE', `/file-links/${conn.id}`)))
        this.connections = []
      } catch (err) {
        this.globalError = err?.data?.error || 'Failed to clear connections.'
      } finally {
        this.isBusy = false
      }
    },

    // ── Node drag ──
    startDrag(node, e) {
      if (this.draggingWire) return
      this.isDragging   = false
      this.draggingNode = node
      this.dragOffsetX  = e.clientX - node.x
      this.dragOffsetY  = e.clientY - node.y
    },

    onCanvasMouseMove(e) {
      const canvas = this.$refs.linkerCanvas
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()

      if (this.draggingNode) {
        const newX = e.clientX - this.dragOffsetX
        const newY = e.clientY - this.dragOffsetY
        // Mark as dragging if moved more than 4px
        if (Math.abs(newX - this.draggingNode.x) > 4 || Math.abs(newY - this.draggingNode.y) > 4) {
          this.isDragging = true
        }
        this.draggingNode.x = Math.max(0, Math.min(newX, canvas.offsetWidth  - 165))
        this.draggingNode.y = Math.max(0, Math.min(newY, canvas.offsetHeight - 80))
      }

      if (this.draggingWire) {
        this.wireMouseX = e.clientX - rect.left
        this.wireMouseY = e.clientY - rect.top
      }
    },

    onCanvasMouseUp() {
      this.draggingNode = null
      if (this.draggingWire) {
        this.draggingWire = false
        this.wireFrom     = null
      }
    },

    // ── Node click — open viewer only if not dragging ──
    onNodeClick(node, e) {
      if (this.isDragging) {
        this.isDragging = false
        return
      }
      // If link mode is on, clicking a node selects it for wiring
      if (this.linkMode) {
        this.selectedNode = this.selectedNode === node.id ? null : node.id
        return
      }
      // Normal click — open viewer
      this.openViewer(node)
    },

    // ── Wire drawing ──
    startWire(node, e) {
      e.stopPropagation()
      const canvas = this.$refs.linkerCanvas
      const rect   = canvas.getBoundingClientRect()
      this.wireFrom     = node.id
      this.draggingWire = true
      this.wireMouseX   = e.clientX - rect.left
      this.wireMouseY   = e.clientY - rect.top
    },

    async endWire(targetNode) {
      if (!this.draggingWire || !this.wireFrom) return
      const fromId = this.wireFrom
      this.draggingWire = false
      this.wireFrom     = null

      if (fromId === targetNode.id) return

      const exists = this.connections.some(c => c.from === fromId && c.to === targetNode.id)
      if (exists) return

      this.isBusy      = true
      this.globalError = ''
      try {
        const res = await this.api('POST', '/file-links', {
          source_file_id: fromId,
          target_file_id: targetNode.id,
        })
        this.connections.push({
          id:   res.link.id,
          from: res.link.source_file_id,
          to:   res.link.target_file_id,
        })
      } catch (err) {
        if (err?.status === 409) {
          this.globalError = 'These files are already connected.'
        } else {
          this.globalError = err?.data?.error || 'Failed to create connection.'
        }
      } finally {
        this.isBusy = false
      }
    },

    // ── Viewer modal ──
    openViewer(node) {
      this.viewerFile = node
      this.viewerOpen = true
    },

    closeViewer() {
      this.viewerOpen = false
      this.viewerFile = null
    },

    onFileUpdated(updatedFile) {
      // Sync updated node back into the canvas
      const idx = this.nodes.findIndex(n => n.id === updatedFile.id)
      if (idx !== -1) {
        this.nodes[idx] = {
          ...this.nodes[idx],
          ...updatedFile,
          x: this.nodes[idx].x,
          y: this.nodes[idx].y,
        }
      }
    },

    // ── Bezier paths ──
    getNodeOutPort(id) {
      const node = this.nodes.find(n => n.id === id)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x + 160, y: node.y + 38 }
    },

    getNodeInPort(id) {
      const node = this.nodes.find(n => n.id === id)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x, y: node.y + 38 }
    },

    getBezier(conn) {
      const from = this.getNodeOutPort(conn.from)
      const to   = this.getNodeInPort(conn.to)
      const dx   = Math.max(60, Math.abs(to.x - from.x) * 0.5)
      return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
    },

    getDragBezier() {
      const from = this.getNodeOutPort(this.wireFrom)
      const to   = { x: this.wireMouseX, y: this.wireMouseY }
      const dx   = Math.max(40, Math.abs(to.x - from.x) * 0.5)
      return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
    },

    getMidPoint(conn) {
      const from = this.getNodeOutPort(conn.from)
      const to   = this.getNodeInPort(conn.to)
      return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
    },

    getNodeLabel(id) {
      return this.nodes.find(n => n.id === id)?.label || String(id)
    },

    formatSize(bytes) {
      if (!bytes) return ''
      if (bytes < 1024)    return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    },

    // ── Hex background ──
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
      let tick  = 0
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const size = 36, w = size * 2, h = Math.sqrt(3) * size
        const cols = Math.ceil(canvas.width  / w) + 2
        const rows = Math.ceil(canvas.height / h) + 2
        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x     = col * w * 0.75
            const y     = row * h + (col % 2 === 0 ? 0 : h / 2)
            const dist  = Math.sqrt(Math.pow(x - canvas.width/2, 2) + Math.pow(y - canvas.height/2, 2))
            const max   = Math.sqrt(Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2))
            const pulse = Math.sin(tick * 0.015 + dist * 0.008) * 0.5 + 0.5
            const alpha = (1 - dist / max) * 0.18 * pulse + 0.04
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i - Math.PI / 6
              const px = x + size * 0.88 * Math.cos(angle)
              const py = y + size * 0.88 * Math.sin(angle)
              i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
            }
            ctx.closePath()
            ctx.strokeStyle = `rgba(192, 57, 43, ${alpha})`
            ctx.lineWidth   = 0.8
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
  --text-primary:   #ede8df;
  --text-secondary: #6e6a64;
  --text-muted:     #353330;
  --font-display:   'Cormorant Garamond', serif;
  --font-body:      'Syne', sans-serif;
}

.sb-wrapper { position: relative; min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: var(--font-body); }
.hex-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.55; }
.sb-container { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

.alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 1.25rem; }
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }
.alert-close { margin-left: auto; background: none; border: none; cursor: pointer; color: inherit; font-size: 13px; padding: 0 4px; opacity: 0.7; }
.alert-close:hover { opacity: 1; }

.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 5rem 0; color: var(--text-muted); font-size: 13px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; }
.page-header__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; padding-top: 0.5rem; }
.page-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 0.75rem; }
.breadcrumb-link { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
.breadcrumb-link:hover { color: var(--volcanic-glow); }
.breadcrumb-link svg { width: 13px; height: 13px; }
.breadcrumb-sep { width: 14px; height: 14px; color: var(--text-muted); }
.breadcrumb-current { font-size: 12px; color: var(--volcanic-glow); }
.page-title { font-family: var(--font-display); font-size: 2.4rem; font-weight: 600; margin: 0 0 6px; letter-spacing: 0.01em; }
.page-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6; }

.btn-ghost { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: transparent; border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px; font-family: var(--font-body); font-size: 13px; cursor: pointer; transition: all 0.2s; }
.btn-ghost svg { width: 14px; height: 14px; }
.btn-ghost:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

.btn-control { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-control svg { width: 13px; height: 13px; }
.btn-control:hover:not(:disabled) { border-color: var(--volcanic-glow); color: var(--volcanic-glow); background: rgba(231,76,60,0.05); }
.btn-control:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-upload { position: relative; cursor: pointer; }
.btn-upload:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); background: rgba(231,76,60,0.05); }
.btn-new { background: var(--volcanic); border-color: var(--volcanic); color: #fff; }
.btn-new:hover:not(:disabled) { background: var(--volcanic-glow); border-color: var(--volcanic-glow); color: #fff; }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }

.linker-section { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.linker-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); gap: 1rem; flex-wrap: wrap; }
.panel-label { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin: 0; position: relative; padding-bottom: 0.5rem; }
.panel-label::after { content: ''; position: absolute; bottom: 0; left: 0; width: 24px; height: 1px; background: var(--volcanic); }
.linker-subtitle { font-size: 12px; color: var(--text-muted); margin: 6px 0 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.linker-subtitle strong { color: var(--text-secondary); }
.linker-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.hint-port { display: inline-block; width: 10px; height: 10px; border-radius: 50%; vertical-align: middle; flex-shrink: 0; }
.hint-port.out { border: 1.5px solid var(--volcanic-glow); }
.hint-port.in  { background: var(--volcanic-glow); }

.link-mode-toggle { display: flex; align-items: center; gap: 8px; padding: 5px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; }
.link-mode-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
.toggle-btn { position: relative; width: 32px; height: 18px; background: var(--border); border: none; border-radius: 9px; cursor: pointer; transition: background 0.2s; padding: 0; }
.toggle-btn.active { background: var(--volcanic); }
.toggle-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: white; transition: transform 0.2s; display: block; }
.toggle-btn.active .toggle-knob { transform: translateX(14px); }

.linker-canvas { position: relative; width: 100%; height: 440px; background: radial-gradient(circle at 15% 50%, rgba(192,57,43,0.05) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgba(192,57,43,0.03) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(255,255,255,0.018) 29px, rgba(255,255,255,0.018) 30px), repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(255,255,255,0.018) 29px, rgba(255,255,255,0.018) 30px); overflow: hidden; cursor: default; user-select: none; }

.connections-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.connections-svg .conn-delete { pointer-events: all; }
.wire-animated { stroke-dasharray: 200; animation: wireDash 2s linear infinite; }
@keyframes wireDash { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }

.file-node { position: absolute; display: flex; align-items: center; gap: 10px; padding: 9px 14px 9px 12px; background: var(--raised); border: 1px solid var(--border); border-radius: 8px; width: 165px; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; box-shadow: 0 2px 12px rgba(0,0,0,0.45); }
.file-node:hover { border-color: rgba(192,57,43,0.4); box-shadow: 0 4px 20px rgba(192,57,43,0.15); }
.file-node.selected { border-color: var(--volcanic); box-shadow: 0 0 0 2px rgba(192,57,43,0.25), 0 4px 20px rgba(192,57,43,0.2); }
.file-node.linking { border-color: var(--volcanic-glow); box-shadow: 0 0 16px rgba(231,76,60,0.4); }
.file-node.is-source { border-left: 2px solid var(--volcanic); }
.file-node.is-target { border-right: 2px solid var(--volcanic); }

.port { position: absolute; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.15s; z-index: 2; }
.port svg { width: 10px; height: 10px; }
.port-out { right: -7px; background: var(--card); border: 1.5px solid var(--border); color: var(--text-muted); cursor: crosshair; }
.port-out:hover, .port-out.active { border-color: var(--volcanic-glow); color: var(--volcanic-glow); background: rgba(231,76,60,0.12); box-shadow: 0 0 8px rgba(231,76,60,0.45); }
.port-in { left: -7px; background: var(--card); border: 1.5px solid var(--border); color: var(--border); cursor: cell; }
.port-in.active { border-color: var(--volcanic-glow); color: var(--volcanic-glow); background: rgba(231,76,60,0.12); box-shadow: 0 0 8px rgba(231,76,60,0.4); animation: portPulse 0.8s ease-in-out infinite; }
@keyframes portPulse { 0%, 100% { box-shadow: 0 0 6px rgba(231,76,60,0.35); } 50% { box-shadow: 0 0 14px rgba(231,76,60,0.7); } }

.node-icon { flex-shrink: 0; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; }
.node-icon svg { width: 22px; height: 18px; filter: drop-shadow(0 1px 3px rgba(192,57,43,0.3)); }
.node-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.node-name { font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node-type { font-size: 9px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; }
.node-meta { position: absolute; bottom: 4px; right: 8px; font-size: 8px; color: var(--text-muted); letter-spacing: 0.04em; }

/* Open & Remove buttons — shown on hover */
.node-open, .node-remove { display: none; position: absolute; background: none; border: none; cursor: pointer; padding: 2px; transition: color 0.15s; border-radius: 3px; }
.node-open svg, .node-remove svg { width: 9px; height: 9px; }
.node-open { top: 4px; right: 18px; color: var(--text-muted); }
.node-open:hover { color: var(--volcanic-glow); background: rgba(231,76,60,0.1); }
.node-remove { top: 4px; right: 5px; color: var(--text-muted); }
.node-remove:hover { color: var(--volcanic-glow); background: rgba(231,76,60,0.1); }
.file-node:hover .node-open,
.file-node:hover .node-remove { display: flex; }
.file-node:hover .node-meta { display: none; }

.linker-empty { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; pointer-events: none; }
.empty-icon { width: 44px; height: 44px; color: var(--text-muted); opacity: 0.35; }
.linker-empty p { font-size: 13px; color: var(--text-muted); text-align: center; max-width: 300px; line-height: 1.65; }
.linker-empty p strong { color: var(--text-secondary); }
.empty-sub { font-size: 12px !important; }

.link-mode-hint { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 7px 16px; background: rgba(9,9,9,0.88); border: 1px solid rgba(231,76,60,0.3); border-radius: 20px; font-size: 11px; color: var(--text-secondary); white-space: nowrap; backdrop-filter: blur(8px); pointer-events: none; }
.link-mode-hint svg { width: 13px; height: 13px; color: var(--volcanic-glow); }

.canvas-busy { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(9,9,9,0.35); backdrop-filter: blur(2px); pointer-events: none; }
.canvas-busy svg { width: 28px; height: 28px; color: var(--volcanic-glow); }

.connection-list { padding: 1rem 1.5rem; border-top: 1px solid var(--border); background: var(--surface); }
.connection-list__header { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; }
.connection-list__header svg { width: 14px; height: 14px; color: var(--volcanic); }
.connection-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.connection-chip { display: flex; align-items: center; gap: 6px; padding: 5px 8px 5px 12px; background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.2); border-radius: 6px; font-size: 11px; }
.chip-from, .chip-to { font-weight: 600; color: var(--text-primary); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chip-arrow { width: 12px; height: 12px; color: var(--volcanic); flex-shrink: 0; }
.chip-remove { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px; display: flex; transition: color 0.15s; margin-left: 2px; }
.chip-remove svg { width: 9px; height: 9px; }
.chip-remove:hover { color: var(--volcanic-glow); }
.chip-remove:disabled { opacity: 0.35; cursor: not-allowed; }

.linker-footer { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-top: 1px solid var(--border); background: var(--card); flex-wrap: wrap; gap: 1rem; }
.footer-note { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-muted); }
.footer-note svg { width: 14px; height: 14px; color: var(--volcanic); flex-shrink: 0; }
.footer-actions { display: flex; gap: 10px; }

.spin { animation: spin 0.9s linear infinite; }
.large-spin { width: 36px; height: 36px; color: var(--volcanic); }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 700px) {
  .linker-header { flex-direction: column; align-items: flex-start; }
  .linker-canvas { height: 320px; }
  .sb-container { padding: 1.5rem 1rem 3rem; }
  .page-title { font-size: 1.8rem; }
  .linker-footer { flex-direction: column; }
}
</style>