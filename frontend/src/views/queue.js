/**
 * Task Queue View
 * Shows active tasks, downloads, auto-check schedule per manga
 */

import { api } from '../api.js';
import { socket, SocketEvents } from '../socket.js';
import { renderHeader, setupHeaderListeners } from '../components/header.js';
import { showToast } from '../utils/toast.js';
import { icon } from '../icons.js';
import { openCookieImportModal, openSite } from '../site-challenge.js';
import { openAssistModal } from '../site-assist.js';
import { session } from '../session.js';
import { formatBytes } from '../torrent-search.js';
import { openImportReviewModal } from '../import-review.js';
import { confirmDialog, promptDialog } from '../utils/dialog.js';

let state = {
  downloads: {},
  torrents: [],
  imports: [],
  queueTasks: [],
  historyTasks: [],
  autoCheck: null,
  loading: true,
  showEmptyChecks: false,
  collapsed: {
    torrents: false,
    imports: false,
    active: false,
    scheduled: false,
    completed: false,
    history: true
  }
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
    case 'download': return icon('download');
    case 'scrape': return icon('search');
    case 'scan': return icon('folder');
    default: return icon('settings');
  }
}

function statusColor(status) {
  switch (status) {
    case 'running': return 'var(--color-success)';
    case 'queued':
    case 'pending':
    case 'waiting': return 'var(--color-warning)';
    case 'paused': return 'var(--color-info)';
    case 'complete': return 'var(--color-success)';
    case 'error':
    case 'failed':
    case 'cancelled': return 'var(--color-error)';
    default: return 'var(--text-secondary)';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'running': return '● Running';
    case 'queued':
    case 'pending': return '◌ Queued';
    case 'waiting': return '⏳ Waiting for site';
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
      <button class="btn btn-sm btn-primary" id="run-autocheck-btn">${icon('play')} Run All Now</button>
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
          <span class="task-icon">${icon('book-open')}</span>
          <div>
            <div class="task-title">${manga.title}</div>
            <div class="task-status" style="color: var(--text-secondary)">
              ${scheduleLabel(manga.schedule)}${manga.schedule === 'weekly' && manga.day ? ` · ${manga.day.charAt(0).toUpperCase() + manga.day.slice(1)}` : ''}${(manga.schedule === 'daily' || manga.schedule === 'weekly') && manga.time ? ` · ${manga.time}` : ''}
            </div>
          </div>
        </div>
        <div class="schedule-next-info">
          <span class="${isDue ? 'text-success' : ''}">${isDue ? `${icon('alarm-clock')} Due now` : nextCheck}</span>
        </div>
      </div>
    </div>
  `;
}

function escapeText(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// The block a waiting task shows: why it waits and, for admins, how to end
// the wait. Nothing to retry - the task resumes by itself once the site's
// check is passed (assisted solve, pasted cookies, or "retry anyway").
function renderWaitingBlock(task) {
  const ch = task.challenge || {};
  const site = escapeText(task.waitingFor || ch.site || task.site || 'the site');
  const url = escapeText(ch.url || `https://${task.waitingFor || ch.site || task.site}/`);
  const admin = session.isAdmin;
  const reason = ch.reason || (ch.sessionStale ? 'rejected' : 'check');
  const text = reason === 'expired'
    ? `${site}'s verification cookies expired. Solve its check again; this download continues where it stopped.`
    : ch.sessionStale
      ? `${site} no longer accepts the saved cookies. Solve its check again; this download continues where it stopped.`
      : `${site} wants a human verification check. Once it is passed, this download continues where it stopped.`;
  return `
    <div class="task-challenge task-waiting">
      <span>${text}${admin ? '' : ' (An admin has to pass it.)'}</span>
      ${admin ? `<button class="btn btn-sm btn-primary" data-action="solve" data-site="${site}" data-url="${url}" data-reason="${reason}">Solve it here</button>` : ''}
      ${admin ? `<button class="btn btn-sm btn-secondary" data-action="import-cookies" data-site="${site}" data-url="${url}" data-stale="${ch.sessionStale || reason === 'expired' ? '1' : ''}">Paste cookies</button>`
              : `<button class="btn btn-sm btn-secondary" data-action="open-site" data-site="${site}" data-url="${url}">Open ${site}</button>`}
    </div>`;
}

function renderDownloadCard(taskId, task) {
  const pct = task.total > 0 ? Math.round((task.completed / task.total) * 100) : 0;
  const isWaiting = task.status === 'waiting';
  const isActive = task.status === 'running' || task.status === 'queued' || isWaiting;
  const isPaused = task.status === 'paused';
  const visibleErrors = (task.errors || []).filter(e => !e.waiting);
  const hasErrors = visibleErrors.length > 0;
  const canRetry = !isActive && !isPaused && hasErrors && (task.chapterUrls || []).length > 0;

  return `
    <div class="queue-card task-card" data-task-id="${taskId}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${icon('download')}</span>
          <div>
            <div class="task-title">${task.mangaTitle || 'Download'}</div>
            <div class="task-status" style="color: ${statusColor(task.status)}">${statusLabel(task.status)}</div>
          </div>
        </div>
        <div class="task-actions">
          ${isActive && !isWaiting ? `<button class="btn btn-sm btn-icon" data-action="pause" data-task="${taskId}" title="Pause">${icon('pause', { title: 'Pause' })}</button>` : ''}
          ${isPaused ? `<button class="btn btn-sm btn-icon" data-action="resume" data-task="${taskId}" title="Resume">${icon('play', { title: 'Resume' })}</button>` : ''}
          ${isActive || isPaused ? `<button class="btn btn-sm btn-icon btn-danger" data-action="cancel" data-task="${taskId}" title="Cancel">✕</button>` : ''}
        </div>
      </div>
      <div class="queue-card-body">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${pct}%"></div>
          <span class="progress-text">${task.completed} / ${task.total} chapters (${pct}%)</span>
        </div>
        ${task.current ? `<div class="task-current">Currently: Chapter ${task.current}</div>` : ''}
        ${hasErrors ? `
          <div class="task-errors">${icon('triangle-alert')} ${visibleErrors.length} error(s)</div>
          <ul class="task-error-list">${visibleErrors.slice(0, 5).map(e => `<li>${typeof e.chapter === 'number' ? `Ch. ${e.chapter}: ` : ''}${escapeText(e.error)}</li>`).join('')}</ul>` : ''}
        ${isWaiting ? renderWaitingBlock(task) : (canRetry ? `
          <div class="task-challenge">
            <button class="btn btn-sm btn-secondary" data-action="retry" data-task="${taskId}">Retry failed chapters</button>
          </div>` : '')}
      </div>
    </div>
  `;
}

// ==================== TORRENTS ====================

function torrentStatusLabel(t) {
  switch (t.status) {
    case 'downloading':
      if (/paused|stopped/i.test(t.state || '')) return 'Paused';
      if (/queued|metaDL|checking/i.test(t.state || '')) return 'Waiting';
      return 'Downloading';
    case 'grabbing': return 'Fetching the release for qBittorrent';
    case 'completed': return t.autoImport ? 'Downloaded, importing soon' : 'Downloaded';
    case 'importing': return 'Importing';
    case 'imported': return 'Imported';
    case 'failed': return 'Failed';
    case 'removed': return 'Removed from qBittorrent';
    default: return t.status;
  }
}

function torrentStatusColor(t) {
  if (t.status === 'imported') return 'var(--success)';
  if (t.status === 'failed' || t.status === 'removed') return 'var(--error)';
  if (t.status === 'importing' || t.status === 'completed' || t.status === 'grabbing') return 'var(--warning)';
  return 'var(--text-secondary)';
}

function etaText(seconds) {
  if (!seconds || seconds <= 0 || seconds >= 8640000) return '';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
}

function renderTorrentCard(t) {
  const pct = Math.round((t.progress || 0) * 100);
  const downloading = t.status === 'downloading';
  const paused = downloading && /paused|stopped/i.test(t.state || '');
  const canImport = ['completed', 'failed', 'imported'].includes(t.status) && (t.progress || 0) >= 1;
  const target = t.bookmarkId
    ? `<a href="#/manga/${escapeText(t.bookmarkId)}">open series</a>`
    : (t.newSeriesTitle ? `new series “${escapeText(t.newSeriesTitle)}”` : '');
  const result = t.importResult;
  const resultText = result
    ? [result.volumes?.length ? `${result.volumes.length} volume${result.volumes.length === 1 ? '' : 's'} (${result.volumes.map(v => v.name).join(', ')})` : '',
       result.chapters?.length ? `${result.chapters.length} chapter${result.chapters.length === 1 ? '' : 's'}` : '',
       result.skipped?.length ? `${result.skipped.length} skipped` : ''].filter(Boolean).join(' · ')
    : '';
  const meta = [
    formatBytes(t.size),
    downloading && t.dlspeed ? `${formatBytes(t.dlspeed)}/s` : '',
    downloading ? etaText(t.eta) : '',
    t.indexer || ''
  ].filter(Boolean).join(' · ');

  return `
    <div class="queue-card task-card torrent-card" data-hash="${escapeText(t.hash)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${icon('download')}</span>
          <div>
            <div class="task-title" title="${escapeText(t.releaseTitle || t.name)}">${escapeText(t.name || t.releaseTitle)}</div>
            <div class="task-status" style="color: ${torrentStatusColor(t)}">${torrentStatusLabel(t)}${target ? ` · ${target}` : ''}</div>
          </div>
        </div>
        <div class="task-actions">
          ${downloading && !paused ? `<button class="btn btn-sm btn-icon" data-taction="pause" title="Pause">${icon('pause', { title: 'Pause' })}</button>` : ''}
          ${paused ? `<button class="btn btn-sm btn-icon" data-taction="resume" title="Resume">${icon('play', { title: 'Resume' })}</button>` : ''}
          ${canImport ? `<button class="btn btn-sm btn-secondary" data-taction="review" title="Choose what to import, and as what">${t.status === 'imported' ? 'Import again' : 'Review import'}</button>${t.status === 'imported' ? '' : `<button class="btn btn-sm btn-secondary" data-taction="import" title="Import everything at the detected numbers">${t.status === 'failed' ? 'Retry import' : 'Import all'}</button>`}` : ''}
          <button class="btn btn-sm btn-icon btn-danger" data-taction="remove" title="${['imported', 'grabbing'].includes(t.status) ? 'Remove from this list' : 'Remove from qBittorrent and this list'}">✕</button>
        </div>
      </div>
      <div class="queue-card-body">
        ${!['imported', 'grabbing'].includes(t.status) ? `
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${pct}%"></div>
          <span class="progress-text">${pct}%${meta ? ` · ${meta}` : ''}</span>
        </div>` : `<div class="task-current">${meta}</div>`}
        ${resultText ? `<div class="task-current">${icon('check')} ${escapeText(resultText)}</div>` : ''}
        ${result?.skipped?.length ? `<ul class="task-error-list">${result.skipped.slice(0, 4).map(s => `<li>${escapeText(s)}</li>`).join('')}</ul>` : ''}
        ${t.error ? `<div class="task-errors">${icon('triangle-alert')} ${escapeText(t.error)}</div>` : ''}
      </div>
    </div>
  `;
}

function importStatusLabel(rec) {
  switch (rec.status) {
    case 'queued': return '◌ Queued';
    case 'running': return '● Importing';
    case 'done': return '✓ Imported';
    case 'failed': return '✗ Failed';
    default: return rec.status;
  }
}

function importStatusColor(rec) {
  if (rec.status === 'done') return 'var(--color-success)';
  if (rec.status === 'failed') return 'var(--color-error)';
  return 'var(--color-warning)';
}

// One import (a finished torrent or a folder on disk) running as a task
function renderImportCard(rec) {
  const total = rec.total || 0;
  const done = rec.status === 'done' ? total : (rec.done || 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : (rec.status === 'done' ? 100 : 0);
  const s = rec.summary;
  const resultText = s
    ? [s.volumes?.length ? `${s.volumes.length} volume${s.volumes.length === 1 ? '' : 's'} (${s.volumes.map(v => v.name).join(', ')})` : '',
       s.chapters?.length ? `${s.chapters.length} chapter${s.chapters.length === 1 ? '' : 's'}` : '',
       s.skipped?.length ? `${s.skipped.length} skipped` : ''].filter(Boolean).join(' · ')
    : '';
  const target = rec.bookmarkId
    ? `<a href="#/manga/${escapeText(rec.bookmarkId)}">${escapeText(rec.bookmarkTitle || 'open series')}</a>`
    : (rec.bookmarkTitle ? `new series “${escapeText(rec.bookmarkTitle)}”` : '');
  return `
    <div class="queue-card task-card import-card" data-import-id="${escapeText(rec.id)}">
      <div class="queue-card-header">
        <div class="task-info">
          <span class="task-icon">${icon(rec.path ? 'folder' : 'package')}</span>
          <div>
            <div class="task-title" title="${escapeText(rec.path || rec.title)}">${escapeText(rec.title)}</div>
            <div class="task-status" style="color: ${importStatusColor(rec)}">${importStatusLabel(rec)}${target ? ` · into ${target}` : ''}</div>
          </div>
        </div>
      </div>
      <div class="queue-card-body">
        ${rec.status === 'running' || rec.status === 'queued' ? `
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${pct}%"></div>
            <span class="progress-text">${total ? `${done} / ${total} items (${pct}%)` : 'Starting…'}</span>
          </div>
          ${rec.current ? `<div class="task-current">Currently: ${escapeText(rec.current)}</div>` : ''}` : ''}
        ${rec.status === 'done' && resultText ? `<div class="task-current">${escapeText(resultText)}</div>` : ''}
        ${rec.status === 'done' && s?.skipped?.length ? `<ul class="task-error-list">${s.skipped.slice(0, 5).map(x => `<li>${escapeText(x)}</li>`).join('')}</ul>` : ''}
        ${rec.status === 'failed' ? `<div class="task-errors">${icon('triangle-alert')} ${escapeText(rec.error || 'Import failed')}</div>` : ''}
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
      ${task.status === 'waiting' && task.error ? `<div class="queue-card-body"><div class="task-challenge task-waiting"><span>${escapeText(task.error)}</span></div></div>`
        : task.started_at ? `<div class="queue-card-body"><small>Started: ${timeAgo(task.started_at)}</small></div>` : ''}
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
  } else if (task.type === 'download') {
    // Say what actually landed on disk. A failed row carries the reason
    // (e.g. every page 403'd) so a chapter that "didn't download" is
    // explained here instead of silently showing as done.
    if (task.status === 'failed' && task.error) {
      subtext = `<div class="task-subtext" style="color: var(--color-error, #e05555);">${task.error}</div>`;
    } else if (result.downloaded !== undefined) {
      const parts = [`${result.downloaded} chapter${result.downloaded === 1 ? '' : 's'} downloaded`];
      if (result.pages) parts.push(`${result.pages} pages`);
      if (result.failed) parts.push(`${result.failed} failed`);
      const partial = (result.errors || []).filter(e => e.partial);
      if (partial.length) parts.push(`${partial.length} with missing pages`);
      subtext = `<div class="task-subtext" style="color: var(--text-secondary);">${parts.join(' · ')}</div>`;
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
  const activeTorrents = state.torrents.filter(t => ['downloading', 'completed', 'importing'].includes(t.status));
  const activeImports = state.imports.filter(r => r.status === 'running' || r.status === 'queued');
  // Import tasks show as their own cards, not as bare queue rows
  const queueTasksShown = filteredQueueTasks.filter(t => t.type !== 'import');
  const totalActive = activeDownloads.length + queueTasksShown.length + activeTorrents.length + activeImports.length;

  const schedules = state.autoCheck?.schedules || [];

  return `
    ${renderHeader('manga')}
    <div class="container queue-container">
      <div class="queue-header">
        <h2>${icon('list-checks')} Task Queue</h2>
        ${totalActive > 0 ? `<span class="queue-badge">${totalActive} active</span>` : ''}
      </div>

      ${state.torrents.length > 0 ? `
        <div class="queue-section ${state.collapsed.torrents ? 'collapsed' : ''}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="torrents">
            <span class="collapse-icon">▼</span> Torrents (${activeTorrents.length} active)
          </h3>
          <div class="queue-section-content">
            ${state.torrents.map(renderTorrentCard).join('')}
          </div>
        </div>
      ` : ''}

      ${state.imports.length > 0 ? `
        <div class="queue-section ${state.collapsed.imports ? 'collapsed' : ''}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="imports">
            <span class="collapse-icon">▼</span> Imports (${activeImports.length} active)
          </h3>
          <div class="queue-section-content">
            ${state.imports.map(renderImportCard).join('')}
          </div>
        </div>
      ` : ''}

      ${activeDownloads.length > 0 || queueTasksShown.length > 0 ? `
        <div class="queue-section ${state.collapsed.active ? 'collapsed' : ''}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="active">
            <span class="collapse-icon">▼</span> Active Tasks
          </h3>
          <div class="queue-section-content">
            ${activeDownloads.map(([id, task]) => renderDownloadCard(id, task)).join('')}
            ${queueTasksShown.map(t => renderQueueTask(t)).join('')}
          </div>
        </div>
      ` : ''}

      ${schedules.length > 0 ? `
        <div class="queue-section ${state.collapsed.scheduled ? 'collapsed' : ''}">
          <div class="queue-section-header">
            <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="scheduled">
              <span class="collapse-icon">▼</span> Scheduled Checks (${schedules.length})
            </h3>
            ${renderAutoCheckHeader()}
          </div>
          <div class="queue-section-content">
            ${schedules.map(m => renderScheduledMangaCard(m)).join('')}
          </div>
        </div>
      ` : ''}

      ${completedDownloads.length > 0 ? `
        <div class="queue-section ${state.collapsed.completed ? 'collapsed' : ''}">
          <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="completed">
            <span class="collapse-icon">▼</span> Recently Completed Downloads
          </h3>
          <div class="queue-section-content">
            ${completedDownloads.map(([id, task]) => renderDownloadCard(id, task)).join('')}
          </div>
        </div>
      ` : ''}

      ${state.historyTasks && state.historyTasks.length > 0 ? (() => {
        const emptyCheckFilter = (t) => {
          if (t.type !== 'scrape') return false;
          const result = t.result || {};
          return (t.status === 'complete' || t.status === 'completed') && (result.newChaptersCount === 0 || result.updated === false);
        };
        const emptyCheckCount = state.historyTasks.filter(emptyCheckFilter).length;
        const visibleTasks = state.showEmptyChecks
          ? state.historyTasks
          : state.historyTasks.filter(t => !emptyCheckFilter(t));
        const hasHidden = !state.showEmptyChecks && emptyCheckCount > 0;
        return `
        <div class="queue-section ${state.collapsed.history ? 'collapsed' : ''}">
            <div class="queue-section-header">
              <h3 class="queue-section-title queue-section-header-collapsible" data-toggle="history">
                <span class="collapse-icon">▼</span> Task History
              </h3>
              <div style="display: flex; gap: 8px; align-items: center;">
                ${emptyCheckCount > 0 ? `
                  <button class="btn btn-sm btn-secondary" id="toggle-empty-checks-btn" title="${state.showEmptyChecks ? 'Hide' : 'Show'} checks with no new chapters">
                    ${state.showEmptyChecks ? `${icon('chevron-up')} Hide` : `${icon('chevron-down')} Show`} empty checks (${emptyCheckCount})
                  </button>
                ` : ''}
                <button class="btn btn-sm btn-danger queue-clear-btn" id="clear-history-btn">
                  ${icon('trash-2')} Clear History
                </button>
              </div>
            </div>
            <div class="queue-section-content history-list">
                ${visibleTasks.length > 0 ? visibleTasks.map(t => renderHistoryTask(t)).join('') : `
                  <div class="queue-empty" style="padding: 1rem;">
                    <p style="color: var(--text-secondary); margin: 0;">No notable tasks in history. ${emptyCheckCount > 0 ? `${emptyCheckCount} empty check(s) hidden.` : ''}</p>
                  </div>
                `}
            </div>
        </div>
      `;
      })() : ''}

      ${activeDownloads.length === 0 && filteredQueueTasks.length === 0 && completedDownloads.length === 0 && schedules.length === 0 && (!state.historyTasks || state.historyTasks.length === 0) ? `
        <div class="queue-empty">
          <div class="empty-icon">${icon('check')}</div>
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
    const [downloads, queueTasks, historyTasks, autoCheck, torrents, imports] = await Promise.all([
      api.getDownloads().catch(() => ({})),
      api.getQueueTasks().catch(() => []),
      api.getQueueHistory(50).catch(() => []), // fetch last 50 historical tasks
      api.getAutoCheckStatus().catch(() => null),
      api.getTorrentDownloads().catch(() => ({ torrents: [] })),
      api.getImports().catch(() => ({ imports: [] }))
    ]);

    state.downloads = downloads || {};
    state.torrents = torrents?.torrents || [];
    state.imports = imports?.imports || [];
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

  // Toggle collapsible sections
  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', (e) => {
      const section = el.dataset.toggle;
      state.collapsed[section] = !state.collapsed[section];
      refresh();
    });
  });

  // Run auto-check button
  const runBtn = document.getElementById('run-autocheck-btn');
  if (runBtn) {
    runBtn.addEventListener('click', async () => {
      runBtn.disabled = true;
      // innerHTML — these labels carry an inline SVG icon.
      runBtn.innerHTML = `${icon('loader', { spin: true })} Running...`;
      try {
        showToast('Auto-check started...', 'info');
        const result = await api.runAutoCheck();
        showToast(`Check complete: ${result.checked} checked, ${result.updated} updated`, 'success');
        await loadData();
        refresh();
      } catch (err) {
        showToast('Auto-check failed: ' + err.message, 'error');
        runBtn.disabled = false;
        runBtn.innerHTML = `${icon('play')} Run Now`;
      }
    });
  }

  const clearHistoryBtn = document.getElementById('clear-history-btn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // prevent collapsing the section
      if (await confirmDialog('Are you sure you want to clear the task history?', { danger: true })) {
        try {
          await api.clearQueueHistory();
          showToast('History cleared', 'success');
          await loadData();
          refresh();
        } catch (err) {
          showToast(`Failed to clear history: ${err.message}`, 'error');
        }
      }
    });
  }

  const toggleEmptyBtn = document.getElementById('toggle-empty-checks-btn');
  if (toggleEmptyBtn) {
    toggleEmptyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.showEmptyChecks = !state.showEmptyChecks;
      refresh();
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

  // Torrent action buttons
  document.querySelectorAll('.torrent-card [data-taction]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const hash = btn.closest('.torrent-card').dataset.hash;
      const t = state.torrents.find(x => x.hash === hash);
      const action = btn.dataset.taction;
      try {
        if (action === 'pause') await api.pauseTorrent(hash);
        else if (action === 'resume') await api.resumeTorrent(hash);
        else if (action === 'review') {
          openImportReviewModal(t, { onImported: async () => { await loadData(); refresh(); } });
          return;
        } else if (action === 'import') {
          btn.disabled = true;
          btn.textContent = 'Queued…';
          await api.importTorrent(hash);
          showToast('Import queued; its progress shows under Imports', 'info');
        } else if (action === 'remove') {
          const finished = t && ['imported', 'removed'].includes(t.status);
          let deleteFiles = false;
          if (!finished) {
            const answer = await confirmDialog(`Remove "${t?.name || 'this torrent'}" from qBittorrent and stop tracking it?`, { danger: true, confirmText: 'Remove', option: 'Also delete its downloaded files from disk' });
            if (!answer.ok) return;
            deleteFiles = answer.option;
          }
          await api.removeTorrent(hash, { deleteFiles, fromClient: !finished });
          showToast('Torrent removed', 'info');
        }
        await loadData();
        refresh();
      } catch (err) {
        showToast(`Action failed: ${err.message}`, 'error');
        await loadData();
        refresh();
      }
    });
  });

  // Download action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const taskId = btn.dataset.task;
      if (action === 'open-site') {
        // The user completes the site's human check in their own browser tab
        openSite(btn.dataset.site, btn.dataset.url);
        return;
      }
      if (action === 'import-cookies') {
        // ...then hands that browser's cookies to the scraper
        openCookieImportModal({ site: btn.dataset.site, url: btn.dataset.url, stale: btn.dataset.stale === '1' });
        return;
      }
      if (action === 'solve') {
        // Pass the check inside the scraper's own browser, streamed here
        openAssistModal({ site: btn.dataset.site, url: btn.dataset.url, reason: btn.dataset.reason });
        return;
      }
      try {
        if (action === 'pause') {
          await api.pauseDownload(taskId);
          showToast('Download paused', 'info');
        } else if (action === 'resume') {
          await api.resumeDownload(taskId);
          showToast('Download resumed', 'info');
        } else if (action === 'cancel') {
          if (await confirmDialog('Cancel this download?')) {
            await api.cancelDownload(taskId);
            showToast('Download cancelled', 'info');
          }
        } else if (action === 'retry') {
          const result = await api.retryDownload(taskId);
          showToast(`Retrying ${result.chapters.length} chapter${result.chapters.length === 1 ? '' : 's'}`, 'info');
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
      <div class="queue-header"><h2>${icon('list-checks')} Task Queue</h2></div>
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
  // Torrent progress arrives with the full current list
  socketHandlers.torrentUpdate = (data) => {
    if (Array.isArray(data?.torrents)) {
      state.torrents = data.torrents;
      refresh();
    }
  };

  // An import's progress arrives as the whole record
  socketHandlers.importProgress = (rec) => {
    if (!rec?.id) return;
    const i = state.imports.findIndex(r => r.id === rec.id);
    if (i >= 0) state.imports[i] = rec;
    else state.imports.unshift(rec);
    refresh();
  };
  socket.on(SocketEvents.IMPORT_PROGRESS, socketHandlers.importProgress);

  socket.on(SocketEvents.DOWNLOAD_PROGRESS, socketHandlers.downloadProgress);
  socket.on(SocketEvents.DOWNLOAD_COMPLETED, socketHandlers.downloadCompleted);
  socket.on(SocketEvents.QUEUE_UPDATED, socketHandlers.queueUpdated);
  socket.on(SocketEvents.TORRENT_UPDATE, socketHandlers.torrentUpdate);
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
  if (socketHandlers.torrentUpdate) {
    socket.off(SocketEvents.TORRENT_UPDATE, socketHandlers.torrentUpdate);
  }
  if (socketHandlers.importProgress) {
    socket.off(SocketEvents.IMPORT_PROGRESS, socketHandlers.importProgress);
  }
  socketHandlers = {};
}

export default { mount, unmount };
