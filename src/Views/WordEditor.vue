<template>
  <div class="we-wrapper">

    <!-- Hidden file inputs -->
    <input type="file" accept="image/*" ref="imgInput" style="display:none" @change="insertImage"/>
    <input type="color" ref="textColorInput" v-model="textColor" @change="execCmd('foreColor', textColor)" style="display:none"/>
    <input type="color" ref="highlightInput" v-model="highlightColor" @change="execCmd('hiliteColor', highlightColor)" style="display:none"/>

    <!-- ── Title Bar ── -->
    <div class="we-titlebar">
      <div class="we-titlebar__left">
        <router-link to="/startbuilding" class="we-back" title="Back to canvas">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </router-link>
        <div class="we-doc-icon">
          <svg viewBox="0 0 18 22" fill="none"><path d="M10 1H3C1.895 1 1 1.895 1 3V19C1 20.105 1.895 21 3 21H15C16.105 21 17 20.105 17 19V8L10 1Z" fill="url(#weDocGrad)"/><path d="M10 1V8H17" fill="#5a1208"/><defs><linearGradient id="weDocGrad" x1="1" y1="1" x2="17" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/></linearGradient></defs></svg>
        </div>
        <div class="we-doc-title">
          <span v-if="!editingTitle" class="we-doc-name" @dblclick="startEditTitle">{{ docTitle }}</span>
          <input v-else ref="titleInput" v-model="docTitle" class="we-title-input" @blur="stopEditTitle" @keydown.enter="stopEditTitle" @keydown.escape="stopEditTitle"/>
          <span class="we-doc-path">DarkDune · {{ fileExt }}</span>
        </div>
      </div>
      <div class="we-titlebar__center">
        <span class="we-app-name">DarkDune <span class="we-app-accent">Writer</span></span>
      </div>
      <div class="we-titlebar__right">
        <div class="we-save-status" :class="saveStatusClass">
          <svg v-if="saveStatus === 'saved'" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else-if="saveStatus === 'saving'" viewBox="0 0 24 24" fill="none" class="spin"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ saveStatusText }}
        </div>
        <button class="we-save-btn" @click="saveDocument" :disabled="saveStatus === 'saving'">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5C3.895 21 3 20.105 3 19V5C3 3.895 3.895 3 5 3H16L21 8V19C21 20.105 20.105 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Save
        </button>
      </div>
    </div>

    <!-- ── Ribbon ── -->
    <div class="we-ribbon">
      <div class="we-toolbar">

        <!-- Font family + size -->
        <div class="we-tool-group">
          <select class="we-select we-font-family" @change="execCmd('fontName', $event.target.value)" v-model="currentFont">
            <option v-for="f in fonts" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
          <select class="we-select we-font-size" @change="execCmd('fontSize', $event.target.value)" v-model="currentSize">
            <option v-for="s in fontSizes" :key="s.cmd" :value="s.cmd">{{ s.label }}</option>
          </select>
        </div>

        <div class="we-divider"></div>

        <!-- Format -->
        <div class="we-tool-group">
          <button class="we-btn" :class="{ active: fmt.bold }"          @mousedown.prevent="execCmd('bold')"           title="Bold (Ctrl+B)">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 12H14C16.209 12 18 10.209 18 8C18 5.791 16.209 4 14 4H6V12ZM6 12H15C17.209 12 19 13.791 19 16C19 18.209 17.209 20 15 20H6V12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" :class="{ active: fmt.italic }"        @mousedown.prevent="execCmd('italic')"         title="Italic (Ctrl+I)">
            <svg viewBox="0 0 24 24" fill="none"><path d="M19 4H10M14 20H5M15 4L9 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" :class="{ active: fmt.underline }"     @mousedown.prevent="execCmd('underline')"      title="Underline (Ctrl+U)">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 4V10C6 13.314 8.686 16 12 16C15.314 16 18 13.314 18 10V4M4 20H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" :class="{ active: fmt.strikethrough }" @mousedown.prevent="execCmd('strikeThrough')"  title="Strikethrough">
            <svg viewBox="0 0 24 24" fill="none"><path d="M16 4H9C7.343 4 6 5.343 6 7C6 8.657 7.343 10 9 10H15C16.657 10 18 11.343 18 13C18 14.657 16.657 16 15 16H6M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="we-divider"></div>

        <!-- Colors -->
        <div class="we-tool-group">
          <button class="we-btn we-color-btn" @click="$refs.textColorInput.click()" title="Text color">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 3L5 21M15 3L11 21M3 9H21M3 15H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <div class="we-color-bar" :style="{ background: textColor }"></div>
          </button>
          <button class="we-btn we-color-btn" @click="$refs.highlightInput.click()" title="Highlight color">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 3H15L21 12L12 21L3 12L9 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div class="we-color-bar" :style="{ background: highlightColor }"></div>
          </button>
        </div>

        <div class="we-divider"></div>

        <!-- Headings -->
        <div class="we-tool-group">
          <button class="we-btn we-heading" @mousedown.prevent="formatBlock('p')"  title="Normal">¶</button>
          <button class="we-btn we-heading" @mousedown.prevent="formatBlock('h1')" title="Heading 1"><strong>H1</strong></button>
          <button class="we-btn we-heading" @mousedown.prevent="formatBlock('h2')" title="Heading 2"><strong>H2</strong></button>
          <button class="we-btn we-heading" @mousedown.prevent="formatBlock('h3')" title="Heading 3"><strong>H3</strong></button>
        </div>

        <div class="we-divider"></div>

        <!-- Lists -->
        <div class="we-tool-group">
          <button class="we-btn" @mousedown.prevent="execCmd('insertUnorderedList')" title="Bullet list">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/><path d="M8 6H20M8 12H20M8 18H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('insertOrderedList')" title="Numbered list">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 6H5V3M4 10H6M4 14V16H6V14H4M8 6H20M8 12H20M8 18H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('indent')"  title="Indent">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 8L7 12L3 16M8 6H21M8 12H21M8 18H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('outdent')" title="Outdent">
            <svg viewBox="0 0 24 24" fill="none"><path d="M7 8L3 12L7 16M8 6H21M8 12H21M8 18H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="we-divider"></div>

        <!-- Alignment -->
        <div class="we-tool-group">
          <button class="we-btn" @mousedown.prevent="execCmd('justifyLeft')"   title="Align left">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H15M3 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('justifyCenter')" title="Center">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M6 12H18M5 18H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('justifyRight')"  title="Align right">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M9 12H21M6 18H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('justifyFull')"   title="Justify">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="we-divider"></div>

        <!-- Insert -->
        <div class="we-tool-group">
          <button class="we-btn" @click="insertTable" title="Insert table">
            <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 9H21M3 15H21M9 3V21M15 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @click="$refs.imgInput.click()" title="Insert image">
            <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" @click="toggleShapeDialog" title="Insert shape">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M7 21L11 13H3L7 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </button>
          <button class="we-btn" @click="toggleFindReplace" title="Find & Replace (Ctrl+H)">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 11H14M11 8V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="we-divider"></div>

        <!-- Undo / Redo -->
        <div class="we-tool-group">
          <button class="we-btn" @mousedown.prevent="execCmd('undo')" title="Undo (Ctrl+Z)">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 7V13H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13C3.91 8.94 7.56 6 12 6C16.97 6 21 10.03 21 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="we-btn" @mousedown.prevent="execCmd('redo')" title="Redo (Ctrl+Y)">
            <svg viewBox="0 0 24 24" fill="none"><path d="M21 7V13H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13C20.09 8.94 16.44 6 12 6C7.03 6 3 10.03 3 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>

      </div>

      <!-- Find & Replace Panel -->
      <transition name="slide-down">
        <div v-if="showFindReplace" class="we-find-replace">
          <div class="we-fr-group">
            <label class="we-fr-label">Find</label>
            <input v-model="findText" class="we-fr-input" placeholder="Search text..." @keydown.enter="findNext"/>
            <button class="we-fr-btn" @click="findNext">Next</button>
            <button class="we-fr-btn" @click="findPrev">Prev</button>
          </div>
          <div class="we-fr-group">
            <label class="we-fr-label">Replace</label>
            <input v-model="replaceText" class="we-fr-input" placeholder="Replace with..."/>
            <button class="we-fr-btn" @click="replaceOne">Replace</button>
            <button class="we-fr-btn we-fr-btn--accent" @click="replaceAll">All</button>
          </div>
          <div class="we-fr-result" v-if="findResult">{{ findResult }}</div>
          <button class="we-fr-close" @click="showFindReplace = false">✕</button>
        </div>
      </transition>
    </div>

    <!-- ── Page Area ── -->
    <div class="we-page-area" ref="pageArea">

      <!-- Table insert dialog -->
      <transition name="fade">
        <div v-if="showTableDialog" class="we-table-dialog">
          <div class="we-td-title">Insert Table</div>
          <div class="we-td-grid" @mouseleave="hoverRow = 0; hoverCol = 0">
            <div v-for="r in 8" :key="'tr-'+r" class="we-td-row">
              <div
                v-for="c in 8" :key="'tc-'+c"
                class="we-td-cell"
                :class="{ active: r <= hoverRow && c <= hoverCol }"
                @mouseenter="hoverRow = r; hoverCol = c"
                @click="confirmInsertTable"
              ></div>
            </div>
          </div>
          <div class="we-td-label">{{ hoverRow > 0 ? hoverRow + ' × ' + hoverCol : 'Hover to select' }}</div>
          <button class="we-td-cancel" @click="showTableDialog = false">Cancel</button>
        </div>
      </transition>

      <!-- Shape insert dialog -->
      <transition name="fade">
        <div v-if="showShapeDialog" class="we-table-dialog we-shape-dialog">
          <div class="we-td-title">Insert Shape</div>
          <div class="we-shape-grid">
            <button
              v-for="shape in shapes" :key="shape.type"
              class="we-shape-cell"
              :title="shape.label"
              @click="insertShape(shape.type)"
              v-html="shape.icon"
            ></button>
          </div>
          <div class="we-shape-colors">
            <button
              v-for="c in shapeColors" :key="c"
              class="we-shape-swatch"
              :class="{ active: shapeColor === c }"
              :style="{ background: c }"
              @click="shapeColor = c"
            ></button>
          </div>
          <button class="we-td-cancel" @click="showShapeDialog = false">Cancel</button>
        </div>
      </transition>

      <!-- A4 Document page -->
      <div class="we-page">
        <div
          ref="editor"
          class="we-content"
          contenteditable="true"
          spellcheck="true"
          @input="onInput"
          @keydown="onKeydown"
          @mouseup="updateFormat"
          @keyup="updateFormat"
          @paste="onPaste"
        ></div>
      </div>

    </div>

    <!-- ── Status Bar ── -->
    <div class="we-statusbar">
      <span class="we-status-item">
        <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ wordCount }} words
      </span>
      <span class="we-status-item">{{ charCount }} characters</span>
      <span class="we-status-sep">·</span>
      <span class="we-status-item">{{ fileExt?.toUpperCase() }} Document</span>
      <span class="we-status-sep">·</span>
      <span class="we-status-item we-status-zoom">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.3"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        100%
      </span>
    </div>

  </div>
</template>

<script>
import { authService } from '@/services/auth.js'

const BASE_URL = 'http://localhost:8000/api'

export default {
  name: 'WordEditor',

  data() {
    return {
      fileId:        null,
      docTitle:      'Untitled Document',
      fileExt:       'dd',
      editingTitle:  false,

      // Files opened here are always converted to DarkDune's native
      // .dd format first (see loadFile), so editing is always allowed.
      isEditable:    true,

      saveStatus:    'saved',
      autoSaveTimer: null,

      fmt: {
        bold:          false,
        italic:        false,
        underline:     false,
        strikethrough: false,
      },
      currentFont:     'Georgia, serif',
      currentSize:     '3',
      textColor:       '#1a1a1a',
      highlightColor:  '#ffff00',

      fonts: [
        { label: 'Georgia',         value: 'Georgia, serif' },
        { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
        { label: 'Calibri',         value: 'Calibri, "Segoe UI", sans-serif' },
        { label: 'Arial',           value: 'Arial, Helvetica, sans-serif' },
        { label: 'Verdana',         value: 'Verdana, Geneva, sans-serif' },
        { label: 'Courier New',     value: '"Courier New", Courier, monospace' },
        { label: 'Syne',            value: '"Syne", sans-serif' },
      ],

      fontSizes: [
        { label: '8',  cmd: '1' }, { label: '10', cmd: '2' },
        { label: '12', cmd: '3' }, { label: '14', cmd: '4' },
        { label: '18', cmd: '5' }, { label: '24', cmd: '6' },
        { label: '36', cmd: '7' },
      ],

      wordCount: 0,
      charCount: 0,

      showTableDialog: false,
      hoverRow:        0,
      hoverCol:        0,

      showShapeDialog: false,
      shapeColor:      '#c0392b',
      shapeColors:     ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#2c3e50', '#ffffff'],
      shapes: [
        { type: 'rectangle', label: 'Rectangle', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" stroke-width="1.6"/></svg>' },
        { type: 'circle',    label: 'Circle',    icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/></svg>' },
        { type: 'triangle',  label: 'Triangle',  icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4L21 20H3L12 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' },
        { type: 'line',      label: 'Line',      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20L20 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' },
        { type: 'arrow',     label: 'Arrow',     icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
        { type: 'star',      label: 'Star',      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L14.6 9H22L16 13.5L18.2 21L12 16.8L5.8 21L8 13.5L2 9H9.4L12 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' },
        { type: 'diamond',   label: 'Diamond',   icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3L21 12L12 21L3 12L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' },
        { type: 'pentagon',  label: 'Pentagon',  icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L21 9L17.5 20H6.5L3 9L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' },
      ],

      showFindReplace: false,
      findText:        '',
      replaceText:     '',
      findResult:      '',
    }
  },

  computed: {
    saveStatusText() {
      if (this.saveStatus === 'saved')  return 'All changes saved'
      if (this.saveStatus === 'saving') return 'Saving...'
      return 'Unsaved changes'
    },
    saveStatusClass() {
      if (this.saveStatus === 'saved')  return 'status-saved'
      if (this.saveStatus === 'saving') return 'status-saving'
      return 'status-unsaved'
    },
  },

  async mounted() {
    this.fileId = this.$route.params.id
    window.addEventListener('keydown', this.handleShortcut)
    if (this.fileId) {
      await this.loadFile()
    } else {
      this.initEditor('')
    }
    // Shapes carry their own native <input type="color"> / <input type="file">
    // fill controls inside the contenteditable area (see insertShape). These
    // are plain DOM, not Vue bindings, so we catch their events by delegation.
    this.$refs.editor?.addEventListener('input', this.handleShapeColorInput)
    this.$refs.editor?.addEventListener('change', this.handleShapeImageInput)
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleShortcut)
    clearTimeout(this.autoSaveTimer)
    this.$refs.editor?.removeEventListener('input', this.handleShapeColorInput)
    this.$refs.editor?.removeEventListener('change', this.handleShapeImageInput)
  },

  methods: {

    // ── API ──
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

    // ── Load file ──
    // Every file opened here is converted into DarkDune's native .dd
    // format first. The original upload (jpg, pdf, docx, etc.) is never
    // modified — the .dd is a separate, linked record that's safe to edit.
    async loadFile() {
      try {
        let res  = await this.api('GET', `/files/${this.fileId}`)
        let file = res.file

        if (file.extension !== 'dd') {
          const converted = await this.api('POST', `/files/${this.fileId}/convert-to-dd`)
          file = converted.file
          this.fileId = file.id
        }

        this.docTitle   = file.name      || 'Untitled'
        this.fileExt    = file.extension || 'dd'
        this.isEditable = true
        this.initEditor(file.content || '')
      } catch (err) {
        console.error('Failed to load file', err)
        this.initEditor('')
      }
    },

    // ── Init editor ──
    initEditor(htmlContent) {
      this.$nextTick(() => {
        const el = this.$refs.editor
        if (!el) return
        el.innerHTML = htmlContent || '<p><br></p>'
        el.focus()
        this.updateWordCount()
        this.saveStatus = 'saved'
      })
    },

    // ── execCommand — use mousedown.prevent on buttons to keep focus ──
    execCmd(cmd, value = null) {
      this.$refs.editor?.focus()
      document.execCommand(cmd, false, value)
      this.updateFormat()
    },

    formatBlock(tag) {
      this.$refs.editor?.focus()
      document.execCommand('formatBlock', false, tag)
      this.updateFormat()
    },

    // ── Track active formats ──
    updateFormat() {
      this.fmt.bold          = document.queryCommandState('bold')
      this.fmt.italic        = document.queryCommandState('italic')
      this.fmt.underline     = document.queryCommandState('underline')
      this.fmt.strikethrough = document.queryCommandState('strikeThrough')
    },

    // ── Input ──
    onInput() {
      this.updateWordCount()
      this.saveStatus = 'unsaved'
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = setTimeout(() => this.saveDocument(), 2000)
    },

    onKeydown(e) {
      if (e.key === 'Tab') {
        e.preventDefault()
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
      }
    },

    onPaste(e) {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    },

    // ── Word count ──
    updateWordCount() {
      const el = this.$refs.editor
      if (!el) return
      const text     = el.innerText || ''
      this.charCount = text.length
      this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    },

    // ── Save ──
    // A document opened via "New File" starts with no fileId at all —
    // nothing has been persisted yet. The backend's /files validation
    // only accepts real upload extensions/mime types (it never expects
    // 'dd' directly — .dd is normally only ever produced server-side by
    // convert-to-dd). So on first save we create a minimal, validated
    // .txt placeholder record, immediately convert *that* to .dd via
    // the same endpoint every uploaded file goes through, then push
    // this document's real HTML content onto the resulting .dd record.
    // Every save after that is just a normal update.
    //
    // NOTE: the seed record is intentionally never deleted. The seed
    // and its converted .dd are linked on the backend, and deleting the
    // seed cascade-deletes the .dd along with it (confirmed: it 404s on
    // the very next save). Instead the seed's *name* itself carries the
    // "__dd_seed__" marker (not a `tags` field — we can't be sure the
    // backend actually persists arbitrary custom fields like tags back,
    // so the filter in Startbuilding.vue can't safely depend on that).
    // The seed keeps the doc's real title only in `description`, purely
    // for debugging — nothing user-facing ever reads it.
    async saveDocument() {
      this.saveStatus = 'saving'
      const content = this.$refs.editor?.innerHTML || ''
      const title   = this.docTitle?.trim() || 'Untitled Document'
      try {
        if (!this.fileId) {
          const seedName = `__dd_seed__${Date.now()}`
          const seed = await this.api('POST', '/files', {
            name:          seedName,
            original_name: `${seedName}.txt`,
            local_path:    `${seedName}.txt`,
            mime_type:     'text/plain',
            extension:     'txt',
            size:          0,
            description:   `Internal placeholder for "${title}" — safe to ignore.`,
            tags:          ['__dd_seed__'],
          })
          const converted = await this.api('POST', `/files/${seed.file.id}/convert-to-dd`)
          this.fileId  = converted.file.id
          this.fileExt = 'dd'
          this.$router.replace(`/editor/${this.fileId}`)
        }
        await this.api('PUT', `/files/${this.fileId}/content`, { content })
        await this.api('PUT', `/files/${this.fileId}`, { name: title })
        this.saveStatus = 'saved'
      } catch (err) {
        this.saveStatus = 'unsaved'
        console.error('Save failed', err)
      }
    },

    // ── Title ──
    startEditTitle() {
      this.editingTitle = true
      this.$nextTick(() => this.$refs.titleInput?.select())
    },

    stopEditTitle() {
      this.editingTitle = false
      this.saveStatus   = 'unsaved'
    },

    // ── Table ──
    insertTable() {
      this.showTableDialog = true
      this.showShapeDialog = false
      this.hoverRow        = 0
      this.hoverCol        = 0
    },

    confirmInsertTable() {
      const rows = this.hoverRow
      const cols = this.hoverCol
      this.showTableDialog = false

      let html = '<table class="we-doc-table"><tbody>'
      for (let r = 0; r < rows; r++) {
        html += '<tr>'
        for (let c = 0; c < cols; c++) {
          html += '<td><br></td>'
        }
        html += '</tr>'
      }
      html += '</tbody></table><p><br></p>'

      this.$refs.editor?.focus()
      document.execCommand('insertHTML', false, html)
      this.onInput()
    },

    // ── Image ──
    insertImage(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        this.$refs.editor?.focus()
        document.execCommand('insertHTML', false,
          `<img src="${ev.target.result}" class="we-doc-img" style="max-width:100%;height:auto;" alt="image"/>`)
        this.onInput()
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    },

    // ── Shapes ──
    toggleShapeDialog() {
      this.showShapeDialog = !this.showShapeDialog
      this.showTableDialog = false
    },

    // CSS clip-path for each closed shape type, used on the fillable
    // layer so it can hold a solid color OR a background image.
    // 'line' and 'arrow' have no interior area, so they're excluded —
    // they stay simple strokes, not fillable/textable blocks.
    shapeClipPath(type) {
      const paths = {
        rectangle: 'none',
        circle:    'none',
        triangle:  'polygon(50% 0%, 100% 100%, 0% 100%)',
        diamond:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        pentagon:  'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        star:      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      }
      return paths[type] || paths.rectangle
    },

    isFillableShape(type) {
      return !['line', 'arrow'].includes(type)
    },

    // Inserts a resizable shape block into the document. The outer
    // wrapper is contenteditable="false" (so resizing/dragging it
    // doesn't get mangled as text), but it contains a genuinely
    // contenteditable text layer so the user can type inside the
    // shape, plus small color-fill / image-fill controls that appear
    // on hover.
    insertShape(type) {
      this.showShapeDialog = false
      this.$refs.editor?.focus()
      const color = this.shapeColor
      let html

      if (!this.isFillableShape(type)) {
        const strokes = {
          line:  `<line x1="6" y1="114" x2="194" y2="6" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`,
          arrow: `<path d="M6 60H176M176 60L128 18M176 60L128 102" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
        }
        html = `<div class="we-doc-shape we-doc-shape--line" contenteditable="false" data-shape="${type}">` +
          `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${strokes[type]}</svg>` +
          `</div>`
      } else {
        const clipPath = this.shapeClipPath(type)
        const shapeStyle = type === 'circle' ? 'border-radius:50%;' : `clip-path:${clipPath};`
        html = `<div class="we-doc-shape" contenteditable="false" data-shape="${type}">` +
            `<div class="we-shape-fill" style="${shapeStyle}background-color:${color};"></div>` +
            `<div class="we-shape-text" contenteditable="true" data-placeholder="Add text..."></div>` +
            `<div class="we-shape-controls" contenteditable="false">` +
              `<label class="we-shape-ctrl-btn" title="Fill color">` +
                `<input type="color" class="we-shape-color-input" value="${color}">` +
                `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="15" cy="10" r="1.3" fill="currentColor"/><circle cx="12" cy="15" r="1.3" fill="currentColor"/></svg>` +
              `</label>` +
              `<label class="we-shape-ctrl-btn" title="Fill with image">` +
                `<input type="file" accept="image/*" class="we-shape-image-input" hidden>` +
                `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor"/><path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
              `</label>` +
            `</div>` +
          `</div>`
      }

      document.execCommand('insertHTML', false, html)
      this.onInput()
    },

    // Live color-fill: the shape's <input type="color"> fires native
    // 'input' events as the user drags the picker.
    handleShapeColorInput(e) {
      const target = e.target
      if (!target.classList || !target.classList.contains('we-shape-color-input')) return
      const fill = target.closest('.we-doc-shape')?.querySelector('.we-shape-fill')
      if (fill) {
        fill.style.backgroundImage = 'none'
        fill.style.backgroundColor = target.value
      }
      this.onInput()
    },

    // Image-fill: reads the chosen file and applies it as a cover
    // background on the shape's fill layer, replacing any flat color.
    handleShapeImageInput(e) {
      const target = e.target
      if (!target.classList || !target.classList.contains('we-shape-image-input')) return
      const file = target.files && target.files[0]
      if (!file) return
      const shapeEl = target.closest('.we-doc-shape')
      const fill    = shapeEl?.querySelector('.we-shape-fill')
      const reader  = new FileReader()
      reader.onload = (ev) => {
        if (fill) {
          fill.style.backgroundImage    = `url(${ev.target.result})`
          fill.style.backgroundSize     = 'cover'
          fill.style.backgroundPosition = 'center'
          fill.style.backgroundColor    = 'transparent'
        }
        this.onInput()
      }
      reader.readAsDataURL(file)
      target.value = ''
    },

    // ── Find & Replace ──
    toggleFindReplace() {
      this.showFindReplace = !this.showFindReplace
      this.findResult      = ''
    },

    findNext() {
      if (!this.findText) return
      const found = window.find(this.findText, false, false, true)
      this.findResult = found ? '' : 'No more results'
    },

    findPrev() {
      if (!this.findText) return
      const found = window.find(this.findText, false, true, true)
      this.findResult = found ? '' : 'No more results'
    },

    replaceOne() {
      if (!this.findText) return
      const found = window.find(this.findText)
      if (found) {
        document.execCommand('insertText', false, this.replaceText)
        this.onInput()
      } else {
        this.findResult = 'Text not found'
      }
    },

    replaceAll() {
      if (!this.findText) return
      const el      = this.$refs.editor
      const content = el.innerHTML
      const escaped = this.findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex   = new RegExp(escaped, 'gi')
      const count   = (content.match(regex) || []).length
      if (count === 0) { this.findResult = 'Text not found'; return }
      el.innerHTML  = content.replace(regex, this.replaceText)
      this.findResult = `Replaced ${count} occurrence${count !== 1 ? 's' : ''}`
      this.onInput()
    },

    // ── Keyboard shortcuts ──
    handleShortcut(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') { e.preventDefault(); this.saveDocument() }
        if (e.key === 'h') { e.preventDefault(); this.toggleFindReplace() }
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;700&display=swap');

/* ── Layout ── */
.we-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #e8e8e8;
  font-family: 'Syne', sans-serif;
  overflow: hidden;
}

/* ── Title Bar ── */
.we-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e1e1e;
  padding: 0 1rem;
  height: 44px;
  flex-shrink: 0;
  border-bottom: 1px solid #111;
  gap: 1rem;
}
.we-titlebar__left,
.we-titlebar__right { display: flex; align-items: center; gap: 10px; flex: 1; }
.we-titlebar__right  { justify-content: flex-end; }
.we-titlebar__center { flex-shrink: 0; }

.we-back {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 5px;
  color: #888; text-decoration: none; transition: all 0.15s;
}
.we-back svg { width: 16px; height: 16px; }
.we-back:hover { background: rgba(255,255,255,0.08); color: #fff; }

.we-doc-icon svg { width: 16px; height: 20px; flex-shrink: 0; }

.we-doc-title { display: flex; flex-direction: column; min-width: 0; }
.we-doc-name {
  font-size: 13px; font-weight: 600; color: #e0dbd4;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  cursor: text; max-width: 240px;
}
.we-doc-name:hover { color: #fff; }
.we-title-input {
  background: rgba(255,255,255,0.08);
  border: 1px solid #c0392b; border-radius: 3px;
  color: #fff; font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 600;
  padding: 1px 6px; outline: none; width: 200px;
}
.we-doc-path { font-size: 10px; color: #555; margin-top: 1px; }

.we-app-name { font-size: 13px; font-weight: 700; color: #555; letter-spacing: 0.06em; text-transform: uppercase; }
.we-app-accent { color: #c0392b; }

.we-save-status {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; white-space: nowrap;
}
.we-save-status svg { width: 13px; height: 13px; }
.status-saved   { color: #27ae60; }
.status-unsaved { color: #f39c12; }
.status-saving  { color: #888; }

.we-save-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 14px;
  background: #c0392b; border: none; border-radius: 5px;
  color: white; font-family: 'Syne', sans-serif;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
}
.we-save-btn svg { width: 13px; height: 13px; }
.we-save-btn:hover:not(:disabled) { background: #e74c3c; box-shadow: 0 2px 10px rgba(192,57,43,0.4); }
.we-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Ribbon ── */
.we-ribbon {
  background: #2b2b2b;
  border-bottom: 1px solid #111;
  flex-shrink: 0;
}

.we-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 10px;
  gap: 2px;
}

.we-tool-group { display: flex; align-items: center; gap: 2px; }

.we-divider { width: 1px; height: 22px; background: #444; margin: 0 6px; flex-shrink: 0; }

/* ── Toolbar buttons — NO file input inside ── */
.we-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px; height: 28px;
  padding: 0 5px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #d0ccc6;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Syne', sans-serif;
  transition: all 0.12s;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}
.we-btn svg { width: 15px; height: 15px; flex-shrink: 0; pointer-events: none; }
.we-btn:hover  { background: #3a3a3a; border-color: #555; }
.we-btn.active { background: rgba(192,57,43,0.25); border-color: #c0392b; color: #e74c3c; }

.we-heading { font-size: 11px; font-weight: 700; min-width: 26px; }

/* Color buttons — no nested input, triggered via ref -->*/
.we-color-btn {
  flex-direction: column;
  gap: 2px;
  height: 30px;
}
.we-color-bar { width: 15px; height: 3px; border-radius: 1px; }

/* Selects */
.we-select {
  background: #3a3a3a; border: 1px solid #555; border-radius: 4px;
  color: #d0ccc6; font-family: 'Syne', sans-serif;
  font-size: 12px; padding: 3px 4px; outline: none;
  cursor: pointer; height: 28px;
}
.we-font-family { width: 130px; }
.we-font-size   { width: 50px; }
.we-select:focus { border-color: #c0392b; }

/* ── Find & Replace ── */
.we-find-replace {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 14px; background: #272727;
  border-top: 1px solid #111; flex-wrap: wrap; position: relative;
}
.we-fr-group { display: flex; align-items: center; gap: 6px; }
.we-fr-label { font-size: 11px; color: #888; width: 50px; text-align: right; flex-shrink: 0; }
.we-fr-input {
  background: #3a3a3a; border: 1px solid #555; border-radius: 4px;
  color: #d0ccc6; font-family: 'Syne', sans-serif; font-size: 12px;
  padding: 4px 8px; outline: none; width: 180px;
}
.we-fr-input:focus { border-color: #c0392b; }
.we-fr-btn {
  padding: 4px 10px; background: #444; border: 1px solid #555;
  border-radius: 4px; color: #d0ccc6; font-family: 'Syne', sans-serif;
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.12s; white-space: nowrap;
}
.we-fr-btn:hover { border-color: #e74c3c; color: #e74c3c; }
.we-fr-btn--accent { background: rgba(192,57,43,0.15); border-color: #c0392b; color: #e74c3c; }
.we-fr-btn--accent:hover { background: rgba(192,57,43,0.3); }
.we-fr-result { font-size: 11px; color: #888; }
.we-fr-close {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #666; cursor: pointer;
  font-size: 14px; padding: 4px; transition: color 0.12s;
}
.we-fr-close:hover { color: #e74c3c; }

.slide-down-enter-active, .slide-down-leave-active { transition: max-height 0.2s ease, opacity 0.2s ease; overflow: hidden; max-height: 80px; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }

/* ── Page Area ── */
.we-page-area {
  flex: 1; overflow-y: auto;
  background: #ffffff;
  padding: 2rem 1rem;
  display: flex; flex-direction: column; align-items: center;
  position: relative;
}

/* Table dialog */
.we-table-dialog {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  background: #2b2b2b; border: 1px solid #444; border-radius: 10px;
  padding: 1rem; z-index: 100;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.we-td-title { font-size: 13px; color: #d0ccc6; font-weight: 600; }
.we-td-grid  { display: flex; flex-direction: column; gap: 2px; }
.we-td-row   { display: flex; gap: 2px; }
.we-td-cell  { width: 18px; height: 18px; background: #3a3a3a; border: 1px solid #555; border-radius: 2px; cursor: pointer; transition: all 0.1s; }
.we-td-cell.active { background: rgba(192,57,43,0.4); border-color: #c0392b; }
.we-td-label { font-size: 12px; color: #888; }
.we-td-cancel {
  padding: 4px 12px; background: #444; border: 1px solid #555;
  border-radius: 4px; color: #d0ccc6; font-family: 'Syne', sans-serif;
  font-size: 11px; cursor: pointer; transition: all 0.12s;
}
.we-td-cancel:hover { border-color: #e74c3c; color: #e74c3c; }

/* Shape dialog */
.we-shape-dialog { align-items: stretch; }
.we-shape-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.we-shape-cell {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: #3a3a3a; border: 1px solid #555; border-radius: 6px;
  color: #d0ccc6; cursor: pointer; transition: all 0.12s;
}
.we-shape-cell svg { width: 18px; height: 18px; }
.we-shape-cell:hover { border-color: #c0392b; color: #e74c3c; background: rgba(192,57,43,0.15); }
.we-shape-colors { display: flex; gap: 6px; justify-content: center; padding-top: 2px; }
.we-shape-swatch {
  width: 18px; height: 18px; border-radius: 50%; border: 2px solid transparent;
  cursor: pointer; box-shadow: 0 0 0 1px #555;
}
.we-shape-swatch.active { border-color: #fff; box-shadow: 0 0 0 1px #c0392b; }

/* Inserted shapes — resizable, sit inline like an image */
.we-content :deep(.we-doc-shape) {
  position: relative; display: inline-block; width: 200px; height: 120px;
  min-width: 40px; min-height: 30px; max-width: 100%;
  margin: 0.5em 0; resize: both; overflow: hidden; vertical-align: top;
}
.we-content :deep(.we-doc-shape--line) { resize: both; }
.we-content :deep(.we-doc-shape svg) { width: 100%; height: 100%; display: block; }

.we-content :deep(.we-shape-fill) {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.we-content :deep(.we-shape-text) {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 10%; box-sizing: border-box; outline: none;
  color: #1a1a1a; font-size: 14px; line-height: 1.3; cursor: text; overflow: hidden;
}
.we-content :deep(.we-shape-text:empty::before) {
  content: attr(data-placeholder); color: rgba(0,0,0,0.35); pointer-events: none;
}

.we-content :deep(.we-shape-controls) {
  position: absolute; top: 5px; right: 5px; display: flex; gap: 4px;
  opacity: 0; transition: opacity 0.15s; pointer-events: none;
}
.we-content :deep(.we-doc-shape:hover .we-shape-controls) { opacity: 1; pointer-events: auto; }
.we-content :deep(.we-shape-ctrl-btn) {
  display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;
  background: rgba(20,20,20,0.72); border: 1px solid rgba(255,255,255,0.25); border-radius: 5px;
  color: #ede8df; cursor: pointer;
}
.we-content :deep(.we-shape-ctrl-btn:hover) { background: #c0392b; border-color: #c0392b; }
.we-content :deep(.we-shape-ctrl-btn svg) { width: 13px; height: 13px; pointer-events: none; }
.we-content :deep(.we-shape-color-input) {
  position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── A4 Page ── */
.we-page {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: none;
  border-radius: 0;
  padding: 25mm 20mm;
  box-sizing: border-box;
}

/* ── Editable content ── */
.we-content {
  outline: none;
  min-height: 240mm;
  font-family: 'Georgia', serif;
  font-size: 12pt;
  line-height: 1.8;
  color: #1a1a1a;
  caret-color: #c0392b;
  word-break: break-word;
}
.we-content p  { margin: 0 0 0.5em; }
.we-content h1 { font-size: 2em;   font-weight: 700; margin: 0.8em 0 0.4em; color: #111; }
.we-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.7em 0 0.35em; color: #1a1a1a; }
.we-content h3 { font-size: 1.2em; font-weight: 600; margin: 0.6em 0 0.3em; color: #222; }
.we-content ul, .we-content ol { padding-left: 2em; margin: 0.4em 0; }
.we-content li { margin-bottom: 0.2em; }

/* Tables inside document */
.we-content :deep(.we-doc-table) {
  border-collapse: collapse; width: 100%; margin: 1em 0;
}
.we-content :deep(.we-doc-table td),
.we-content :deep(.we-doc-table th) {
  border: 1px solid #ccc; padding: 6px 10px;
  min-width: 60px; vertical-align: top;
}
.we-content :deep(.we-doc-table tr:first-child td) {
  background: #f5f5f5; font-weight: 600;
}
.we-content :deep(.we-doc-img) {
  max-width: 100%; height: auto; display: block; margin: 0.5em 0;
}
.we-content ::selection { background: rgba(192,57,43,0.18); }

/* ── Status Bar ── */
.we-statusbar {
  display: flex; align-items: center; gap: 12px;
  padding: 4px 14px; background: #1e1e1e;
  border-top: 1px solid #111; flex-shrink: 0; height: 28px;
}
.we-status-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #666; }
.we-status-item svg { width: 12px; height: 12px; }
.we-status-sep  { color: #333; }
.we-status-zoom { margin-left: auto; }

/* Spinner */
.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 800px) {
  .we-page { width: 100%; padding: 10mm; }
  .we-font-family { width: 90px; }
  .we-page-area { padding: 1rem 0.25rem; }
}

@media print {
  .we-titlebar, .we-ribbon, .we-statusbar { display: none; }
  .we-page-area { background: white; padding: 0; }
  .we-page { box-shadow: none; }
}
</style>