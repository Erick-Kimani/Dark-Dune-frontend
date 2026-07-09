<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="fvm-backdrop" @click.self="handleClose">
        <div class="fvm-modal" :class="{ 'fvm-modal--wide': isImage }">

          <!-- ── Top Bar ── -->
          <div class="fvm-topbar">
            <div class="fvm-topbar__left">
              <div class="fvm-file-icon">
                <svg v-if="isImage" viewBox="0 0 22 18" fill="none"><rect x="1" y="1" width="20" height="16" rx="2" fill="url(#fvmImg)"/><circle cx="7" cy="7" r="2" fill="rgba(255,255,255,0.3)"/><path d="M1 13L6 8L10 12L14 9L21 14" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round"/><defs><linearGradient id="fvmImg" x1="1" y1="1" x2="21" y2="17" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs></svg>
                <svg v-else-if="isSpreadsheet" viewBox="0 0 18 20" fill="none"><rect x="1" y="1" width="16" height="18" rx="2" fill="url(#fvmSheet)"/><line x1="1" y1="7" x2="17" y2="7" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><line x1="1" y1="12" x2="17" y2="12" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><line x1="7" y1="7" x2="7" y2="19" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><defs><linearGradient id="fvmSheet" x1="1" y1="1" x2="17" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs></svg>
                <svg v-else viewBox="0 0 18 22" fill="none"><path d="M10 1H3C1.895 1 1 1.895 1 3V19C1 20.105 1.895 21 3 21H15C16.105 21 17 20.105 17 19V8L10 1Z" fill="url(#fvmDoc)"/><path d="M10 1V8H17" fill="#5a1208"/><defs><linearGradient id="fvmDoc" x1="1" y1="1" x2="17" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs></svg>
              </div>
              <div class="fvm-file-info">
                <span class="fvm-file-name" v-if="!editingName" @dblclick="startEditName">
                  {{ localFile.name }}<span class="fvm-ext">.{{ localFile.extension }}</span>
                </span>
                <input v-else ref="nameInput" v-model="localFile.name" class="fvm-name-input" @blur="saveName" @keydown.enter="saveName" @keydown.escape="cancelEditName"/>
                <span class="fvm-file-meta">
                  {{ localFile.human_size || formatSize(localFile.size) }}
                  <span class="fvm-dot">·</span>
                  {{ localFile.extension?.toUpperCase() }}
                  <span class="fvm-dot">·</span>
                  {{ renderModeLabel }}
                </span>
              </div>
            </div>

            <div class="fvm-topbar__right">
              <!-- Image annotation toolbar -->
              <template v-if="isImage && file">
                <div class="fvm-anno-toolbar">
                  <button class="fvm-tool-btn" :class="{ active: annoTool === 'pen' }" @click="annoTool = 'pen'" title="Draw">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 20H21M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30291 19.5 3.5C19.697 3.69709 19.8532 3.93093 19.9598 4.18832C20.0664 4.44571 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0664 5.55429 19.9598 5.81168C19.8532 6.06907 19.697 6.30291 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="fvm-tool-btn" :class="{ active: annoTool === 'text' }" @click="annoTool = 'text'" title="Add text note">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M4 7V4H20V7M9 20H15M12 4V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <div class="fvm-color-swatches">
                    <button v-for="c in annoColors" :key="c" class="fvm-swatch" :class="{ active: annoColor === c }" :style="{ background: c }" @click="annoColor = c"></button>
                  </div>
                  <div class="fvm-size-slider">
                    <svg viewBox="0 0 24 24" fill="none" class="size-icon"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                    <input type="range" min="2" max="20" v-model.number="annoPenSize" class="fvm-slider"/>
                  </div>
                  <button class="fvm-tool-btn fvm-tool-undo" @click="undoAnnotation" :disabled="annotations.length === 0" title="Undo last">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M3 7V13H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13C3.91 8.94 7.56 6 12 6C15.54 6 18.6 7.97 20.11 10.91" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  </button>
                  <button class="fvm-tool-btn fvm-tool-clear" @click="clearAnnotations" :disabled="annotations.length === 0" title="Clear all">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="fvm-tool-btn fvm-tool-save" @click="saveAnnotations" :disabled="!annotationsDirty || isSaving" title="Save annotations">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.895 21 3 20.105 3 19V5C3 3.895 3.895 3 5 3H16L21 8V19C21 20.105 20.105 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </template>

              <!-- Text save button -->
              <button v-if="isText && contentDirty" class="fvm-save-btn" @click="saveContent" :disabled="isSaving">
                <svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.895 21 3 20.105 3 19V5C3 3.895 3.895 3 5 3H16L21 8V19C21 20.105 20.105 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>

              <button class="fvm-editor-btn" @click="openInEditor" title="Open in DarkDune Writer">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 20H21M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.1022 19.5 3.5C19.8978 3.8978 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.1022 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Edit
            </button>

              <button class="fvm-close-btn" @click="handleClose" title="Close">
                <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <!-- ── Save feedback ── -->
          <div v-if="saveMessage" class="fvm-save-toast" :class="saveMessageType">
            <svg v-if="saveMessageType === 'success'" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            {{ saveMessage }}
          </div>

          <!-- ── Body ── -->
          <div class="fvm-body">

            <!-- LEFT: Viewer/Editor -->
            <div class="fvm-viewer" :class="{ 'fvm-viewer--full': !showSidebar }">

              <!-- IMAGE viewer with annotation canvas -->
              <div v-if="isImage" class="fvm-image-wrap" ref="imageWrap">
                <img
                  :src="imageDataUrl"
                  class="fvm-image"
                  ref="fileImage"
                  @load="onImageLoad"
                  draggable="false"
                  alt="File preview"
                />
                <!-- Annotation canvas overlay -->
                <canvas
                  ref="annoCanvas"
                  class="fvm-anno-canvas"
                  @mousedown="onAnnoMouseDown"
                  @mousemove="onAnnoMouseMove"
                  @mouseup="onAnnoMouseUp"
                  @mouseleave="onAnnoMouseUp"
                  @click="onAnnoClick"
                  :style="{ cursor: annoTool === 'pen' ? 'crosshair' : annoTool === 'text' ? 'text' : 'default' }"
                ></canvas>
                <!-- Text input for annotation text notes -->
                <div v-if="activeTextNote" class="fvm-text-input-wrap" :style="{ left: activeTextNote.x + 'px', top: activeTextNote.y + 'px' }">
                  <input ref="textNoteInput" v-model="activeTextNote.text" class="fvm-text-note-input" placeholder="Type note..." @keydown.enter="commitTextNote" @keydown.escape="cancelTextNote" @blur="commitTextNote"/>
                </div>
              </div>

              <!-- PDF viewer -->
              <div v-else-if="isPdf" class="fvm-pdf-wrap">
                <iframe :src="pdfDataUrl" class="fvm-pdf-iframe" title="PDF preview"></iframe>
              </div>

              <!-- TEXT / CSV editor -->
              <div v-else-if="isText" class="fvm-text-wrap">
                <div class="fvm-text-toolbar">
                  <span class="fvm-text-label">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Editing — changes are saved to DarkDune only
                  </span>
                  <span class="fvm-char-count">{{ textContent.length }} chars</span>
                </div>
                <textarea
                  v-model="textContent"
                  class="fvm-textarea"
                  spellcheck="false"
                  @input="contentDirty = true"
                  placeholder="File content will appear here..."
                ></textarea>
              </div>

              <!-- SYSTEM (DOC, DOCX, XLS, XLSX) -->
              <div v-else class="fvm-system-wrap">
                <div class="fvm-system-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="4" width="28" height="40" rx="3" fill="url(#sysDoc)"/>
                    <path d="M28 4V14H40" fill="#5a1208"/>
                    <path d="M28 4L40 14V44C40 45.657 38.657 47 37 47H11C9.343 47 8 45.657 8 44" stroke="none"/>
                    <line x1="12" y1="20" x2="32" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
                    <line x1="12" y1="26" x2="32" y2="26" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
                    <line x1="12" y1="32" x2="24" y2="32" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
                    <defs><linearGradient id="sysDoc" x1="4" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs>
                  </svg>
                </div>
                <h3 class="fvm-system-title">{{ localFile.name }}.{{ localFile.extension }}</h3>
                <p class="fvm-system-sub">This file type can't be rendered in the browser.</p>
                <p class="fvm-system-sub">Open it in its native application on your device.</p>
                <button class="fvm-open-btn" @click="openInSystem">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21M21 3V9M21 3L10 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Open in System
                </button>
                <p class="fvm-path-note">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ localFile.local_path }}
                </p>
              </div>

            </div>

            <!-- RIGHT: Sidebar — File details -->
            <div class="fvm-sidebar" v-if="showSidebar">
              <div class="fvm-sidebar__section">
                <h4 class="fvm-section-title">File Details</h4>

                <div class="fvm-field">
                  <label class="fvm-label">Name</label>
                  <input v-model="localFile.name" class="fvm-input" @change="metaDirty = true" placeholder="File name"/>
                </div>

                <div class="fvm-field">
                  <label class="fvm-label">Description</label>
                  <textarea v-model="localFile.description" class="fvm-input fvm-input-ta" @change="metaDirty = true" placeholder="Add a description..."></textarea>
                </div>

                <div class="fvm-field">
                  <label class="fvm-label">Tags</label>
                  <div class="fvm-tags-wrap">
                    <div class="fvm-tags">
                      <span v-for="(tag, i) in localFile.tags" :key="i" class="fvm-tag">
                        {{ tag }}
                        <button @click="removeTag(i)">×</button>
                      </span>
                    </div>
                    <input v-model="newTag" class="fvm-tag-input" placeholder="Add tag + Enter" @keydown.enter.prevent="addTag" @keydown.comma.prevent="addTag"/>
                  </div>
                </div>

                <button v-if="metaDirty" class="fvm-meta-save-btn" @click="saveMeta" :disabled="isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Details' }}
                </button>
              </div>

              <div class="fvm-sidebar__section fvm-sidebar__section--info">
                <h4 class="fvm-section-title">Info</h4>
                <div class="fvm-info-row"><span>Type</span><span>{{ localFile.extension?.toUpperCase() }}</span></div>
                <div class="fvm-info-row"><span>Size</span><span>{{ localFile.human_size || formatSize(localFile.size) }}</span></div>
                <div class="fvm-info-row"><span>Category</span><span>{{ localFile.category }}</span></div>
                <div class="fvm-info-row"><span>Added</span><span>{{ formatDate(localFile.created_at) }}</span></div>
                <div class="fvm-info-row" v-if="localFile.last_opened_at"><span>Last opened</span><span>{{ formatDate(localFile.last_opened_at) }}</span></div>
                <div class="fvm-info-row" v-if="localFile.outgoing_links_count !== undefined">
                  <span>Links out</span><span>{{ localFile.outgoing_links_count }}</span>
                </div>
                <div class="fvm-info-row" v-if="localFile.incoming_links_count !== undefined">
                  <span>Links in</span><span>{{ localFile.incoming_links_count }}</span>
                </div>
              </div>

              <button class="fvm-sidebar-toggle fvm-sidebar-toggle--inside" @click="showSidebar = false" title="Hide sidebar">
                <svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <!-- Show sidebar button when hidden -->
            <button v-else class="fvm-sidebar-toggle fvm-sidebar-toggle--outside" @click="showSidebar = true" title="Show details">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>

          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { authService } from '@/services/auth.js'

const BASE_URL = 'http://localhost:8000/api'

export default {
  name: 'FileViewerModal',

  props: {
    show: { type: Boolean, default: false },
    file: { type: Object, default: null },
  },

  emits: ['close', 'updated'],

  data() {
    return {
      localFile:   {},
      textContent: '',
      annotations: [],
      imageDataUrl: null,
      pdfDataUrl:   null,

      // UI state
      showSidebar:      true,
      editingName:      false,
      originalName:     '',
      contentDirty:     false,
      metaDirty:        false,
      annotationsDirty: false,
      isSaving:         false,
      saveMessage:      '',
      saveMessageType:  'success',
      newTag:           '',

      // Annotation tool state
      annoTool:    'pen',
      annoColor:   '#e74c3c',
      annoPenSize: 4,
      annoColors:  ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#ffffff', '#000000'],
      isDrawing:   false,
      currentStroke: null,
      activeTextNote: null,
    }
  },

  computed: {
    isImage()      { return this.localFile?.category === 'image' },
    isPdf()        { return this.localFile?.extension === 'pdf' },
    isText()       { return ['txt', 'csv'].includes(this.localFile?.extension) },
    isSpreadsheet(){ return ['xls', 'xlsx', 'csv'].includes(this.localFile?.extension) },

    renderModeLabel() {
      if (this.isImage)  return 'Image'
      if (this.isPdf)    return 'PDF'
      if (this.isText)   return 'Text'
      return 'External file'
    },
  },

  watch: {
    file: {
      immediate: true,
      async handler(newFile) {
        if (!newFile) return
        this.localFile        = { ...newFile, tags: Array.isArray(newFile.tags) ? [...newFile.tags] : [] }
        this.textContent      = ''
        this.annotations      = newFile.annotations ? [...newFile.annotations] : []
        this.contentDirty     = false
        this.metaDirty        = false
        this.annotationsDirty = false
        this.imageDataUrl     = null
        this.pdfDataUrl       = null
        this.activeTextNote   = null
        await this.loadFileContent()
      },
    },

    show(val) {
      if (val) document.body.style.overflow = 'hidden'
      else     document.body.style.overflow = ''
    },
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

    // ── Load file details & content ──
    async loadFileContent() {
      if (!this.localFile?.id) return
      try {
        const res = await this.api('GET', `/files/${this.localFile.id}`)
        const f   = res.file
        this.localFile = { ...f, tags: Array.isArray(f.tags) ? [...f.tags] : [] }
        this.annotations = f.annotations ? [...f.annotations] : []

        if (this.isText && f.content) {
          this.textContent = f.content
        }

        // For images and PDFs — use local_path as the src
        // Since files are on the user's device, we use the filename stored
        if (this.isImage) {
          this.imageDataUrl = null // Will be set after image input if needed
          // Try to read from the file input if available
          this.$nextTick(() => this.setupImageCanvas())
        }
        if (this.isPdf) {
          this.pdfDataUrl = null
        }

      } catch (err) {
        console.error('Failed to load file details', err)
      }
    },

    // ── Handle file reading from device ──
    // This is called when the user selects the file from disk to preview it
    handleLocalFileRead(fileObject) {
      if (!fileObject) return
      const reader = new FileReader()
      if (this.isImage) {
        reader.onload = (e) => {
          this.imageDataUrl = e.target.result
          this.$nextTick(() => this.setupImageCanvas())
        }
        reader.readAsDataURL(fileObject)
      } else if (this.isPdf) {
        reader.onload = (e) => {
          this.pdfDataUrl = e.target.result
        }
        reader.readAsDataURL(fileObject)
      } else if (this.isText) {
        reader.onload = (e) => {
          if (!this.textContent) {
            this.textContent = e.target.result
          }
        }
        reader.readAsText(fileObject)
      }
    },

    // ── Image canvas setup ──
    setupImageCanvas() {
      const canvas = this.$refs.annoCanvas
      const img    = this.$refs.fileImage
      if (!canvas || !img) return
      canvas.width  = img.offsetWidth  || img.naturalWidth
      canvas.height = img.offsetHeight || img.naturalHeight
      this.redrawAnnotations()
    },

    onImageLoad() {
      this.$nextTick(() => this.setupImageCanvas())
    },

    // ── Annotation drawing ──
    onAnnoMouseDown(e) {
      if (this.annoTool !== 'pen') return
      this.isDrawing = true
      const pos = this.getCanvasPos(e)
      this.currentStroke = {
        type:   'stroke',
        color:  this.annoColor,
        size:   this.annoPenSize,
        points: [pos],
      }
    },

    onAnnoMouseMove(e) {
      if (!this.isDrawing || !this.currentStroke) return
      const pos = this.getCanvasPos(e)
      this.currentStroke.points.push(pos)
      this.drawLiveStroke()
    },

    onAnnoMouseUp() {
      if (!this.isDrawing || !this.currentStroke) return
      this.isDrawing = false
      if (this.currentStroke.points.length > 1) {
        this.annotations.push({ ...this.currentStroke })
        this.annotationsDirty = true
      }
      this.currentStroke = null
      this.redrawAnnotations()
    },

    onAnnoClick(e) {
      if (this.annoTool !== 'text') return
      const pos = this.getCanvasPos(e)
      this.activeTextNote = { x: pos.x, y: pos.y, text: '' }
      this.$nextTick(() => this.$refs.textNoteInput?.focus())
    },

    commitTextNote() {
      if (!this.activeTextNote || !this.activeTextNote.text.trim()) {
        this.activeTextNote = null
        return
      }
      this.annotations.push({
        type:  'text',
        x:     this.activeTextNote.x,
        y:     this.activeTextNote.y,
        text:  this.activeTextNote.text,
        color: this.annoColor,
        size:  this.annoPenSize + 10,
      })
      this.annotationsDirty = true
      this.activeTextNote   = null
      this.redrawAnnotations()
    },

    cancelTextNote() {
      this.activeTextNote = null
    },

    getCanvasPos(e) {
      const canvas = this.$refs.annoCanvas
      const rect   = canvas.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) * (canvas.width  / rect.width),
        y: (e.clientY - rect.top)  * (canvas.height / rect.height),
      }
    },

    redrawAnnotations() {
      const canvas = this.$refs.annoCanvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.annotations.forEach(anno => this.drawAnnotation(ctx, anno))
    },

    drawAnnotation(ctx, anno) {
      if (anno.type === 'stroke' && anno.points?.length > 1) {
        ctx.beginPath()
        ctx.strokeStyle = anno.color || '#e74c3c'
        ctx.lineWidth   = anno.size  || 4
        ctx.lineCap     = 'round'
        ctx.lineJoin    = 'round'
        ctx.moveTo(anno.points[0].x, anno.points[0].y)
        anno.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
        ctx.stroke()
      } else if (anno.type === 'text') {
        ctx.font      = `${anno.size || 16}px Syne, sans-serif`
        ctx.fillStyle = anno.color || '#e74c3c'
        // Text shadow for readability
        ctx.shadowColor   = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur    = 4
        ctx.fillText(anno.text, anno.x, anno.y)
        ctx.shadowBlur    = 0
      }
    },

    drawLiveStroke() {
      const canvas = this.$refs.annoCanvas
      if (!canvas || !this.currentStroke) return
      const ctx = canvas.getContext('2d')
      this.redrawAnnotations()
      this.drawAnnotation(ctx, this.currentStroke)
    },

    undoAnnotation() {
      if (this.annotations.length === 0) return
      this.annotations.pop()
      this.annotationsDirty = true
      this.redrawAnnotations()
    },

    clearAnnotations() {
      if (!confirm('Clear all annotations?')) return
      this.annotations      = []
      this.annotationsDirty = true
      this.redrawAnnotations()
    },

    // ── Save operations ──

    async saveContent() {
      this.isSaving = true
      try {
        await this.api('PUT', `/files/${this.localFile.id}/content`, {
          content: this.textContent,
        })
        this.contentDirty = false
        this.showToast('Content saved successfully.', 'success')
        this.$emit('updated', { ...this.localFile })
      } catch (err) {
        this.showToast('Failed to save content.', 'error')
      } finally {
        this.isSaving = false
      }
    },

    async saveAnnotations() {
      this.isSaving = true
      try {
        await this.api('PUT', `/files/${this.localFile.id}/annotations`, {
          annotations: this.annotations,
        })
        this.annotationsDirty = false
        this.showToast('Annotations saved.', 'success')
        this.$emit('updated', { ...this.localFile, annotations: this.annotations })
      } catch (err) {
        this.showToast('Failed to save annotations.', 'error')
      } finally {
        this.isSaving = false
      }
    },

    async saveMeta() {
      this.isSaving = true
      try {
        const res = await this.api('PUT', `/files/${this.localFile.id}`, {
          name:        this.localFile.name,
          description: this.localFile.description,
          tags:        this.localFile.tags,
        })
        this.localFile  = { ...res.file, tags: Array.isArray(res.file.tags) ? [...res.file.tags] : [] }
        this.metaDirty  = false
        this.showToast('Details saved.', 'success')
        this.$emit('updated', this.localFile)
      } catch (err) {
        this.showToast('Failed to save details.', 'error')
      } finally {
        this.isSaving = false
      }
    },

    // ── Name editing ──
    startEditName() {
      this.originalName = this.localFile.name
      this.editingName  = true
      this.$nextTick(() => this.$refs.nameInput?.focus())
    },

    saveName() {
      this.editingName = false
      if (this.localFile.name !== this.originalName) {
        this.metaDirty = true
      }
    },

    cancelEditName() {
      this.localFile.name = this.originalName
      this.editingName    = false
    },

    // ── Tags ──
    addTag() {
      const tag = this.newTag.trim().replace(/,$/, '')
      if (tag && !this.localFile.tags.includes(tag)) {
        this.localFile.tags.push(tag)
        this.metaDirty = true
      }
      this.newTag = ''
    },

    removeTag(i) {
      this.localFile.tags.splice(i, 1)
      this.metaDirty = true
    },
    openInEditor() {
      this.$emit('close')
      this.$router.push(`/editor/${this.localFile.id}`)
    },
    // ── System open ──
    openInSystem() {
      // Copies the path to clipboard — the actual file open
      // requires a desktop shell, which browsers can't do directly
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.localFile.local_path)
        this.showToast('Path copied to clipboard — paste into your file manager.', 'success')
      } else {
        this.showToast(`Open this path: ${this.localFile.local_path}`, 'success')
      }
    },

    // ── Helpers ──
    handleClose() {
      if ((this.contentDirty || this.annotationsDirty || this.metaDirty)) {
        if (!confirm('You have unsaved changes. Close anyway?')) return
      }
      this.$emit('close')
    },

    showToast(msg, type = 'success') {
      this.saveMessage     = msg
      this.saveMessageType = type
      setTimeout(() => { this.saveMessage = '' }, 3000)
    },

    formatSize(bytes) {
      if (!bytes) return ''
      if (bytes < 1024)    return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
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

/* ── Backdrop ── */
.fvm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; transform: scale(0.97); }

/* ── Modal ── */
.fvm-modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(192,57,43,0.1);
}

.fvm-modal--wide { max-width: 1100px; }

/* ── Top bar ── */
.fvm-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
  flex-shrink: 0;
  background: var(--surface);
}

.fvm-topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.fvm-topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.fvm-file-icon svg { width: 22px; height: 20px; flex-shrink: 0; }

.fvm-file-info { min-width: 0; }

.fvm-file-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: text;
}
.fvm-file-name:hover { color: var(--volcanic-glow); }
.fvm-ext { color: var(--text-muted); font-weight: 400; }

.fvm-name-input {
  background: var(--raised);
  border: 1px solid var(--volcanic);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  padding: 2px 8px;
  outline: none;
  width: 260px;
}

.fvm-file-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.fvm-dot { opacity: 0.4; }

/* ── Annotation toolbar ── */
.fvm-anno-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.fvm-tool-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.fvm-tool-btn svg { width: 14px; height: 14px; }
.fvm-tool-btn:hover:not(:disabled) { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }
.fvm-tool-btn.active { background: rgba(231,76,60,0.15); border-color: var(--volcanic-glow); color: var(--volcanic-glow); }
.fvm-tool-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.fvm-color-swatches { display: flex; gap: 4px; }
.fvm-swatch {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s, border-color 0.1s;
}
.fvm-swatch:hover { transform: scale(1.2); }
.fvm-swatch.active { border-color: white; transform: scale(1.15); }

.fvm-size-slider { display: flex; align-items: center; gap: 6px; }
.size-icon { width: 12px; height: 12px; color: var(--text-muted); }
.fvm-slider { width: 60px; accent-color: var(--volcanic); }

.fvm-tool-save { background: rgba(231,76,60,0.1); border-color: rgba(231,76,60,0.3); color: var(--volcanic-glow); }
.fvm-tool-save:hover:not(:disabled) { background: rgba(231,76,60,0.2); }

/* Text save button */
.fvm-save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--volcanic), var(--volcanic-glow));
  border: none;
  border-radius: 6px;
  color: white;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.fvm-save-btn svg { width: 13px; height: 13px; }
.fvm-save-btn:hover:not(:disabled) { box-shadow: 0 4px 14px rgba(192,57,43,0.4); transform: translateY(-1px); }
.fvm-save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

/* Close button */
.fvm-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.fvm-close-btn svg { width: 14px; height: 14px; }
.fvm-close-btn:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

/* ── Toast ── */
.fvm-save-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  flex-shrink: 0;
}
.fvm-save-toast svg { width: 14px; height: 14px; }
.fvm-save-toast.success { background: rgba(39,174,96,0.1); color: #27ae60; border-bottom: 1px solid rgba(39,174,96,0.2); }
.fvm-save-toast.error   { background: rgba(192,57,43,0.1); color: #e74c3c; border-bottom: 1px solid rgba(192,57,43,0.2); }

/* ── Body ── */
.fvm-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

/* ── Viewer ── */
.fvm-viewer {
  flex: 1;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* Image */
.fvm-image-wrap {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060606;
  overflow: hidden;
}

.fvm-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
}

.fvm-anno-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.fvm-text-input-wrap {
  position: absolute;
  z-index: 10;
}

.fvm-text-note-input {
  background: rgba(9,9,9,0.85);
  border: 1px solid var(--volcanic-glow);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 4px 8px;
  outline: none;
  min-width: 150px;
  backdrop-filter: blur(4px);
}

/* PDF */
.fvm-pdf-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fvm-pdf-iframe {
  flex: 1;
  width: 100%;
  border: none;
  min-height: 500px;
  background: white;
}

/* Text editor */
.fvm-text-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fvm-text-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.fvm-text-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}
.fvm-text-label svg { width: 13px; height: 13px; }

.fvm-char-count { font-size: 10px; color: var(--text-muted); }

.fvm-textarea {
  flex: 1;
  background: var(--bg);
  border: none;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 1.25rem;
  resize: none;
  outline: none;
  min-height: 400px;
}
.fvm-textarea::placeholder { color: var(--text-muted); }

/* System/External */
.fvm-system-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 3rem;
  text-align: center;
}

.fvm-system-icon svg { width: 80px; height: 80px; filter: drop-shadow(0 4px 16px rgba(192,57,43,0.3)); }
.fvm-system-title { font-family: var(--font-display); font-size: 22px; font-weight: 600; color: var(--text-primary); margin: 0; }
.fvm-system-sub { font-size: 13px; color: var(--text-secondary); margin: 0; }

.fvm-open-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  margin-top: 8px;
  background: linear-gradient(135deg, var(--volcanic), var(--volcanic-glow));
  border: none;
  border-radius: 8px;
  color: white;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(192,57,43,0.3);
}
.fvm-open-btn svg { width: 15px; height: 15px; }
.fvm-open-btn:hover { box-shadow: 0 6px 22px rgba(192,57,43,0.5); transform: translateY(-1px); }

.fvm-path-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  word-break: break-all;
  max-width: 400px;
  margin-top: 4px;
}
.fvm-path-note svg { width: 12px; height: 12px; flex-shrink: 0; }

/* ── Sidebar ── */
.fvm-sidebar {
  width: 260px;
  flex-shrink: 0;
  border-left: 1px solid var(--border);
  overflow-y: auto;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  position: relative;
}

.fvm-sidebar__section {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.fvm-sidebar__section--info { border-bottom: none; }

.fvm-section-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin: 0 0 1rem;
}

.fvm-field { margin-bottom: 1rem; }

.fvm-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 5px;
}

.fvm-input {
  width: 100%;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 12px;
  padding: 7px 10px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.fvm-input:focus { border-color: var(--volcanic); }
.fvm-input-ta { resize: vertical; min-height: 64px; }

.fvm-tags-wrap { display: flex; flex-direction: column; gap: 6px; }
.fvm-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.fvm-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(192,57,43,0.12);
  border: 1px solid rgba(192,57,43,0.25);
  border-radius: 12px;
  font-size: 10px;
  color: var(--volcanic-glow);
}
.fvm-tag button { background: none; border: none; cursor: pointer; color: inherit; padding: 0; font-size: 12px; line-height: 1; opacity: 0.7; }
.fvm-tag button:hover { opacity: 1; }

.fvm-tag-input {
  width: 100%;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 11px;
  padding: 5px 8px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.fvm-tag-input:focus { border-color: var(--volcanic); }
.fvm-tag-input::placeholder { color: var(--text-muted); }

.fvm-meta-save-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(135deg, var(--volcanic), var(--volcanic-glow));
  border: none;
  border-radius: 6px;
  color: white;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.fvm-meta-save-btn:hover:not(:disabled) { box-shadow: 0 4px 14px rgba(192,57,43,0.4); }
.fvm-meta-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.fvm-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  color: var(--text-secondary);
}
.fvm-info-row span:last-child { color: var(--text-primary); font-weight: 600; text-transform: capitalize; }

/* ── Sidebar toggle ── */
.fvm-sidebar-toggle {
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  transition: all 0.15s;
}
.fvm-sidebar-toggle svg { width: 14px; height: 14px; }
.fvm-sidebar-toggle:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

.fvm-sidebar-toggle--inside {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.fvm-sidebar-toggle--outside {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

@media (max-width: 700px) {
  .fvm-modal { max-height: 100vh; border-radius: 0; }
  .fvm-sidebar { display: none; }
  .fvm-anno-toolbar { gap: 4px; }
  .fvm-color-swatches { display: none; }
}
.fvm-editor-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  background: rgba(192,57,43,0.12);
  border: 1px solid rgba(192,57,43,0.35);
  border-radius: 6px;
  color: #e74c3c;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.fvm-editor-btn svg { width: 13px; height: 13px; }
.fvm-editor-btn:hover {
  background: rgba(192,57,43,0.25);
  border-color: #e74c3c;
  box-shadow: 0 2px 10px rgba(192,57,43,0.3);
}
</style>