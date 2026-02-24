/**
 * Login Page Script
 */

import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // If already authenticated, redirect to main app
    if (api.isAuthenticated()) {
        window.location.href = '/';
        return;
    }

    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;

        try {
            // Username defaults to 'admin' - single user system
            await api.login('admin', password);
            window.location.href = '/';
        } catch (error) {
            errorMsg.textContent = error.message;
            errorMsg.style.display = 'block';
        }
    });
});
