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

      <!-- ── Body: sidebar + chat panel ── -->
      <div class="ai-body">

        <!-- ── Conversations sidebar ── -->
        <div class="ai-sidebar">
          <button class="ai-new-convo" @click="startNewConversation">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            New conversation
          </button>

          <div class="ai-convo-list">
            <div
              v-for="c in conversations"
              :key="c.id"
              class="ai-convo-item"
              :class="{ 'ai-convo-item--active': c.id === currentConversationId }"
              @click="selectConversation(c.id)"
            >
              <template v-if="renamingId === c.id">
                <input
                  v-model="renameDraft"
                  class="ai-convo-rename-input"
                  @click.stop
                  @keydown.enter="confirmRename(c)"
                  @keydown.esc="renamingId = null"
                  @blur="confirmRename(c)"
                  ref="renameInput"
                />
              </template>
              <template v-else>
                <span class="ai-convo-title">{{ c.title }}</span>
                <div class="ai-convo-actions">
                  <button class="ai-convo-icon-btn" title="Rename" @click.stop="beginRename(c)">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.1022 19.5 3.5C19.8978 3.8978 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.1022 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="ai-convo-icon-btn ai-convo-icon-btn--danger" title="Delete" @click.stop="deleteConversation(c)">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </template>
            </div>

            <p v-if="conversations.length === 0" class="ai-convo-empty">No conversations yet</p>
          </div>
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
              <img
                v-if="m.attachment || m.attachment_url"
                :src="m.attachment || m.attachment_url"
                class="ai-msg__image"
                alt="Attached image"
              />
              <div v-if="m.content" class="ai-msg__bubble" :class="{ 'ai-msg__bubble--error': m.isError }">{{ m.content }}</div>

              <button v-if="m.isError" class="ai-retry-btn" :disabled="isThinking" @click="retry(i)">
                <svg viewBox="0 0 24 24" fill="none"><path d="M23 4V10H17M1 20V14H7M3.51 9C4.31 6.94 5.77 5.19 7.67 4.02C9.57 2.85 11.8 2.33 14.01 2.54C16.22 2.75 18.31 3.68 19.94 5.19C21.57 6.71 22.65 8.72 23 10.91M1 13.09C1.35 15.28 2.43 17.29 4.06 18.81C5.69 20.32 7.78 21.25 9.99 21.46C12.2 21.67 14.43 21.15 16.33 19.98C18.23 18.81 19.69 17.06 20.49 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Retry
              </button>

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

          <!-- ── Pending attachment preview ── -->
          <div v-if="pendingAttachment" class="ai-attach-preview">
            <img :src="pendingAttachment.dataUrl" alt="Selected image" />
            <button class="ai-attach-remove" title="Remove image" @click="removeAttachment">
              <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="ai-input-row">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="ai-file-input-hidden"
              @change="onFileSelected"
            />
            <button
              class="ai-attach-btn"
              title="Attach an image"
              :disabled="isThinking"
              @click="triggerAttach"
            >
              <svg viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24C11.1245 21.3655 9.59695 21.9977 8.005 21.9977C6.41305 21.9977 4.88555 21.3655 3.76 20.24C2.63445 19.1145 2.00228 17.587 2.00228 15.995C2.00228 14.403 2.63445 12.8755 3.76 11.75L12.95 2.56C13.7006 1.80943 14.7186 1.38773 15.78 1.38773C16.8414 1.38773 17.8594 1.80943 18.61 2.56C19.3606 3.31057 19.7823 4.32856 19.7823 5.39C19.7823 6.45144 19.3606 7.46943 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <input
              v-model="draft"
              type="text"
              placeholder="Ask the assistant to create, find, or open a document..."
              :disabled="isThinking"
              @keydown.enter="send()"
            />
            <button class="ai-send-btn" :disabled="isThinking || (!draft.trim() && !pendingAttachment)" @click="send()">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
const LAST_CONVERSATION_KEY = 'darkdune_ai_last_conversation_id'
const DRAFT_KEY_PREFIX = 'darkdune_ai_draft_'
const MAX_IMAGE_DIMENSION = 1600
const IMAGE_QUALITY = 0.82

export default {
  name: 'AIAssistant',

  data() {
    return {
      messages:              [],
      draft:                 '',
      pendingAttachment:     null, // { dataUrl, mimeType, base64 }
      isThinking:            false,
      notConfigured:         '',
      documents:             [],
      conversations:         [],
      currentConversationId: null,
      renamingId:            null,
      renameDraft:           '',
      suggestions: [
        'Create a new blank document',
        'What documents do I have?',
        'Take me to the Dashboard',
      ],
    }
  },

  watch: {
    draft(newVal) {
      const key = this.draftKey(this.currentConversationId)
      if (newVal) {
        localStorage.setItem(key, newVal)
      } else {
        localStorage.removeItem(key)
      }
    },
  },

  async mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    await this.refreshDocuments()
    await this.loadConversations()

    // Resume whatever conversation was open last time this page was
    // visited, so switching tabs and coming back doesn't lose anything.
    const lastId = localStorage.getItem(LAST_CONVERSATION_KEY)
    if (lastId && this.conversations.some(c => String(c.id) === String(lastId))) {
      await this.selectConversation(Number(lastId))
    } else {
      // No conversation to resume — but there might still be an
      // unsent draft from before the tab was switched away.
      this.draft = localStorage.getItem(this.draftKey(null)) || ''
    }
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

    // ── Conversations ──

    async loadConversations() {
      try {
        const res = await this.api('GET', '/ai/conversations')
        this.conversations = res.conversations || []
      } catch (err) {
        console.error('Could not load conversations', err)
      }
    },

    async selectConversation(id) {
      if (this.currentConversationId === id) return
      try {
        const res = await this.api('GET', `/ai/conversations/${id}`)
        const conv = res.conversation
        this.currentConversationId = conv.id
        this.messages = (conv.messages || []).map(m => ({
          role:           m.role,
          content:        m.content,
          actions:        (m.actions || []).map(a => ({ ...a })),
          attachment_url: m.attachment_url || null,
        }))
        localStorage.setItem(LAST_CONVERSATION_KEY, String(conv.id))
        this.draft = localStorage.getItem(this.draftKey(conv.id)) || ''
        this.pendingAttachment = null
        this.scrollToBottom()
      } catch (err) {
        console.error('Could not load conversation', err)
        // If it no longer exists (e.g. deleted elsewhere), fall back cleanly.
        this.startNewConversation()
        await this.loadConversations()
      }
    },

    startNewConversation() {
      // No backend row is created until the first message is actually
      // sent — this just clears the slate locally.
      this.currentConversationId = null
      this.messages = []
      this.notConfigured = ''
      this.pendingAttachment = null
      localStorage.removeItem(LAST_CONVERSATION_KEY)
      this.draft = localStorage.getItem(this.draftKey(null)) || ''
    },

    draftKey(conversationId) {
      return `${DRAFT_KEY_PREFIX}${conversationId ?? 'new'}`
    },

    beginRename(conv) {
      this.renamingId  = conv.id
      this.renameDraft = conv.title
      this.$nextTick(() => {
        const input = this.$refs.renameInput
        const el = Array.isArray(input) ? input[0] : input
        if (el) el.focus()
      })
    },

    async confirmRename(conv) {
      if (this.renamingId !== conv.id) return
      const title = this.renameDraft.trim()
      this.renamingId = null
      if (!title || title === conv.title) return
      try {
        await this.api('PUT', `/ai/conversations/${conv.id}`, { title })
        conv.title = title
      } catch (err) {
        console.error('Could not rename conversation', err)
      }
    },

    async deleteConversation(conv) {
      if (!confirm(`Delete "${conv.title}"? This can't be undone.`)) return
      try {
        await this.api('DELETE', `/ai/conversations/${conv.id}`)
        this.conversations = this.conversations.filter(c => c.id !== conv.id)
        localStorage.removeItem(this.draftKey(conv.id))
        if (this.currentConversationId === conv.id) {
          this.startNewConversation()
        }
      } catch (err) {
        console.error('Could not delete conversation', err)
      }
    },

    // ── Attachments ──

    triggerAttach() {
      this.$refs.fileInput.click()
    },

    onFileSelected(event) {
      const file = event.target.files && event.target.files[0]
      event.target.value = '' // allows selecting the same file again later
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.')
        return
      }

      this.resizeImage(file)
        .then(result => { this.pendingAttachment = result })
        .catch(err => {
          console.error('Could not process image', err)
          alert('Could not process that image — try a different one.')
        })
    },

    removeAttachment() {
      this.pendingAttachment = null
    },

    /**
     * Downscales and re-encodes an image client-side before it ever
     * reaches the server, so a full-resolution phone photo doesn't
     * eat into API request limits or the free-tier quota.
     */
    resizeImage(file) {
      return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file)
        const img = new Image()

        img.onload = () => {
          let { width, height } = img
          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            if (width > height) {
              height = Math.round(height * (MAX_IMAGE_DIMENSION / width))
              width  = MAX_IMAGE_DIMENSION
            } else {
              width  = Math.round(width * (MAX_IMAGE_DIMENSION / height))
              height = MAX_IMAGE_DIMENSION
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width  = width
          canvas.height = height
          canvas.getContext('2d').drawImage(img, 0, 0, width, height)

          URL.revokeObjectURL(objectUrl)

          const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
          const base64  = dataUrl.split(',')[1]
          resolve({ dataUrl, mimeType: 'image/jpeg', base64 })
        }

        img.onerror = (err) => {
          URL.revokeObjectURL(objectUrl)
          reject(err)
        }

        img.src = objectUrl
      })
    },

    // ── Chat ──

    async send(text) {
      const message    = (text ?? this.draft).trim()
      const attachment = this.pendingAttachment
      if ((!message && !attachment) || this.isThinking) return

      this.draft = ''
      this.pendingAttachment = null
      this.notConfigured = ''

      this.messages.push({
        role:       'user',
        content:    message,
        attachment: attachment ? attachment.dataUrl : null,
      })
      this.scrollToBottom()

      await this.attemptSend(message, attachment)
    },

    /**
     * Re-sends a previously failed prompt (and its attachment, if any)
     * without the user retyping anything, and without adding a
     * duplicate user bubble — the original one is already in the log.
     */
    async retry(errorIndex) {
      if (this.isThinking) return
      const errorMsg = this.messages[errorIndex]
      if (!errorMsg || !errorMsg.retryPayload) return

      this.messages.splice(errorIndex, 1)
      this.notConfigured = ''

      await this.attemptSend(errorMsg.retryPayload.message, errorMsg.retryPayload.attachment)
    },

    /**
     * Shared by both a fresh send and a retry: does the actual API
     * call and either appends the assistant's reply or an error
     * bubble carrying enough info (retryPayload) to try again later.
     */
    async attemptSend(message, attachment) {
      this.isThinking = true
      try {
        const res = await this.api('POST', '/ai/chat', {
          message,
          conversation_id: this.currentConversationId,
          attachment: attachment
            ? { data: attachment.base64, mime_type: attachment.mimeType }
            : undefined,
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

        const wasNewConversation = this.currentConversationId === null
        this.currentConversationId = res.conversation_id
        localStorage.setItem(LAST_CONVERSATION_KEY, String(res.conversation_id))

        if (wasNewConversation) {
          this.conversations.unshift({
            id:         res.conversation_id,
            title:      res.title,
            updated_at: new Date().toISOString(),
          })
        } else {
          const idx = this.conversations.findIndex(c => c.id === res.conversation_id)
          if (idx !== -1) {
            const [conv] = this.conversations.splice(idx, 1)
            conv.title = res.title
            this.conversations.unshift(conv)
          }
        }
      } catch (err) {
        if (err?.status === 503) {
          // Our own backend reporting GEMINI_API_KEY isn't set.
          this.notConfigured = err?.data?.error || 'The AI Assistant is not configured yet.'
        } else {
          let errorText = "Something went wrong reaching the assistant. Please try again."
          if (err?.data?.details?.error?.status === 'UNAVAILABLE') {
            errorText = "The AI is a bit overloaded right now — try again in a moment."
          }
          this.messages.push({
            role:         'assistant',
            content:      errorText,
            isError:      true,
            retryPayload: { message, attachment },
          })
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
.ai-container { position: relative; z-index: 1; max-width: 1180px; width: 100%; margin: 0 auto; padding: 2.5rem 2rem 2rem; display: flex; flex-direction: column; flex: 1; min-height: 0; }

.alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 1.25rem; }
.alert svg { width: 16px; height: 16px; flex-shrink: 0; }
.alert-error { background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); color: #e74c3c; }

.page-header { margin-bottom: 1.5rem; }
.page-title { font-family: var(--font-display); font-size: 2.4rem; font-weight: 600; margin: 0 0 6px; letter-spacing: 0.01em; }
.page-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6; }

/* ── Body layout: sidebar + panel ── */
.ai-body { flex: 1; min-height: 0; display: flex; gap: 16px; }

.ai-sidebar { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.ai-new-convo { display: flex; align-items: center; gap: 8px; margin: 12px; padding: 9px 12px; background: var(--volcanic); border: none; border-radius: 8px; color: #fff; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.ai-new-convo:hover { background: var(--volcanic-glow); }
.ai-new-convo svg { width: 14px; height: 14px; flex-shrink: 0; }

.ai-convo-list { flex: 1; min-height: 0; overflow-y: auto; padding: 0 8px 8px; display: flex; flex-direction: column; gap: 3px; }
.ai-convo-item { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 9px 10px; border-radius: 7px; cursor: pointer; transition: background 0.15s; }
.ai-convo-item:hover { background: var(--raised); }
.ai-convo-item--active { background: var(--raised); border: 1px solid rgba(192,57,43,0.35); }
.ai-convo-title { font-size: 12.5px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ai-convo-item--active .ai-convo-title { color: var(--text-primary); }
.ai-convo-actions { display: flex; gap: 2px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
.ai-convo-item:hover .ai-convo-actions { opacity: 1; }
.ai-convo-icon-btn { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: none; border: none; color: var(--text-muted); cursor: pointer; border-radius: 5px; }
.ai-convo-icon-btn:hover { color: var(--text-secondary); background: var(--surface); }
.ai-convo-icon-btn--danger:hover { color: var(--volcanic-glow); }
.ai-convo-icon-btn svg { width: 12px; height: 12px; }
.ai-convo-rename-input { width: 100%; background: var(--surface); border: 1px solid var(--volcanic-glow); border-radius: 5px; padding: 4px 7px; color: var(--text-primary); font-family: var(--font-body); font-size: 12.5px; outline: none; }
.ai-convo-empty { padding: 12px 10px; font-size: 12px; color: var(--text-muted); text-align: center; }

.ai-panel { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.ai-log { flex: 1; min-height: 0; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 14px; }

.ai-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 3rem 1rem; text-align: center; margin: auto; }
.empty-icon { width: 34px; height: 34px; color: var(--volcanic-glow); opacity: 0.6; }
.ai-empty p { font-size: 13px; color: var(--text-muted); margin: 0; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 480px; }
.ai-suggestion { padding: 8px 14px; background: var(--raised); border: 1px solid var(--border); border-radius: 20px; color: var(--text-secondary); font-family: var(--font-body); font-size: 12px; cursor: pointer; transition: all 0.15s; }
.ai-suggestion:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

.ai-msg { display: flex; flex-direction: column; max-width: 80%; gap: 6px; }
.ai-msg--user { align-self: flex-end; align-items: flex-end; }
.ai-msg--assistant { align-self: flex-start; align-items: flex-start; }
.ai-msg__bubble { padding: 10px 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; }
.ai-msg--user .ai-msg__bubble { background: var(--volcanic); color: #fff; border-bottom-right-radius: 3px; }
.ai-msg--assistant .ai-msg__bubble { background: var(--raised); color: var(--text-primary); border: 1px solid var(--border); border-bottom-left-radius: 3px; }
.ai-msg__bubble--error { border-color: rgba(192,57,43,0.45); }
.ai-msg__bubble--thinking { display: flex; gap: 4px; padding: 14px; }
.ai-msg__image { max-width: 260px; max-height: 260px; border-radius: 10px; border: 1px solid var(--border); object-fit: cover; }
.ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: ai-bounce 1.1s infinite ease-in-out; }
.ai-dot:nth-child(2) { animation-delay: 0.15s; }
.ai-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes ai-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

.ai-retry-btn { display: flex; align-items: center; gap: 6px; padding: 5px 11px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; color: var(--text-secondary); font-family: var(--font-body); font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.ai-retry-btn svg { width: 12px; height: 12px; }
.ai-retry-btn:hover:not(:disabled) { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }
.ai-retry-btn:disabled { opacity: 0.4; cursor: not-allowed; }

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

.ai-attach-preview { display: flex; align-items: center; gap: 10px; margin: 0 12px; padding: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; }
.ai-attach-preview img { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; }
.ai-attach-remove { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; border-radius: 5px; }
.ai-attach-remove:hover { color: var(--volcanic-glow); background: var(--raised); }
.ai-attach-remove svg { width: 14px; height: 14px; }

.ai-input-row { display: flex; align-items: center; gap: 8px; padding: 12px; border-top: 1px solid var(--border); }
.ai-file-input-hidden { display: none; }
.ai-attach-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.ai-attach-btn svg { width: 16px; height: 16px; }
.ai-attach-btn:hover:not(:disabled) { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }
.ai-attach-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.ai-input-row input[type="text"] { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--text-primary); font-family: var(--font-body); font-size: 13px; outline: none; }
.ai-input-row input[type="text"]:focus { border-color: var(--volcanic-glow); }
.ai-input-row input[type="text"]::placeholder { color: var(--text-muted); }
.ai-send-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--volcanic); border: none; border-radius: 8px; color: #fff; cursor: pointer; flex-shrink: 0; transition: background 0.15s; }
.ai-send-btn svg { width: 16px; height: 16px; }
.ai-send-btn:hover:not(:disabled) { background: var(--volcanic-glow); }
.ai-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

@media (max-width: 900px) {
  .ai-body { flex-direction: column; }
  .ai-sidebar { width: 100%; max-height: 180px; }
}

@media (max-width: 700px) {
  .ai-container { padding: 1.5rem 1rem 1rem; }
  .page-title { font-size: 1.8rem; }
  .ai-msg { max-width: 92%; }
}
</style>