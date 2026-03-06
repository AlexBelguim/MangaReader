/**
 * Task Queue View
 * Shows active tasks, downloads, auto-check schedule per manga
 */

import { api } from '../api.js';
import { socket, SocketEvents } from '../socket.js';
import { renderHeader, setupHeaderListeners } from '../components/header.js';
import { showToast } from '../utils/toast.js';

let state = {
  downloads: {},
  queueTasks: [],
  historyTasks: [],
  autoCheck: null,
  loading: true
};

let refreshInterval = null;
let socketHandlers = {};

// ==================== HELPERS ====================

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function timeUntil(dateStr) {
  if (!dateStr) return 'Not scheduled';
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'Running now...';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours < 24) return `in ${hours}h ${remMins}m`;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return `in ${days}d ${remHours}h`;
}

function taskTypeIcon(type) {
  switch (type) {
    case 'download': return '📥';
    case 'scrape': return '🔍';
    case 'scan': return '📁';
    default: return '⚙️';
  }
}

function statusColor(status) {
  switch (status) {
    case 'running': return 'var(--color-success, #4caf50)';
    case 'queued':
    case 'pending': return 'var(--color-warning, #ff9800)';
    case 'paused': return 'var(--color-info, #2196f3)';
    case 'complete': return 'var(--color-success, #4caf50)';
    case 'error':
    case 'failed':
    case 'cancelled': return 'var(--color-error, #f44336)';
    default: return 'var(--text-secondary, #999)';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'running': return '● Running';
    case 'queued':
    case 'pending': return '◌ Queued';
    case 'paused': return '❚❚ Paused';
    case 'complete': return '✓ Complete';
    case 'error':
    case 'failed': return '✗ Failed';
    case 'cancelled': return '✗ Cancelled';
    default: return status;
  }
}

function scheduleLabel(schedule) {
  if (!schedule || schedule === 'default') return 'Default (6h)';
  if (schedule === 'daily') return 'Daily';
  if (schedule === 'weekly') return 'Weekly';
  return schedule;
}

// ==================== RENDER ====================

function renderAutoCheckHeader() {
  const ac = state.autoCheck;
  if (!ac) return '';

  return `
    <div class="queue-inline-header">
      <span class="text-muted">${ac.enabledCount} monitored · Last: ${timeAgo(ac.lastRun)}</span>
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">▶ Run All Now</button>
    </div>
  `;
}

function renderScheduledMangaCard(manga) {
  const nextCheck = manga.nextCheck ? timeUntil(manga.nextCheck) : 'Not set';
  const isDue = manga.nextCheck && new Date(manga.nextCheck) <= new Date();

  return `
    <div class="queue-card scheduled-manga-card ${isDue ? 'due' : ''}" data-manga-id="${manga.id}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📖</span>
          <div>
            <div class="task-title">${manga.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${scheduleLabel(manga.schedule)}${manga.day ? ` · ${manga.day.charAt(0).toUpperCase() + manga.day.slice(1)}` : ''}${manga.time ? ` · ${manga.time}` : ''}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${isDue ? 'text-success' : ''}">${isDue ? '⏳ Due now' : nextCheck}</span>
        </div>
      </div>
    </div>
  `;
}

function renderDownloadCard(taskId, task) {
  const pct = task.total > 0 ? Math.round((task.completed / task.total) * 100) : 0;
  const isActive = task.status === 'running' || task.status === 'queued';
  const isPaused = task.status === 'paused';

  return `
    <div class="queue-card task-card" data-task-id="${taskId}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">📥</span>
          <div>
            <div class="task-title">${task.mangaTitle || 'Download'}</div>
            <div class="task-status" style="color: ${statusColor(task.status)}">${statusLabel(task.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${isActive ? `<button class="btn btn-sm btn-icon" data-action="pause" data-task="${taskId}" title="Pause">⏸</button>` : ''}
          ${isPaused ? `<button class="btn btn-sm btn-icon" data-action="resume" data-task="${taskId}" title="Resume">▶</button>` : ''}
          ${isActive || isPaused ? `<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${taskId}" title="Cancel">✕</button>` : ''}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${pct}%"></div>
          <span class="progress-text">${task.completed} / ${task.total} chapters (${pct}%)</span>
        </div>
        ${task.current ? `<div class="task-current">Currently: Chapter ${task.current}</div>` : ''}
        ${task.errors && task.errors.length > 0 ? `<div class="task-errors">⚠ ${task.errors.length} error(s)</div>` : ''}
      </div>
    </div>
  `;
}

function renderQueueTask(task) {
  const data = task.data || {};
  return `
    <div class="queue-card task-card">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${taskTypeIcon(task.type)}</span>
          <div>
            <div class="task-title">${data.description || data.mangaTitle || task.type}</div>
            <div class="task-status" style="color: ${statusColor(task.status)}">${statusLabel(task.status)}</div>
          </div>
        </div>
      </div>
      ${task.started_at ? `<div class="queue-card-body"><small>Started: ${timeAgo(task.started_at)}</small></div>` : ''}
    </div>
  `;
}

function renderHistoryTask(task) {
  const data = task.data || {};
  const result = task.result || {};
  let subtext = '';

  // Specialized details logic for history items
  if (task.type === 'scrape') {
    if (result.newChaptersCount !== undefined && result.newChaptersCount > 0) {
      subtext = `<div class="task-subtext" style="color: var(--color-success); font-weight: bold;">Found ${result.newChaptersCount} new chapters</div>`;
      if (result.newChapters && Array.isArray(result.newChapters)) {
        subtext += `<div class="task-details hidden" id="task-details-${task.id}" style="font-size: 0.85em; margin-top: 8px;">
                    <strong>New Versions Discovered:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
                        ${result.newChapters.map(c => `<li>Ch. ${c.number}: ${c.url}</li>`).join('')}
                    </ul>
                </div>`;
      }
    } else if (result.newChaptersCount === 0 || result.updated === false) {
      subtext = `<div class="task-subtext" style="color: var(--text-secondary);">No new chapters found</div>`;
    }
  } else if (task.type === 'scan' || task.type === 'scan-local') {
    if (result.count !== undefined) {
      subtext = `<div class="task-subtext">Scanned ${result.count} local chapters</div>`;
    }
  }

  return `
    <div class="queue-card task-card history-card" data-history-id="${task.id}" style="cursor: ${subtext.includes('task-details') ? 'pointer' : 'default'}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${taskTypeIcon(task.type)}</span>
          <div>
            <div class="task-title">${data.description || data.mangaTitle || task.type}</div>
            <div class="task-status" style="color: ${statusColor(task.status)}">${statusLabel(task.status)}</div>
            ${subtext}
          </div>
        </div>
      </div>
      ${task.completed_at ? `<div class="queue-card-body"><small>Completed: ${timeAgo(task.completed_at)}</small></div>` : ''}
    </div>
  `;
}

function render() {
  const downloadEntries = Object.entries(state.downloads);
  const activeDownloads = downloadEntries.filter(([, t]) => t.status !== 'complete');
  const completedDownloads = downloadEntries.filter(([, t]) => t.status === 'complete');

  // Filter out queue tasks that already have a corresponding active download card
  const activeDownloadMangaIds = new Set(activeDownloads.map(([, t]) => t.bookmarkId).filter(Boolean));
  const filteredQueueTasks = state.queueTasks.filter(t => {
    if (t.type === 'download' && t.data?.mangaId && activeDownloadMangaIds.has(t.data.mangaId)) return false;
    return true;
  });
  const totalActive = activeDownloads.length + filteredQueueTasks.length;

  const schedules = state.autoCheck?.schedules || [];

  return `
    ${renderHeader('manga')}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>📋 Task Queue</h2>
        ${totalActive > 0 ? `<span class="queue-badge">${totalActive} active</span>` : ''}
      </div>

      ${activeDownloads.length > 0 || filteredQueueTasks.length > 0 ? `
        <div class="queue-section">
          <h3 class="queue-section-title">Active Tasks</h3>
          ${activeDownloads.map(([id, task]) => renderDownloadCard(id, task)).join('')}
          ${filteredQueueTasks.map(t => renderQueueTask(t)).join('')}
        </div>
      ` : ''}

      ${schedules.length > 0 ? `
        <div class="queue-section">
          <div class="queue-section-header">
            <h3 class="queue-section-title">Scheduled Checks (${schedules.length})</h3>
            ${renderAutoCheckHeader()}
          </div>
          ${schedules.map(m => renderScheduledMangaCard(m)).join('')}
        </div>
      ` : ''}

      ${completedDownloads.length > 0 ? `
        <div class="queue-section">
          <h3 class="queue-section-title">Recently Completed Downloads</h3>
          ${completedDownloads.map(([id, task]) => renderDownloadCard(id, task)).join('')}
        </div>
      ` : ''}

      ${state.historyTasks && state.historyTasks.length > 0 ? `
        <div class="queue-section">
            <h3 class="queue-section-title">Task History</h3>
            <div class="history-list">
                ${state.historyTasks.map(t => renderHistoryTask(t)).join('')}
            </div>
        </div>
      ` : ''}

      ${activeDownloads.length === 0 && filteredQueueTasks.length === 0 && completedDownloads.length === 0 && schedules.length === 0 && (!state.historyTasks || state.historyTasks.length === 0) ? `
        <div class="queue-empty">
          <div class="empty-icon">✨</div>
          <h3>All Clear</h3>
          <p>No active tasks or scheduled checks. Enable auto-check on manga to see them here.</p>
        </div>
      ` : ''}
    </div>
  `;
}

// ==================== DATA ====================

async function loadData() {
  try {
    const [downloads, queueTasks, historyTasks, autoCheck] = await Promise.all([
      api.getDownloads().catch(() => ({})),
      api.getQueueTasks().catch(() => []),
      api.getQueueHistory(50).catch(() => []), // fetch last 50 historical tasks
      api.getAutoCheckStatus().catch(() => null)
    ]);

    state.downloads = downloads || {};
    state.queueTasks = queueTasks || [];
    state.historyTasks = historyTasks || [];
    state.autoCheck = autoCheck;
    state.loading = false;
  } catch (err) {
    console.error('[Queue] Failed to load data:', err);
    state.loading = false;
  }
}

function refresh() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = render();
  setupListeners();
}

// ==================== LISTENERS ====================

function setupListeners() {
  setupHeaderListeners();

  // Run auto-check button
  const runBtn = document.getElementById('run-autocheck-btn');
  if (runBtn) {
    runBtn.addEventListener('click', async () => {
      runBtn.disabled = true;
      runBtn.textContent = '⏳ Running...';
      try {
        showToast('Auto-check started...', 'info');
        const result = await api.runAutoCheck();
        showToast(`Check complete: ${result.checked} checked, ${result.updated} updated`, 'success');
        await loadData();
        refresh();
      } catch (err) {
        showToast('Auto-check failed: ' + err.message, 'error');
        runBtn.disabled = false;
        runBtn.textContent = '▶ Run Now';
      }
    });
  }

  // Scheduled manga card clicks - navigate to manga
  document.querySelectorAll('.scheduled-manga-card').forEach(card => {
    card.addEventListener('click', () => {
      const mangaId = card.dataset.mangaId;
      if (mangaId) {
        window.location.hash = `#/manga/${mangaId}`;
      }
    });
  });

  // Download action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const taskId = btn.dataset.task;
      try {
        if (action === 'pause') {
          await api.pauseDownload(taskId);
          showToast('Download paused', 'info');
        } else if (action === 'resume') {
          await api.resumeDownload(taskId);
          showToast('Download resumed', 'info');
        } else if (action === 'cancel') {
          if (confirm('Cancel this download?')) {
            await api.cancelDownload(taskId);
            showToast('Download cancelled', 'info');
          }
        }
        await loadData();
        refresh();
      } catch (err) {
        showToast(`Action failed: ${err.message}`, 'error');
      }
    });
  });

  // Expand history logic
  document.querySelectorAll('.history-card').forEach(card => {
    card.addEventListener('click', () => {
      const historyId = card.dataset.historyId;
      const detailsEl = document.getElementById(`task-details-${historyId}`);
      if (detailsEl) {
        detailsEl.classList.toggle('hidden');
      }
    });
  });
}

// ==================== MOUNT/UNMOUNT ====================

export async function mount() {
  state.loading = true;

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader('manga')}
    <div class="container queue-container">
      <div class="queue-header"><h2>📋 Task Queue</h2></div>
      <div class="loading-spinner"></div>
    </div>
  `;
  setupHeaderListeners();

  await loadData();
  refresh();

  // Auto-refresh every 5 seconds
  refreshInterval = setInterval(async () => {
    await loadData();
    refresh();
  }, 5000);

  // Socket listeners for live updates
  socketHandlers.downloadProgress = (data) => {
    if (data.taskId && state.downloads[data.taskId]) {
      Object.assign(state.downloads[data.taskId], data);
      refresh();
    }
  };
  socketHandlers.downloadCompleted = (data) => {
    loadData().then(refresh);
  };
  socketHandlers.queueUpdated = (data) => {
    loadData().then(refresh);
  };

  socket.on(SocketEvents.DOWNLOAD_PROGRESS, socketHandlers.downloadProgress);
  socket.on(SocketEvents.DOWNLOAD_COMPLETED, socketHandlers.downloadCompleted);
  socket.on(SocketEvents.QUEUE_UPDATED, socketHandlers.queueUpdated);
}

export function unmount() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }

  // Remove socket listeners
  if (socketHandlers.downloadProgress) {
    socket.off(SocketEvents.DOWNLOAD_PROGRESS, socketHandlers.downloadProgress);
  }
  if (socketHandlers.downloadCompleted) {
    socket.off(SocketEvents.DOWNLOAD_COMPLETED, socketHandlers.downloadCompleted);
  }
  if (socketHandlers.queueUpdated) {
    socket.off(SocketEvents.QUEUE_UPDATED, socketHandlers.queueUpdated);
  }
  socketHandlers = {};
}

export default { mount, unmount };
