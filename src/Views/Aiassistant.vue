<template>
  <div class="ai-wrapper">
    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <div class="ai-container">

      <!-- ── Header ── -->
      <div class="page-header">
        <div class="page-header__left">
          
          <h1 class="page-title"><i>DarkDune Assistant</i></h1>
          <p class="page-subtitle">Ask it to create, find, rename, or open documents — it always asks before doing anything.</p>
        </div>
      </div>

      <!-- ── Not configured ── -->
      <div v-if="notConfigured" class="alert alert-error">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ notConfigured }}
      </div>

      <!-- ── Chat panel ── -->
      <div class="ai-panel">
        <div class="ai-log" ref="log">

          <div v-if="messages.length === 0" class="ai-empty">
            <svg viewBox="0 0 24 24" fill="none" class="empty-icon"><path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
            <p>Try one of these to get started:</p>
            <div class="ai-suggestions">
              <button v-for="s in suggestions" :key="s" class="ai-suggestion" @click="send(s)">{{ s }}</button>
            </div>
          </div>

          <div v-for="(m, i) in messages" :key="i" class="ai-msg" :class="`ai-msg--${m.role}`">
            <div class="ai-msg__bubble">{{ m.content }}</div>

            <div v-if="m.actions && m.actions.length" class="ai-actions">
              <div v-for="(a, ai2) in m.actions" :key="ai2" class="ai-action-card" :class="{ 'ai-action-card--danger': a.type === 'delete_document', 'ai-action-card--done': a.status === 'done', 'ai-action-card--error': a.status === 'error' }">
                <div class="ai-action-card__label">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path v-if="a.type === 'delete_document'" d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path v-else-if="a.type === 'create_document'" d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <path v-else-if="a.type === 'navigate'" d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path v-else d="M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.1022 19.5 3.5C19.8978 3.8978 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.1022 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ a.label }}
                </div>

                <div v-if="!a.status" class="ai-action-card__buttons">
                  <button class="ai-btn-confirm" @click="confirmAction(m, a)">Confirm</button>
                  <button class="ai-btn-cancel" @click="cancelAction(a)">Cancel</button>
                </div>
                <div v-else-if="a.status === 'done'" class="ai-action-card__status">✓ Done</div>
                <div v-else-if="a.status === 'cancelled'" class="ai-action-card__status">Cancelled</div>
                <div v-else-if="a.status === 'error'" class="ai-action-card__status ai-action-card__status--error">{{ a.error || 'Failed' }}</div>
              </div>
            </div>
          </div>

          <div v-if="isThinking" class="ai-msg ai-msg--assistant">
            <div class="ai-msg__bubble ai-msg__bubble--thinking">
              <span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span>
            </div>
          </div>
        </div>

        <div class="ai-input-row">
          <input
            v-model="draft"
            type="text"
            placeholder="Ask the assistant to create, find, or open a document..."
            :disabled="isThinking"
            @keydown.enter="send()"
          />
          <button class="ai-send-btn" :disabled="isThinking || !draft.trim()" @click="send()">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth.js'

const BASE_URL = 'http://localhost:8000/api'

export default {
  name: 'AIAssistant',

  data() {
    return {
      messages:      [],
      draft:         '',
      isThinking:    false,
      notConfigured: '',
      documents:     [],
      suggestions: [
        'Create a new blank document',
        'What documents do I have?',
        'Take me to the Dashboard',
      ],
    }
  },

  async mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    await this.refreshDocuments()
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

    // Keeps a lightweight, current list of real documents so the
    // assistant can reference actual ids instead of guessing at them.
    async refreshDocuments() {
      try {
        const res = await this.api('GET', '/files')
        this.documents = (res.files || [])
          .filter(f => !String(f.name || '').startsWith('__dd_seed__'))
          .map(f => ({ id: f.id, name: f.name, extension: f.extension }))
          .slice(0, 40)
      } catch (err) {
        // Non-fatal — the assistant just won't have document context yet.
        console.error('Could not load documents for AI context', err)
      }
    },

    async send(text) {
      const message = (text ?? this.draft).trim()
      if (!message || this.isThinking) return
      this.draft = ''
      this.notConfigured = ''

      this.messages.push({ role: 'user', content: message })
      this.scrollToBottom()

      const history = this.messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(0, -1)
        .map(m => ({ role: m.role, content: m.content }))

      this.isThinking = true
      try {
        const res = await this.api('POST', '/ai/chat', {
          message,
          history,
          context: {
            documents:   this.documents,
            currentPage: 'AI Assistant',
          },
        })
        this.messages.push({
          role:    'assistant',
          content: res.reply || "I didn't get a response — try again.",
          actions: (res.actions || []).map(a => ({ ...a })),
        })
      } catch (err) {
        if (err?.status === 503) {
          this.notConfigured = err?.data?.error || 'The AI Assistant is not configured yet.'
        } else {
          this.messages.push({ role: 'assistant', content: "Something went wrong reaching the assistant. Please try again." })
        }
      } finally {
        this.isThinking = false
        this.scrollToBottom()
      }
    },

    // ── Executing a confirmed action ──
    // This is the only place any real /files call happens as a result
    // of the AI's suggestions — nothing runs until the user clicks
    // Confirm on a specific action card.
    async confirmAction(message, action) {
      try {
        if (action.type === 'create_document') {
          const title = action.params?.title?.trim() || 'Untitled Document'
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
          if (title !== 'Untitled Document') {
            await this.api('PUT', `/files/${converted.file.id}`, { name: title })
          }
          action.status = 'done'
          this.$router.push(`/editor/${converted.file.id}`)

        } else if (action.type === 'open_document') {
          const id = action.params?.id
          if (!id) throw new Error('Missing document id')
          action.status = 'done'
          this.$router.push(`/editor/${id}`)

        } else if (action.type === 'rename_document') {
          const { id, new_name } = action.params || {}
          if (!id || !new_name) throw new Error('Missing id or new name')
          await this.api('PUT', `/files/${id}`, { name: new_name })
          action.status = 'done'
          await this.refreshDocuments()

        } else if (action.type === 'delete_document') {
          const id = action.params?.id
          if (!id) throw new Error('Missing document id')
          if (!confirm('Delete this document? This can\'t be undone.')) {
            action.status = 'cancelled'
            return
          }
          await this.api('DELETE', `/files/${id}`)
          action.status = 'done'
          await this.refreshDocuments()

        } else if (action.type === 'navigate') {
          const path = action.params?.path || '/'
          action.status = 'done'
          this.$router.push(path)

        } else {
          throw new Error('Unknown action type')
        }
      } catch (err) {
        action.status = 'error'
        action.error  = err?.data?.error || err?.message || 'Action failed'
      }
    },

    cancelAction(action) {
      action.status = 'cancelled'
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const log = this.$refs.log
        if (log) log.scrollTop = log.scrollHeight
      })
    },

    // ── Background hex grid (matches the rest of the app) ──
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

.ai-wrapper { position: relative; min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: var(--font-body); display: flex; flex-direction: column; }
.hex-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.55; }
.ai-container { position: relative; z-index: 1; max-width: 900px; width: 100%; margin: 0 auto; padding: 2.5rem 2rem 2rem; display: flex; flex-direction: column; flex: 1; min-height: 0; }

.alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 1.25rem; }
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }

.page-header { margin-bottom: 1.5rem; }
.page-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 0.75rem; }
.breadcrumb-link { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
.breadcrumb-link:hover { color: var(--volcanic-glow); }
.breadcrumb-link svg { width: 13px; height: 13px; }
.breadcrumb-sep { width: 14px; height: 14px; color: var(--text-muted); }
.breadcrumb-current { font-size: 12px; color: var(--volcanic-glow); }
.page-title { font-family: var(--font-display); font-size: 2.4rem; font-weight: 600; margin: 0 0 6px; letter-spacing: 0.01em; }
.page-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6; }

.ai-panel { flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.ai-log { flex: 1; min-height: 0; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 14px; }

.ai-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 3rem 1rem; text-align: center; margin: auto; }
.empty-icon { width: 34px; height: 34px; color: var(--volcanic-glow); opacity: 0.6; }
.ai-empty p { font-size: 13px; color: var(--text-muted); margin: 0; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 480px; }
.ai-suggestion { padding: 8px 14px; background: var(--raised); border: 1px solid var(--border); border-radius: 20px; color: var(--text-secondary); font-family: var(--font-body); font-size: 12px; cursor: pointer; transition: all 0.15s; }
.ai-suggestion:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

.ai-msg { display: flex; flex-direction: column; max-width: 80%; }
.ai-msg--user { align-self: flex-end; align-items: flex-end; }
.ai-msg--assistant { align-self: flex-start; align-items: flex-start; }
.ai-msg__bubble { padding: 10px 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; }
.ai-msg--user .ai-msg__bubble { background: var(--volcanic); color: #fff; border-bottom-right-radius: 3px; }
.ai-msg--assistant .ai-msg__bubble { background: var(--raised); color: var(--text-primary); border: 1px solid var(--border); border-bottom-left-radius: 3px; }
.ai-msg__bubble--thinking { display: flex; gap: 4px; padding: 14px; }
.ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: ai-bounce 1.1s infinite ease-in-out; }
.ai-dot:nth-child(2) { animation-delay: 0.15s; }
.ai-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes ai-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

.ai-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; width: 100%; }
.ai-action-card { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; }
.ai-action-card--danger { border-color: rgba(192,57,43,0.4); }
.ai-action-card--done { opacity: 0.7; }
.ai-action-card--error { border-color: rgba(192,57,43,0.6); }
.ai-action-card__label { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text-primary); }
.ai-action-card__label svg { width: 14px; height: 14px; color: var(--volcanic-glow); flex-shrink: 0; }
.ai-action-card__buttons { display: flex; gap: 6px; flex-shrink: 0; }
.ai-btn-confirm { padding: 5px 12px; background: var(--volcanic); border: 1px solid var(--volcanic); border-radius: 6px; color: #fff; font-family: var(--font-body); font-size: 11px; font-weight: 600; cursor: pointer; }
.ai-btn-confirm:hover { background: var(--volcanic-glow); border-color: var(--volcanic-glow); }
.ai-btn-cancel { padding: 5px 12px; background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); font-family: var(--font-body); font-size: 11px; cursor: pointer; }
.ai-btn-cancel:hover { color: var(--text-secondary); border-color: var(--text-secondary); }
.ai-action-card__status { font-size: 11.5px; color: var(--text-muted); flex-shrink: 0; }
.ai-action-card__status--error { color: var(--volcanic-glow); }

.ai-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--border); }
.ai-input-row input { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--text-primary); font-family: var(--font-body); font-size: 13px; outline: none; }
.ai-input-row input:focus { border-color: var(--volcanic-glow); }
.ai-input-row input::placeholder { color: var(--text-muted); }
.ai-send-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--volcanic); border: none; border-radius: 8px; color: #fff; cursor: pointer; flex-shrink: 0; transition: background 0.15s; }
.ai-send-btn svg { width: 16px; height: 16px; }
.ai-send-btn:hover:not(:disabled) { background: var(--volcanic-glow); }
.ai-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

@media (max-width: 700px) {
  .ai-container { padding: 1.5rem 1rem 1rem; }
  .page-title { font-size: 1.8rem; }
  .ai-msg { max-width: 92%; }
}
</style>