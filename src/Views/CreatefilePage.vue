<template>
  <div class="create-wrapper">

    <canvas class="hex-canvas" ref="hexCanvas"></canvas>

    <div class="create-container">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <div class="page-breadcrumb">
            <router-link to="/dashboard" class="breadcrumb-link">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Dashboard
            </router-link>
            <svg class="breadcrumb-sep" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="breadcrumb-current">New File</span>
          </div>
          <h1 class="page-title">Create New File</h1>
          <p class="page-subtitle">Choose a file type to get started</p>
        </div>
        <div class="page-header__right">
          <!-- Tier badge -->
          <div class="tier-badge" :class="currentTier">
            <svg v-if="currentTier === 'founder'" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <svg v-else-if="currentTier === 'premium'" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <svg v-else-if="currentTier === 'silver'" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M16 3H8L6 7H18L16 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span>{{ tierLabels[currentTier] }}</span>
          </div>

          <button class="btn-ghost" @click="$router.push('/')">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Cancel
          </button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="create-layout">

        <!-- Left: File Type Picker -->
        <div class="picker-panel">
          <div class="picker-panel__header">
            <h2 class="panel-label">File Type</h2>
            <!-- Tier filter tabs -->
            <div class="tier-tabs">
              <button
                v-for="t in tiers"
                :key="t.id"
                class="tier-tab"
                :class="{ active: activeTierFilter === t.id }"
                @click="activeTierFilter = t.id"
              >{{ t.short }}</button>
            </div>
          </div>

          <!-- Tier legend -->
          <div class="tier-legend">
            <span v-for="t in tiers" :key="t.id" class="legend-item" :class="t.id">
              <span class="legend-dot"></span>{{ t.label }}
            </span>
          </div>

          <div class="file-type-grid">
            <button
              v-for="type in filteredFileTypes"
              :key="type.id"
              class="file-type-card"
              :class="{
                active: selectedType === type.id,
                locked: isLocked(type),
                [`tier-${type.tier}`]: true
              }"
              @click="selectType(type)"
            >
              <!-- Tier pill -->
              <div class="card-tier-pill" :class="type.tier">{{ tierShort[type.tier] }}</div>

              <!-- Lock overlay -->
              <div v-if="isLocked(type)" class="lock-overlay">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="12" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 12V8C8 5.791 9.791 4 12 4C14.209 4 16 5.791 16 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ tierLabels[type.tier] }}</span>
              </div>

              <div class="file-type-card__icon">
                <!-- Folder -->
                <svg v-if="type.id === 'folder'" viewBox="0 0 64 52" fill="none" xmlns="http://www.w3.org/2000/svg" class="folder-svg">
                  <path d="M4 10C4 7.79086 5.79086 6 8 6H24L30 12H56C58.2091 12 60 13.7909 60 16V46C60 48.2091 58.2091 50 56 50H8C5.79086 50 4 48.2091 4 46V10Z" fill="url(#folderBack)"/>
                  <path d="M4 18C4 15.7909 5.79086 14 8 14H56C58.2091 14 60 15.7909 60 18V46C60 48.2091 58.2091 50 56 50H8C5.79086 50 4 48.2091 4 46V18Z" fill="url(#folderFront)"/>
                  <path d="M4 14H60V20H4V14Z" fill="white" fill-opacity="0.05"/>
                  <rect x="26" y="29" width="12" height="8" rx="4" fill="url(#clasp)"/>
                  <defs>
                    <linearGradient id="folderBack" x1="4" y1="6" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#7a1a10"/>
                      <stop offset="100%" stop-color="#4a0e08"/>
                    </linearGradient>
                    <linearGradient id="folderFront" x1="4" y1="14" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#c0392b"/>
                      <stop offset="100%" stop-color="#8a2720"/>
                    </linearGradient>
                    <linearGradient id="clasp" x1="26" y1="29" x2="38" y2="37" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#e8c97a"/>
                      <stop offset="100%" stop-color="#c9a84c"/>
                    </linearGradient>
                  </defs>
                </svg>
                <svg v-else-if="type.id === 'document'" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="type.id === 'spreadsheet'" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 9H21M3 15H21M9 3V21M15 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="type.id === 'image'" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="type.id === 'code'" viewBox="0 0 24 24" fill="none">
                  <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="type.id === 'note'" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="type.id === 'presentation'" viewBox="0 0 24 24" fill="none">
                  <path d="M2 3H22V16H2V3ZM12 16V21M8 21H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="type.id === 'database'" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 5V12C3 13.657 7.029 15 12 15C16.971 15 21 13.657 21 12V5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 12V19C3 20.657 7.029 22 12 22C16.971 22 21 20.657 21 19V12" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <svg v-else-if="type.id === 'encrypted'" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7V12C3 16.418 7.03 20.561 12 22C16.97 20.561 21 16.418 21 12V7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <span class="file-type-card__label">{{ type.label }}</span>
              <span class="file-type-card__ext">{{ type.ext }}</span>

              <!-- Selected check -->
              <div v-if="selectedType === type.id && !isLocked(type)" class="file-type-card__check">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          <!-- Upgrade prompt (shown to non-founders with locked items) -->
          <div v-if="currentTier !== 'founder' && hasLockedTypes" class="upgrade-prompt">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Upgrade to unlock more file types</span>
            <router-link to="/planning" class="upgrade-link">View Plans</router-link>
          </div>
        </div>

        <!-- Right: File Details Form -->
        <div class="details-panel">
          <h2 class="panel-label">File Details</h2>

          <div class="details-form">

            <!-- File name -->
            <div class="form-group">
              <label class="form-label">File Name</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13 2V9H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input
                  v-model="fileName"
                  type="text"
                  class="form-input"
                  placeholder="e.g. project-brief"
                  @input="sanitizeFileName"
                />
                <span class="input-ext">{{ currentExt }}</span>
              </div>
              <span v-if="fileNameError" class="form-error">{{ fileNameError }}</span>
              <span v-else class="form-hint">No spaces — use hyphens or underscores</span>
            </div>

            <!-- Save Location -->
            <div class="form-group">
              <label class="form-label">Save Location</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <select v-model="saveLocation" class="form-input form-select">
                  <option value="root">/ Root</option>
                  <option value="projects">/ Projects</option>
                  <option value="documents">/ Documents</option>
                  <option value="media">/ Media</option>
                  <option value="archive">/ Archive</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description <span class="form-label-optional">(optional)</span></label>
              <div class="textarea-wrapper">
                <textarea
                  v-model="fileDescription"
                  class="form-textarea"
                  placeholder="What is this file for?"
                  rows="3"
                  maxlength="200"
                ></textarea>
                <span class="char-count">{{ fileDescription.length }}/200</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="form-group">
              <label class="form-label">Tags <span class="form-label-optional">(optional)</span></label>
              <div class="tags-input-wrapper">
                <span v-for="(tag, i) in tags" :key="i" class="tag">
                  {{ tag }}
                  <button type="button" class="tag-remove" @click="removeTag(i)">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </span>
                <input
                  v-model="tagInput"
                  type="text"
                  class="tags-input"
                  placeholder="Add tag, press Enter"
                  @keydown.enter.prevent="addTag"
                />
              </div>
            </div>

            <!-- Preview strip -->
            <div class="file-preview">
              <div class="file-preview__icon">
                <svg v-if="selectedType === 'folder'" viewBox="0 0 64 52" fill="none">
                  <path d="M4 10C4 7.79086 5.79086 6 8 6H24L30 12H56C58.2091 12 60 13.7909 60 16V46C60 48.2091 58.2091 50 56 50H8C5.79086 50 4 48.2091 4 46V10Z" fill="url(#pvBack)"/>
                  <path d="M4 18C4 15.7909 5.79086 14 8 14H56C58.2091 14 60 15.7909 60 18V46C60 48.2091 58.2091 50 56 50H8C5.79086 50 4 48.2091 4 46V18Z" fill="url(#pvFront)"/>
                  <rect x="26" y="29" width="12" height="8" rx="4" fill="#d4a84b"/>
                  <defs>
                    <linearGradient id="pvBack" x1="4" y1="6" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#7a1a10"/><stop offset="100%" stop-color="#4a0e08"/>
                    </linearGradient>
                    <linearGradient id="pvFront" x1="4" y1="14" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#8a2720"/>
                    </linearGradient>
                  </defs>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z" fill="url(#pvDoc)"/>
                  <path d="M13 2V9H20" fill="#7a1a10"/>
                  <path d="M8 13H16M8 17H13" stroke="white" stroke-width="1" stroke-linecap="round" stroke-opacity="0.4"/>
                  <defs>
                    <linearGradient id="pvDoc" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="file-preview__info">
                <span class="file-preview__name">{{ previewName }}</span>
                <span class="file-preview__meta">{{ currentType?.label }} · /{{ saveLocation }}</span>
              </div>
              <!-- Founder badge on preview -->
              <div v-if="currentTier === 'founder'" class="preview-founder-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                Founder Access
              </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="$router.push('/dashboard')">Cancel</button>
              <button
                type="button"
                class="btn-primary"
                :disabled="!canCreate"
                @click="handleCreate"
              >
                <span v-if="!isCreating">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Create File
                </span>
                <span v-else class="loading-spinner">
                  <svg viewBox="0 0 24 24" fill="none" class="spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="60" stroke-dashoffset="20" stroke-linecap="round"/>
                  </svg>
                </span>
              </button>
            </div>

          </div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════════
           NODE LINKER  —  n8n-style document wiring
      ════════════════════════════════════════════ -->
      <div class="linker-section">

        <div class="linker-header">
          <div>
            <h2 class="panel-label">Document Links</h2>
            <p class="linker-subtitle">Wire files together to define relationships and data flow</p>
          </div>
          <div class="linker-controls">
            <button class="btn-ghost btn-sm" @click="addNode">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              Add Node
            </button>
            <button class="btn-ghost btn-sm" @click="clearLinks" :disabled="connections.length === 0">
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Clear Links
            </button>
            <div class="link-mode-toggle">
              <span class="link-mode-label">Link Mode</span>
              <button
                class="toggle-btn"
                :class="{ active: linkMode }"
                @click="linkMode = !linkMode"
              >
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
          <!-- SVG layer for connections -->
          <svg class="connections-svg" ref="connSvg">
            <defs>
              <!-- Animated flow gradient -->
              <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#c0392b" stop-opacity="0.2"/>
                <stop offset="50%"  stop-color="#e74c3c" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#c0392b" stop-opacity="0.2"/>
                <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="1.8s" repeatCount="indefinite"/>
              </linearGradient>
              <!-- Glow filter -->
              <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <!-- Drawn connections -->
            <g v-for="(conn, i) in connections" :key="'conn-' + i">
              <path
                :d="getBezier(conn)"
                fill="none"
                stroke="#242424"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                :d="getBezier(conn)"
                fill="none"
                stroke="url(#wireGrad)"
                stroke-width="2"
                stroke-linecap="round"
                filter="url(#wireGlow)"
                class="wire-animated"
              />
              <!-- Delete button on mid-point -->
              <g
                :transform="`translate(${getMidPoint(conn).x}, ${getMidPoint(conn).y})`"
                class="conn-delete"
                @click="removeConnection(i)"
                style="cursor:pointer"
              >
                <circle r="8" fill="#1a1a1a" stroke="#c0392b" stroke-width="1"/>
                <path d="M-3-3L3 3M-3 3L3-3" stroke="#e74c3c" stroke-width="1.5" stroke-linecap="round"/>
              </g>
            </g>

            <!-- In-progress wire while dragging -->
            <path
              v-if="draggingWire"
              :d="getDragBezier()"
              fill="none"
              stroke="#e74c3c"
              stroke-width="1.5"
              stroke-dasharray="6 4"
              stroke-linecap="round"
              opacity="0.7"
            />
          </svg>

          <!-- File nodes -->
          <div
            v-for="node in nodes"
            :key="node.id"
            class="file-node"
            :class="{
              selected: selectedNode === node.id,
              linking: linkMode && wireFrom === node.id,
              'is-source': connections.some(c => c.from === node.id),
              'is-target': connections.some(c => c.to   === node.id),
            }"
            :style="{ left: node.x + 'px', top: node.y + 'px' }"
            @mousedown.stop="startDrag(node, $event)"
            @click.stop="onNodeClick(node)"
          >
            <!-- Output port (right) -->
            <div
              class="port port-out"
              :class="{ active: linkMode }"
              @mousedown.stop="startWire(node, $event)"
              title="Drag to connect"
            >
              <svg viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </div>

            <!-- Input port (left) -->
            <div
              class="port port-in"
              :class="{ active: linkMode && draggingWire && wireFrom !== node.id }"
              @mouseup.stop="endWire(node)"
              title="Drop connection here"
            >
              <svg viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="3.5" fill="currentColor"/>
              </svg>
            </div>

            <!-- Node icon -->
            <div class="node-icon">
              <svg v-if="node.type === 'folder'" viewBox="0 0 24 20" fill="none">
                <path d="M1 4C1 2.895 1.895 2 3 2H9L11 4H21C22.105 4 23 4.895 23 6V17C23 18.105 22.105 19 21 19H3C1.895 19 1 18.105 1 17V4Z" fill="url(#nodeFolder)"/>
                <defs>
                  <linearGradient id="nodeFolder" x1="1" y1="2" x2="23" y2="19" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/>
                  </linearGradient>
                </defs>
              </svg>
              <svg v-else viewBox="0 0 18 22" fill="none">
                <path d="M10 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V8L10 1Z" fill="url(#nodeDoc)" stroke="none"/>
                <path d="M10 1V8H17" fill="#5a1208" stroke="none"/>
                <defs>
                  <linearGradient id="nodeDoc" x1="1" y1="1" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7a1a10"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <!-- Node body -->
            <div class="node-body">
              <span class="node-name">{{ node.label }}</span>
              <span class="node-type">{{ node.typeName }}</span>
            </div>

            <!-- Status dot -->
            <div class="node-status" :class="node.status"></div>

            <!-- Remove node -->
            <button class="node-remove" @click.stop="removeNode(node.id)" title="Remove node">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="nodes.length === 0" class="linker-empty">
            <svg viewBox="0 0 24 24" fill="none" class="empty-icon">
              <circle cx="5" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="19" cy="6"  r="3" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 12H16M8 12C8 9 16 6 16 6M8 12C8 15 16 18 16 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>No nodes yet — click <strong>Add Node</strong> or toggle <strong>Link Mode</strong> to start wiring</p>
          </div>

          <!-- Link mode hint -->
          <div v-if="linkMode && nodes.length > 0" class="link-mode-hint">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Drag from an output port <span class="port-demo out"></span> to an input port <span class="port-demo in"></span>
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
              <svg viewBox="0 0 24 24" fill="none" class="chip-arrow">
                <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="chip-to">{{ getNodeLabel(conn.to) }}</span>
              <button class="chip-remove" @click="removeConnection(i)">
                <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
      <!-- end linker -->

    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateFilePage',

  data() {
    return {
      // ─── Set to 'founder' for yourself, 'free' | 'silver' | 'premium' for users ───
      currentTier: 'founder',

      activeTierFilter: 'all',

      // ── Node Linker ──
      linkMode: false,
      nodes: [
        { id: 'n1', label: 'project-brief', typeName: 'Document',    type: 'document', x: 60,  y: 60,  status: 'active' },
        { id: 'n2', label: 'assets',        typeName: 'Folder',      type: 'folder',   x: 320, y: 40,  status: 'active' },
        { id: 'n3', label: 'report.xls',    typeName: 'Spreadsheet', type: 'document', x: 580, y: 100, status: 'idle'   },
      ],
      connections: [
        { from: 'n1', to: 'n2' },
      ],
      nodeCounter: 4,
      draggingNode: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      draggingWire: false,
      wireFrom: null,
      wireMouseX: 0,
      wireMouseY: 0,
      selectedNode: null,

      selectedType: 'folder',
      fileName: '',
      saveLocation: 'root',
      fileDescription: '',
      tagInput: '',
      tags: [],
      fileNameError: '',
      isCreating: false,

      tierLabels: {
        free:    'Free',
        silver:  'Silver',
        premium: 'Premium',
        founder: 'Founder'
      },

      tierShort: {
        free:    'FREE',
        silver:  'SLVR',
        premium: 'PRO',
        founder: 'ALL'
      },

      tiers: [
        { id: 'all',     label: 'All',     short: 'All'  },
        { id: 'free',    label: 'Free',    short: 'Free' },
        { id: 'silver',  label: 'Silver',  short: 'Slvr' },
        { id: 'premium', label: 'Premium', short: 'Pro'  },
      ],

      // tier = minimum tier required to use this type
      fileTypes: [
        { id: 'folder',       label: 'Folder',       ext: '',     tier: 'free'    },
        { id: 'document',     label: 'Document',     ext: '.doc', tier: 'free'    },
        { id: 'note',         label: 'Note',         ext: '.md',  tier: 'free'    },
        { id: 'image',        label: 'Image',        ext: '.png', tier: 'silver'  },
        { id: 'spreadsheet',  label: 'Spreadsheet',  ext: '.xls', tier: 'silver'  },
        { id: 'presentation', label: 'Presentation', ext: '.ppt', tier: 'silver'  },
        { id: 'code',         label: 'Code',         ext: '.js',  tier: 'premium' },
        { id: 'database',     label: 'Database',     ext: '.db',  tier: 'premium' },
        { id: 'encrypted',    label: 'Encrypted',    ext: '.enc', tier: 'premium' },
      ]
    }
  },

  computed: {
    tierOrder() {
      return { free: 0, silver: 1, premium: 2, founder: 3 }
    },

    filteredFileTypes() {
      if (this.activeTierFilter === 'all') return this.fileTypes
      return this.fileTypes.filter(t => t.tier === this.activeTierFilter)
    },

    hasLockedTypes() {
      return this.fileTypes.some(t => this.isLocked(t))
    },

    currentType() {
      return this.fileTypes.find(t => t.id === this.selectedType)
    },

    currentExt() {
      return this.currentType?.ext || ''
    },

    previewName() {
      return (this.fileName.trim() || 'untitled') + this.currentExt
    },

    canCreate() {
      return this.fileName.trim().length > 0 && !this.fileNameError
    }
  },

  methods: {
    isLocked(type) {
      if (this.currentTier === 'founder') return false
      return this.tierOrder[type.tier] > this.tierOrder[this.currentTier]
    },

    selectType(type) {
      if (this.isLocked(type)) return
      this.selectedType = type.id
    },

    sanitizeFileName() {
      this.fileNameError = ''
      if (/\s/.test(this.fileName)) {
        this.fileNameError = 'File name cannot contain spaces'
      } else if (/[^a-zA-Z0-9_\-.]/.test(this.fileName)) {
        this.fileNameError = 'Only letters, numbers, hyphens, and underscores allowed'
      }
    },

    addTag() {
      const t = this.tagInput.trim()
      if (t && !this.tags.includes(t) && this.tags.length < 8) this.tags.push(t)
      this.tagInput = ''
    },

    removeTag(i) {
      this.tags.splice(i, 1)
    },

    handleCreate() {
      if (!this.canCreate) return
      this.isCreating = true
      setTimeout(() => {
        console.log('Creating:', {
          type: this.selectedType,
          name: this.previewName,
          location: this.saveLocation,
          description: this.fileDescription,
          tags: this.tags,
          tier: this.currentTier
        })
        this.$router.push('/dashboard')
        this.isCreating = false
      }, 1200)
    },

    // ══════════════════════════════
    //  NODE LINKER METHODS
    // ══════════════════════════════

    addNode() {
      const types = ['folder','document','note','spreadsheet','code']
      const names = ['new-file','data-export','summary','config','schema','output','report','index']
      const typeNames = { folder:'Folder', document:'Document', note:'Note', spreadsheet:'Spreadsheet', code:'Code' }
      const t = types[Math.floor(Math.random() * types.length)]
      const n = names[Math.floor(Math.random() * names.length)]
      const canvas = this.$refs.linkerCanvas
      const maxX = canvas ? canvas.offsetWidth  - 180 : 400
      const maxY = canvas ? canvas.offsetHeight - 100 : 200
      this.nodes.push({
        id: 'n' + this.nodeCounter++,
        label: n,
        typeName: typeNames[t],
        type: t,
        x: Math.max(20, Math.floor(Math.random() * maxX)),
        y: Math.max(20, Math.floor(Math.random() * maxY)),
        status: 'idle'
      })
    },

    removeNode(id) {
      this.nodes = this.nodes.filter(n => n.id !== id)
      this.connections = this.connections.filter(c => c.from !== id && c.to !== id)
      if (this.selectedNode === id) this.selectedNode = null
      if (this.wireFrom === id) { this.draggingWire = false; this.wireFrom = null }
    },

    onNodeClick(node) {
      this.selectedNode = this.selectedNode === node.id ? null : node.id
    },

    // Drag to reposition nodes
    startDrag(node, e) {
      if (this.draggingWire) return
      this.draggingNode = node
      this.dragOffsetX = e.clientX - node.x
      this.dragOffsetY = e.clientY - node.y
    },

    onCanvasMouseMove(e) {
      const canvas = this.$refs.linkerCanvas
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()

      if (this.draggingNode) {
        this.draggingNode.x = Math.max(0, Math.min(e.clientX - this.dragOffsetX, canvas.offsetWidth  - 160))
        this.draggingNode.y = Math.max(0, Math.min(e.clientY - this.dragOffsetY, canvas.offsetHeight - 80))
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
        this.wireFrom = null
      }
    },

    // Wire drawing
    startWire(node, e) {
      e.stopPropagation()
      const canvas = this.$refs.linkerCanvas
      const rect = canvas.getBoundingClientRect()
      this.wireFrom = node.id
      this.draggingWire = true
      this.wireMouseX = e.clientX - rect.left
      this.wireMouseY = e.clientY - rect.top
    },

    endWire(targetNode) {
      if (!this.draggingWire || !this.wireFrom) return
      if (this.wireFrom === targetNode.id) { this.draggingWire = false; this.wireFrom = null; return }
      const exists = this.connections.some(c => c.from === this.wireFrom && c.to === targetNode.id)
      if (!exists) {
        this.connections.push({ from: this.wireFrom, to: targetNode.id })
      }
      this.draggingWire = false
      this.wireFrom = null
    },

    clearLinks() {
      this.connections = []
    },

    removeConnection(i) {
      this.connections.splice(i, 1)
    },

    // Get node centre position
    getNodeCenter(id) {
      const node = this.nodes.find(n => n.id === id)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x + 155, y: node.y + 36 }
    },

    getNodeInPort(id) {
      const node = this.nodes.find(n => n.id === id)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x, y: node.y + 36 }
    },

    // Bezier path between two nodes
    getBezier(conn) {
      const from = this.getNodeCenter(conn.from)
      const to   = this.getNodeInPort(conn.to)
      const dx = Math.abs(to.x - from.x) * 0.5
      return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
    },

    // Bezier for in-progress drag wire
    getDragBezier() {
      const from = this.getNodeCenter(this.wireFrom)
      const to   = { x: this.wireMouseX, y: this.wireMouseY }
      const dx = Math.abs(to.x - from.x) * 0.5
      return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
    },

    // Midpoint of bezier (approx) for delete button
    getMidPoint(conn) {
      const from = this.getNodeCenter(conn.from)
      const to   = this.getNodeInPort(conn.to)
      return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
    },

    getNodeLabel(id) {
      return this.nodes.find(n => n.id === id)?.label || id
    },

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
            const dist = Math.sqrt(Math.pow(x - canvas.width/2, 2) + Math.pow(y - canvas.height/2, 2))
            const maxDist = Math.sqrt(Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2))
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
  },

  mounted() {
    this.drawHexGrid()
    window.addEventListener('resize', this.drawHexGrid)
    this.animateHex()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawHexGrid)
    cancelAnimationFrame(this._hexRaf)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;700&display=swap');

:root {
  --bg:             #090909;
  --surface:        #0f0f0f;
  --card:           #141414;
  --border:         #242424;
  --volcanic:       #c0392b;
  --volcanic-glow:  #e74c3c;
  --gold:           #d4a84b;
  --silver-c:       #94a3b8;
  --text-primary:   #ede8df;
  --text-secondary: #6e6a64;
  --text-muted:     #353330;
  --font-display:   'Cormorant Garamond', serif;
  --font-body:      'Syne', sans-serif;
}

/* ── Wrapper ── */
.create-wrapper {
  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.hex-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

.create-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
}

.page-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 0.75rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb-link:hover { color: var(--volcanic-glow); }
.breadcrumb-link svg { width: 13px; height: 13px; }
.breadcrumb-sep { width: 14px; height: 14px; color: var(--text-muted); }
.breadcrumb-current { font-size: 12px; color: var(--volcanic-glow); }

.page-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0 0 6px;
  letter-spacing: 0.01em;
}

.page-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; }

/* ── Tier Badge ── */
.tier-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid;
}
.tier-badge svg { width: 13px; height: 13px; }

.tier-badge.free    { color: var(--text-secondary); border-color: var(--border); background: rgba(255,255,255,0.03); }
.tier-badge.silver  { color: var(--silver-c); border-color: rgba(148,163,184,0.3); background: rgba(148,163,184,0.06); }
.tier-badge.premium { color: var(--gold); border-color: rgba(212,168,75,0.3); background: rgba(212,168,75,0.06); }
.tier-badge.founder {
  color: #fff;
  border-color: var(--volcanic);
  background: linear-gradient(135deg, rgba(192,57,43,0.2), rgba(231,76,60,0.1));
  box-shadow: 0 0 12px rgba(192,57,43,0.25);
}

.btn-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost svg { width: 14px; height: 14px; }
.btn-ghost:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

/* ── Layout ── */
.create-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── Panel labels ── */
.panel-label {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  position: relative;
  padding-bottom: 0.6rem;
}
.panel-label::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 24px; height: 1px;
  background: var(--volcanic);
}

/* ── Picker panel ── */
.picker-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 1.5rem;
}

.picker-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

/* Tier filter tabs */
.tier-tabs {
  display: flex;
  gap: 4px;
}

.tier-tab {
  padding: 3px 8px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.tier-tab:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }
.tier-tab.active {
  background: var(--volcanic);
  border-color: var(--volcanic);
  color: white;
}

/* Tier legend */
.tier-legend {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.legend-item.free .legend-dot    { background: var(--text-muted); }
.legend-item.free                 { color: var(--text-muted); }
.legend-item.silver .legend-dot  { background: var(--silver-c); }
.legend-item.silver               { color: var(--silver-c); }
.legend-item.premium .legend-dot { background: var(--gold); }
.legend-item.premium              { color: var(--gold); }

/* ── File type grid ── */
.file-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.file-type-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 1rem 0.5rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  overflow: hidden;
}

/* Tier-coloured top border accent */
.file-type-card.tier-free::before    { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--text-muted); }
.file-type-card.tier-silver::before  { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--silver-c); }
.file-type-card.tier-premium::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold); }

.file-type-card:hover:not(.locked) {
  border-color: rgba(192, 57, 43, 0.4);
  background: rgba(192, 57, 43, 0.04);
}

.file-type-card.active {
  border-color: var(--volcanic);
  background: rgba(192, 57, 43, 0.08);
  box-shadow: 0 0 14px rgba(192, 57, 43, 0.15);
}

.file-type-card.locked {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Tier pill on each card */
.card-tier-pill {
  position: absolute;
  top: 6px; left: 6px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 2px 5px;
  border-radius: 3px;
  line-height: 1;
}

.card-tier-pill.free    { background: rgba(53,51,48,0.8);  color: var(--text-muted); }
.card-tier-pill.silver  { background: rgba(148,163,184,0.12); color: var(--silver-c); }
.card-tier-pill.premium { background: rgba(212,168,75,0.12);  color: var(--gold); }

/* Lock overlay */
.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(9,9,9,0.55);
  border-radius: 10px;
  z-index: 2;
  backdrop-filter: blur(1px);
}
.lock-overlay svg { width: 18px; height: 18px; color: var(--gold); }
.lock-overlay span { font-size: 9px; font-weight: 700; color: var(--gold); letter-spacing: 0.07em; text-transform: uppercase; }

.file-type-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 36px;
  margin-top: 4px;
}

.folder-svg {
  width: 44px;
  height: 34px;
  filter: drop-shadow(0 2px 8px rgba(192, 57, 43, 0.45));
}

.file-type-card__icon svg:not(.folder-svg) {
  width: 22px;
  height: 22px;
  color: var(--volcanic-glow);
}

.file-type-card__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.file-type-card__ext {
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  min-height: 12px;
}

.file-type-card__check {
  position: absolute;
  top: 6px; right: 6px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--volcanic);
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-type-card__check svg { width: 9px; height: 9px; color: white; }

/* Upgrade prompt */
.upgrade-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1rem;
  padding: 10px 12px;
  background: rgba(212,168,75,0.06);
  border: 1px solid rgba(212,168,75,0.2);
  border-radius: 8px;
  font-size: 12px;
  color: var(--gold);
}
.upgrade-prompt svg { width: 14px; height: 14px; flex-shrink: 0; }
.upgrade-prompt span { flex: 1; }
.upgrade-link {
  font-size: 11px;
  font-weight: 700;
  color: var(--gold);
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(212,168,75,0.4);
  transition: border-color 0.2s;
  white-space: nowrap;
}
.upgrade-link:hover { border-color: var(--gold); }

/* ── Details panel ── */
.details-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.details-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.form-label-optional {
  font-weight: 400;
  color: var(--text-muted);
  text-transform: none;
  letter-spacing: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 16px; height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: var(--volcanic);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12);
}
.form-input::placeholder { color: var(--text-muted); }
.form-select { appearance: none; cursor: pointer; padding-right: 36px; }

.input-ext {
  position: absolute;
  right: 12px;
  font-size: 11px;
  color: var(--volcanic-glow);
  font-weight: 600;
  letter-spacing: 0.05em;
  pointer-events: none;
}

.textarea-wrapper { position: relative; }

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  line-height: 1.6;
}
.form-textarea:focus {
  border-color: var(--volcanic);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12);
}
.form-textarea::placeholder { color: var(--text-muted); }

.char-count {
  position: absolute;
  bottom: 8px; right: 10px;
  font-size: 10px;
  color: var(--text-muted);
}

.tags-input-wrapper {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.tags-input-wrapper:focus-within {
  border-color: var(--volcanic);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(192, 57, 43, 0.12);
  border: 1px solid rgba(192, 57, 43, 0.3);
  border-radius: 4px;
  font-size: 11px;
  color: var(--volcanic-glow);
  font-weight: 500;
}

.tag-remove {
  background: none; border: none;
  cursor: pointer; color: var(--volcanic-glow);
  padding: 0; display: flex;
  opacity: 0.6; transition: opacity 0.15s;
}
.tag-remove:hover { opacity: 1; }
.tag-remove svg { width: 10px; height: 10px; }

.tags-input {
  flex: 1; min-width: 100px;
  background: none; border: none; outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px; padding: 2px 0;
}
.tags-input::placeholder { color: var(--text-muted); }

.form-hint  { font-size: 11px; color: var(--text-muted); }
.form-error { font-size: 11px; color: var(--volcanic-glow); }

/* Preview */
.file-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--volcanic);
  border-radius: 10px;
}

.file-preview__icon {
  width: 44px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.file-preview__icon svg {
  width: 44px; height: 38px;
  filter: drop-shadow(0 2px 6px rgba(192, 57, 43, 0.35));
}

.file-preview__info { display: flex; flex-direction: column; gap: 3px; flex: 1; }

.file-preview__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.file-preview__meta { font-size: 11px; color: var(--text-secondary); }

.preview-founder-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(192,57,43,0.12);
  border: 1px solid rgba(192,57,43,0.25);
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  color: var(--volcanic-glow);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 10px;
  padding-top: 0.25rem;
}

.btn-secondary {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--volcanic-glow); color: var(--volcanic-glow); }

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 24px;
  background: linear-gradient(135deg, var(--volcanic), var(--volcanic-glow));
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(192, 57, 43, 0.3);
}
.btn-primary > span { display: flex; align-items: center; gap: 8px; }
.btn-primary svg { width: 16px; height: 16px; }
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 22px rgba(192, 57, 43, 0.5);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner svg { width: 18px; height: 18px; }
.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .create-layout { grid-template-columns: 1fr; }
  .picker-panel { position: static; }
  .file-type-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 520px) {
  .create-container { padding: 1.5rem 1rem 3rem; }
  .page-title { font-size: 1.7rem; }
  .file-type-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ════════════════════════════════════
   NODE LINKER
════════════════════════════════════ */
.linker-section {
  margin-top: 2.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.linker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
  flex-wrap: wrap;
}

.linker-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.linker-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  gap: 5px;
}
.btn-sm svg { width: 12px; height: 12px; }

/* Link mode toggle */
.link-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.link-mode-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.toggle-btn {
  position: relative;
  width: 32px;
  height: 18px;
  background: var(--border);
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
}
.toggle-btn.active { background: var(--volcanic); }

.toggle-knob {
  position: absolute;
  top: 2px; left: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
  display: block;
}
.toggle-btn.active .toggle-knob { transform: translateX(14px); }

/* Canvas */
.linker-canvas {
  position: relative;
  width: 100%;
  height: 340px;
  background:
    radial-gradient(circle at 20% 50%, rgba(192,57,43,0.04) 0%, transparent 60%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 29px,
      rgba(255,255,255,0.02) 29px,
      rgba(255,255,255,0.02) 30px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 29px,
      rgba(255,255,255,0.02) 29px,
      rgba(255,255,255,0.02) 30px
    );
  overflow: hidden;
  cursor: default;
  user-select: none;
}

/* SVG overlay */
.connections-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.connections-svg .conn-delete { pointer-events: all; }

/* Wire animation */
.wire-animated {
  stroke-dasharray: 200;
  animation: wireDash 2s linear infinite;
}
@keyframes wireDash {
  from { stroke-dashoffset: 200; }
  to   { stroke-dashoffset: 0; }
}

/* File nodes */
.file-node {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 10px;
  background: var(--raised, #1a1a1a);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 155px;
  cursor: grab;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.file-node:active { cursor: grabbing; }

.file-node:hover {
  border-color: rgba(192,57,43,0.4);
  box-shadow: 0 4px 20px rgba(192,57,43,0.15);
}

.file-node.selected {
  border-color: var(--volcanic);
  box-shadow: 0 0 0 2px rgba(192,57,43,0.25), 0 4px 20px rgba(192,57,43,0.2);
}

.file-node.linking {
  border-color: var(--volcanic-glow);
  box-shadow: 0 0 14px rgba(231,76,60,0.35);
}

.file-node.is-source { border-left: 2px solid var(--volcanic); }
.file-node.is-target { border-right: 2px solid var(--volcanic); }

/* Ports */
.port {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 14px; height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  z-index: 2;
}

.port svg { width: 10px; height: 10px; }

.port-out {
  right: -7px;
  background: var(--card);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  cursor: crosshair;
}
.port-out:hover,
.port-out.active {
  border-color: var(--volcanic-glow);
  color: var(--volcanic-glow);
  background: rgba(231,76,60,0.12);
  box-shadow: 0 0 8px rgba(231,76,60,0.4);
}

.port-in {
  left: -7px;
  background: var(--card);
  border: 1.5px solid var(--border);
  color: var(--border);
  cursor: cell;
}
.port-in.active {
  border-color: var(--volcanic-glow);
  color: var(--volcanic-glow);
  background: rgba(231,76,60,0.12);
  box-shadow: 0 0 8px rgba(231,76,60,0.4);
  animation: portPulse 0.8s ease-in-out infinite;
}

@keyframes portPulse {
  0%, 100% { box-shadow: 0 0 6px rgba(231,76,60,0.4); }
  50%       { box-shadow: 0 0 14px rgba(231,76,60,0.7); }
}

/* Node internals */
.node-icon {
  flex-shrink: 0;
  width: 22px; height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node-icon svg { width: 22px; height: 18px; filter: drop-shadow(0 1px 3px rgba(192,57,43,0.3)); }

.node-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.node-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-type {
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.node-status {
  position: absolute;
  top: 6px; right: 6px;
  width: 6px; height: 6px;
  border-radius: 50%;
}
.node-status.active { background: #27ae60; box-shadow: 0 0 4px rgba(39,174,96,0.6); }
.node-status.idle   { background: var(--text-muted); }
.node-status.error  { background: var(--volcanic-glow); box-shadow: 0 0 4px rgba(231,76,60,0.6); }

.node-remove {
  display: none;
  position: absolute;
  bottom: 4px; right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 1px;
  transition: color 0.15s;
}
.node-remove svg { width: 9px; height: 9px; }
.node-remove:hover { color: var(--volcanic-glow); }
.file-node:hover .node-remove { display: flex; }
.file-node:hover .node-status  { display: none; }

/* Empty state */
.linker-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  pointer-events: none;
}

.empty-icon {
  width: 40px; height: 40px;
  color: var(--text-muted);
  opacity: 0.5;
}

.linker-empty p {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
}

.linker-empty p strong { color: var(--text-secondary); }

/* Link mode hint bar */
.link-mode-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(10,10,10,0.85);
  border: 1px solid rgba(231,76,60,0.3);
  border-radius: 20px;
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  backdrop-filter: blur(6px);
  pointer-events: none;
}
.link-mode-hint svg { width: 13px; height: 13px; color: var(--volcanic-glow); }

.port-demo {
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 50%;
  vertical-align: middle;
}
.port-demo.out { border: 1.5px solid var(--volcanic-glow); }
.port-demo.in  { background: var(--volcanic-glow); }

/* Connection list */
.connection-list {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.connection-list__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.connection-list__header svg { width: 14px; height: 14px; color: var(--volcanic); }

.connection-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.connection-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px 4px 10px;
  background: rgba(192,57,43,0.08);
  border: 1px solid rgba(192,57,43,0.2);
  border-radius: 6px;
  font-size: 11px;
}

.chip-from, .chip-to {
  font-weight: 600;
  color: var(--text-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-arrow { width: 12px; height: 12px; color: var(--volcanic); flex-shrink: 0; }

.chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 2px;
  display: flex;
  transition: color 0.15s;
  margin-left: 2px;
}
.chip-remove svg { width: 9px; height: 9px; }
.chip-remove:hover { color: var(--volcanic-glow); }
</style>