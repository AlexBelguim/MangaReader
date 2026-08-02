import { api } from '../api.js';
import { showToast } from '../utils/toast.js';
import { renderHeader } from '../components/header.js';
import { session } from '../session.js';

export default {
    mount: async (params) => {
        const app = document.getElementById('app');

        if (!session.isAdmin) {
            app.innerHTML = `
                ${renderHeader()}
                <div class="container"><div class="empty-state">Admin access required.</div></div>
            `;
            return;
        }

        app.innerHTML = `
            <div class="admin-container">
                <header class="admin-header">
                    <h1>Admin</h1>
                    <nav class="admin-tabs">
                        <button class="admin-tab active" data-section="users">Users</button>
                        <button class="admin-tab" data-section="demo">Demo Content</button>
                        <button class="admin-tab" data-section="database">Database</button>
                    </nav>
                </header>
                <section id="admin-section-users" class="admin-section"></section>
                <section id="admin-section-demo" class="admin-section" style="display:none"></section>
                <section id="admin-section-database" class="admin-section" style="display:none">
                    <div class="admin-layout">
                        <aside class="admin-sidebar" id="admin-sidebar">
                            <div class="loader">Loading tables...</div>
                        </aside>
                        <main class="admin-main" id="admin-main">
                            <div class="empty-state">Select a table to view data</div>
                        </main>
                    </div>
                </section>
            </div>
        `;

        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
                document.getElementById(`admin-section-${tab.dataset.section}`).style.display = '';
            });
        });

        await Promise.all([loadUsers(), loadDemoContent(), loadTables()]);
    }
};

// ==================== USERS ====================

async function loadUsers() {
    const section = document.getElementById('admin-section-users');
    try {
        const users = await api.listUsers();

        section.innerHTML = `
            <h2>Users</h2>
            <div class="table-responsive">
                <table class="data-table admin-users-table">
                    <thead>
                        <tr>
                            <th>Username</th><th>Role</th><th>Download</th><th>Edit</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr data-user-id="${u.id}">
                                <td>${escapeHtml(u.username)}${u.id === session.user?.id ? ' <span class="badge">you</span>' : ''}</td>
                                <td>
                                    <select class="user-role">
                                        <option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option>
                                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
                                    </select>
                                </td>
                                <td><input type="checkbox" class="user-can-download" ${u.canDownload ? 'checked' : ''}></td>
                                <td><input type="checkbox" class="user-can-edit" ${u.canEdit ? 'checked' : ''}></td>
                                <td class="admin-user-actions">
                                    <button class="btn btn-secondary user-reset-pw">Reset password</button>
                                    <button class="btn btn-secondary danger user-delete">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <h3>Add user</h3>
            <form id="add-user-form" class="admin-add-user">
                <input type="text" id="new-username" placeholder="Username" autocomplete="off" required>
                <input type="password" id="new-password" placeholder="Password" autocomplete="new-password" required>
                <select id="new-role">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <label><input type="checkbox" id="new-can-download" checked> Download</label>
                <label><input type="checkbox" id="new-can-edit" checked> Edit</label>
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
        `;

        section.querySelectorAll('tr[data-user-id]').forEach(row => {
            const id = Number(row.dataset.userId);

            const save = async () => {
                try {
                    await api.updateUser(id, {
                        role: row.querySelector('.user-role').value,
                        canDownload: row.querySelector('.user-can-download').checked,
                        canEdit: row.querySelector('.user-can-edit').checked
                    });
                    showToast('User updated', 'success');
                } catch (e) {
                    showToast(e.message, 'error');
                    loadUsers(); // revert to server state
                }
            };

            row.querySelector('.user-role').addEventListener('change', save);
            row.querySelector('.user-can-download').addEventListener('change', save);
            row.querySelector('.user-can-edit').addEventListener('change', save);

            row.querySelector('.user-reset-pw').addEventListener('click', async () => {
                const password = prompt('New password for this user:');
                if (!password) return;
                try {
                    await api.updateUser(id, { password });
                    showToast('Password reset', 'success');
                } catch (e) {
                    showToast(e.message, 'error');
                }
            });

            row.querySelector('.user-delete').addEventListener('click', async () => {
                if (!confirm('Delete this user?')) return;
                try {
                    await api.deleteUser(id);
                    showToast('User deleted', 'success');
                    loadUsers();
                } catch (e) {
                    showToast(e.message, 'error');
                }
            });
        });

        document.getElementById('add-user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await api.createUser({
                    username: document.getElementById('new-username').value.trim(),
                    password: document.getElementById('new-password').value,
                    role: document.getElementById('new-role').value,
                    canDownload: document.getElementById('new-can-download').checked,
                    canEdit: document.getElementById('new-can-edit').checked
                });
                showToast('User created', 'success');
                loadUsers();
            } catch (err) {
                showToast(err.message, 'error');
            }
        });

    } catch (err) {
        console.error(err);
        section.innerHTML = `<div class="error">Failed to load users</div>`;
    }
}

// ==================== DEMO CONTENT ====================

async function loadDemoContent() {
    const section = document.getElementById('admin-section-demo');
    try {
        const bookmarks = await api.getBookmarks();

        section.innerHTML = `
            <h2>Demo Content</h2>
            <p class="admin-demo-warning">
                Checked series are visible to <strong>anyone</strong> on the public demo page
                (<code>/demo.html</code>) — no login needed, covers included. Only downloaded
                chapters are readable there. Be deliberate about adult titles.
            </p>
            <input type="search" id="demo-filter" placeholder="Filter series..." class="admin-demo-filter">
            <ul class="admin-demo-list">
                ${bookmarks.map(b => `
                    <li data-title="${escapeHtml((b.alias || b.title || '').toLowerCase())}">
                        <label>
                            <input type="checkbox" class="demo-toggle" data-id="${b.id}" ${b.isDemo ? 'checked' : ''}>
                            <span>${escapeHtml(b.alias || b.title)}</span>
                            <span class="badge">${b.downloadedCount || 0} downloaded</span>
                        </label>
                    </li>
                `).join('')}
            </ul>
        `;

        section.querySelectorAll('.demo-toggle').forEach(box => {
            box.addEventListener('change', async () => {
                try {
                    await api.toggleDemo(box.dataset.id, box.checked);
                    showToast(box.checked ? 'Added to demo' : 'Removed from demo', 'success');
                } catch (e) {
                    box.checked = !box.checked;
                    showToast(e.message, 'error');
                }
            });
        });

        document.getElementById('demo-filter').addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            section.querySelectorAll('.admin-demo-list li').forEach(li => {
                li.style.display = li.dataset.title.includes(q) ? '' : 'none';
            });
        });

    } catch (err) {
        console.error(err);
        section.innerHTML = `<div class="error">Failed to load bookmarks</div>`;
    }
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ==================== DATABASE BROWSER ====================

async function loadTables() {
    try {
        const data = await api.get('/admin/tables');
        const sidebar = document.getElementById('admin-sidebar');

        sidebar.innerHTML = `
            <h3>Tables</h3>
            <ul class="table-list">
                ${data.tables.map(t => `
                    <li>
                        <a href="#/admin/tables/${t.name}" class="table-link" data-table="${t.name}">
                            ${t.name} <span class="badge">${t.rowCount}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;

        // Handle navigation within admin view
        sidebar.querySelectorAll('.table-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const table = e.currentTarget.dataset.table;
                loadTableData(table);

                // Update active state
                sidebar.querySelectorAll('.table-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

    } catch (err) {
        console.error(err);
        document.getElementById('admin-sidebar').innerHTML = `<div class="error">Failed to load tables</div>`;
    }
}

async function loadTableData(tableName, page = 0) {
    const main = document.getElementById('admin-main');
    main.innerHTML = `<div class="loader">Loading ${tableName}...</div>`;

    try {
        const limit = 50;
        const data = await api.get(`/admin/tables/${tableName}?page=${page}&limit=${limit}`);

        if (!data.rows || data.rows.length === 0) {
            main.innerHTML = `
                <h2>${tableName}</h2>
                <div class="empty-state">No records found</div>
            `;
            return;
        }

        const columns = Object.keys(data.rows[0]);

        main.innerHTML = `
            <div class="table-header">
                <h2>${tableName}</h2>
                <div class="table-actions">
                    <span class="page-info">
                        Page ${data.pagination.page + 1} of ${data.pagination.totalPages} 
                        (${data.pagination.total} records)
                    </span>
                    <div class="pagination">
                        <button ${page === 0 ? 'disabled' : ''} id="prev-page">Previous</button>
                        <button ${!data.pagination.hasMore && page >= data.pagination.totalPages - 1 ? 'disabled' : ''} id="next-page">Next</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${columns.map(c => `<th>${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.rows.map(row => `
                            <tr>
                                ${columns.map(c => {
            const val = row[c];
            let displayVal = val;
            if (val === null) displayVal = '<span class="null">NULL</span>';
            else if (typeof val === 'object') displayVal = JSON.stringify(val);
            else if (String(val).length > 100) displayVal = String(val).substring(0, 100) + '...';
            return `<td>${displayVal}</td>`;
        }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('prev-page')?.addEventListener('click', () => loadTableData(tableName, page - 1));
        document.getElementById('next-page')?.addEventListener('click', () => loadTableData(tableName, page + 1));

    } catch (err) {
        console.error(err);
        main.innerHTML = `<div class="error">Failed to load data for ${tableName}</div>`;
    }
}
