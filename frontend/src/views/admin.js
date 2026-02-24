import { api } from '../api.js';
import { showToast } from '../utils/toast.js';

export default {
    mount: async (params) => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="admin-container">
                <header class="admin-header">
                    <h1>System Admin</h1>
                </header>
                <div class="admin-layout">
                    <aside class="admin-sidebar" id="admin-sidebar">
                        <div class="loader">Loading tables...</div>
                    </aside>
                    <main class="admin-main" id="admin-main">
                        <div class="empty-state">Select a table to view data</div>
                    </main>
                </div>
            </div>
        `;

        await loadTables();
    }
};

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
