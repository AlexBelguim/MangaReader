import { api } from '../api.js';
import { showToast } from '../utils/toast.js';

export default {
    mount: async (params) => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="settings-container">
                <header class="settings-header">
                    <h1>Settings</h1>
                </header>
                <div class="settings-content">
                    <div id="settings-loader" class="loader">Loading settings...</div>
                    <form id="settings-form" style="display: none;">
                        <div class="settings-group">
                            <h2>General</h2>
                            <div class="setting-item">
                                <label for="theme">Theme</label>
                                <select id="theme" name="theme">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="system">System Default</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Add more settings here as needed -->

                        <div class="settings-actions">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Load settings
        try {
            const settings = await api.get('/settings') || {};

            const form = document.getElementById('settings-form');
            const loader = document.getElementById('settings-loader');

            // Populate form
            if (settings.theme) {
                document.getElementById('theme').value = settings.theme;
            }

            loader.style.display = 'none';
            form.style.display = 'block';

            // Handle submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const updates = {};

                for (const [key, value] of formData.entries()) {
                    updates[key] = value;
                }

                try {
                    await api.post('/settings/bulk', updates);
                    showToast('Settings saved successfully');

                    // Apply immediate effects if any
                    if (updates.theme) {
                        // document.documentElement.setAttribute('data-theme', updates.theme);
                    }
                } catch (err) {
                    console.error(err);
                    showToast('Failed to save settings', 'error');
                }
            });

        } catch (err) {
            console.error(err);
            document.getElementById('settings-loader').textContent = 'Error loading settings';
        }
    }
};
