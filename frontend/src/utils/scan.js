/**
 * Library Scanning Utility
 * Handles scanning the downloads folder and showing the import popup
 */

import { api } from '../api.js';
import { showToast } from './toast.js';

/**
 * Scan library and show import popup if new manga found
 */
export async function handleScan(btn, mobileBtn, onComplete) {
    try {
        if (btn) { btn.disabled = true; btn.textContent = 'Scanning...'; }
        if (mobileBtn) mobileBtn.textContent = 'Scanning...';
        showToast('Scanning downloads folder...', 'info');

        const result = await api.scanLibrary();
        const newFolders = result.found || [];

        if (newFolders.length === 0) {
            showToast('Scan complete: No new manga found', 'info');
            if (onComplete) onComplete();
            return;
        }

        // Show popup with new folders to import
        showImportPopup(newFolders, onComplete);

    } catch (e) {
        showToast('Scan failed: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📁 Scan Folder'; }
        if (mobileBtn) mobileBtn.textContent = '📁 Scan Folder';
    }
}

/**
 * Show import popup for new local manga folders
 */
export async function showImportPopup(folders, onComplete) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'import-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';

    const modal = document.createElement('div');
    modal.style.cssText = 'background:var(--bg-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;';

    modal.innerHTML = `
    <h2 style="margin:0 0 16px 0;">Import Local Manga</h2>
    <p style="margin:0 0 16px 0;color:var(--text-secondary);">Found ${folders.length} new folder(s). Select which to import:</p>
    <div id="import-folder-list" style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
      ${folders.map(f => `
        <label style="display:flex;align-items:center;gap:12px;padding:8px;background:var(--bg-secondary);border-radius:4px;margin-bottom:8px;cursor:pointer;">
          <input type="checkbox" class="import-checkbox" data-folder="${f.folderName}" checked>
          <div style="flex:1;">
            <div style="font-weight:bold;">${f.folderName}</div>
            <div style="font-size:12px;color:var(--text-secondary);">
              ${f.hasChapters ? `${f.chapterCount} chapter(s)` : ''}
              ${f.hasChapters && f.hasCbz ? ' | ' : ''}
              ${f.hasCbz ? `${f.cbzFiles} CBZ file(s)` : ''}
            </div>
          </div>
        </label>
      `).join('')}
    </div>
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <button id="import-cancel-btn" class="btn" style="background:var(--bg-secondary);">Cancel</button>
      <button id="import-all-btn" class="btn btn-primary">Import Selected</button>
    </div>
  `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle cancel
    document.getElementById('import-cancel-btn').addEventListener('click', () => {
        overlay.remove();
    });

    // Handle import
    document.getElementById('import-all-btn').addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.import-checkbox:checked');
        const selectedFolders = Array.from(checkboxes).map(cb => cb.dataset.folder);

        if (selectedFolders.length === 0) {
            showToast('No folders selected', 'warning');
            return;
        }

        const importBtn = document.getElementById('import-all-btn');
        importBtn.disabled = true;
        importBtn.textContent = 'Importing...';

        let importedCount = 0;
        for (const folder of selectedFolders) {
            try {
                await api.importLocalManga(folder);
                importedCount++;
            } catch (e) {
                console.error('Failed to import', folder, e);
            }
        }

        overlay.remove();
        showToast(`Imported ${importedCount} manga`, 'success');
        if (onComplete) onComplete();
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}
