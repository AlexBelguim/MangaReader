document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const inputs = loginForm.querySelectorAll('input');

    // Clear error on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.textContent = '';
        });
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value;

        if (!username || !password) return;

        // Disable UI
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Success
            localStorage.setItem('token', data.token);
            window.location.href = '/';

        } catch (error) {
            errorMsg.textContent = error.message;
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Logging in...' : 'Log In';
        inputs.forEach(input => input.disabled = isLoading);
    }
});
