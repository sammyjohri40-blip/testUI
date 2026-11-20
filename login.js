/* ==============================
   MediMatch — login.js
   Front-end only: validation, show/hide password,
   login <-> sign up toggle, and a simulated submit.
   Replace simulateRequest() with a real API call
   when your backend is ready.
================================ */

(function () {
    'use strict';

    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('formAlert');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const switchLink = document.getElementById('switchMode');
    const nameGroup = document.getElementById('nameGroup');
    const rememberRow = document.getElementById('rememberRow');
    const forgotLink = document.getElementById('forgotLink');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('fullName');

    const heading = document.querySelector('.auth-heading h2');
    const label = document.querySelector('.auth-heading .small-label');
    const switchText = switchLink.parentElement;

    let mode = 'login'; // 'login' | 'signup'

    /* ---------- Helpers ---------- */

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, message) {
        const group = input.closest('.form-group');
        group.classList.add('invalid');
        group.querySelector('.field-error').textContent = message;
    }

    function clearError(input) {
        const group = input.closest('.form-group');
        group.classList.remove('invalid');
        group.querySelector('.field-error').textContent = '';
    }

    function showAlert(type, message) {
        alertBox.className = 'form-alert ' + type;
        alertBox.textContent = message;
        alertBox.hidden = false;
    }

    function hideAlert() {
        alertBox.hidden = true;
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.classList.toggle('loading', isLoading);
        if (isLoading) {
            btnText.textContent = mode === 'login' ? 'Logging in…' : 'Creating account…';
        } else {
            btnText.textContent = mode === 'login' ? 'Log in' : 'Create account';
        }
    }

    /* ---------- Validation ---------- */

    function validate() {
        let valid = true;

        if (mode === 'signup') {
            if (nameInput.value.trim().length < 2) {
                setError(nameInput, 'Please enter your full name.');
                valid = false;
            }
        }

        if (!emailInput.value.trim()) {
            setError(emailInput, 'Email is required.');
            valid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            setError(emailInput, 'Enter a valid email address.');
            valid = false;
        }

        if (!passwordInput.value) {
            setError(passwordInput, 'Password is required.');
            valid = false;
        } else if (mode === 'signup' && passwordInput.value.length < 8) {
            setError(passwordInput, 'Use at least 8 characters.');
            valid = false;
        }

        return valid;
    }

    // Clear errors as the user types
    [emailInput, passwordInput, nameInput].forEach(function (input) {
        input.addEventListener('input', function () {
            clearError(input);
            hideAlert();
        });
    });

    /* ---------- Show / hide password ---------- */

    toggleBtn.addEventListener('click', function () {
        const showing = passwordInput.type === 'text';
        passwordInput.type = showing ? 'password' : 'text';
        toggleBtn.textContent = showing ? 'Show' : 'Hide';
        toggleBtn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });

    /* ---------- Login <-> Sign up ---------- */

    function setMode(newMode) {
        mode = newMode;
        const isLogin = mode === 'login';

        document.title = (isLogin ? 'Log in' : 'Sign up') + ' — MediMatch';
        label.textContent = isLogin ? 'LOG IN' : 'SIGN UP';
        heading.textContent = isLogin ? 'Sign in to your account' : 'Create your account';
        nameGroup.hidden = isLogin;
        rememberRow.hidden = !isLogin;
        forgotLink.hidden = !isLogin;
        passwordInput.autocomplete = isLogin ? 'current-password' : 'new-password';
        btnText.textContent = isLogin ? 'Log in' : 'Create account';

        switchText.innerHTML = isLogin
            ? 'New here? <a href="#" id="switchMode" class="auth-link">Create an account</a>'
            : 'Already have an account? <a href="#" id="switchMode" class="auth-link">Log in</a>';
        document.getElementById('switchMode').addEventListener('click', onSwitch);

        [emailInput, passwordInput, nameInput].forEach(clearError);
        hideAlert();
    }

    function onSwitch(e) {
        e.preventDefault();
        setMode(mode === 'login' ? 'signup' : 'login');
    }

    switchLink.addEventListener('click', onSwitch);

    // Allow linking straight to signup: login.html?mode=signup
    if (new URLSearchParams(window.location.search).get('mode') === 'signup') {
        setMode('signup');
    }

    /* ---------- Forgot password ---------- */

    forgotLink.addEventListener('click', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!emailPattern.test(email)) {
            setError(emailInput, 'Enter your email above, then click "Forgot password".');
            emailInput.focus();
            return;
        }
        showAlert('success', 'If an account exists for ' + email + ', a reset link will be sent.');
    });

    /* ---------- Submit ---------- */

    // TODO: replace with a real fetch() to your backend.
    function simulateRequest(payload) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve({ ok: true, name: payload.name || payload.email.split('@')[0] });
            }, 1200);
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAlert();

        if (!validate()) {
            const firstInvalid = form.querySelector('.form-group.invalid input');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        setLoading(true);

        simulateRequest({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        }).then(function (res) {
            setLoading(false);

            if (!res.ok) {
                showAlert('error', 'Something went wrong. Please try again.');
                return;
            }

            // Store only non-sensitive info (never the password).
            try {
                const store = document.getElementById('remember').checked ? localStorage : sessionStorage;
                store.setItem('medimatchUser', JSON.stringify({ name: res.name, email: emailInput.value.trim() }));
            } catch (err) { /* storage unavailable */ }

            showAlert('success', mode === 'login'
                ? 'Welcome back, ' + res.name + '! Redirecting…'
                : 'Account created! Redirecting…');

            setTimeout(function () {
                window.location.href = 'index.html';
            }, 1200);
        });
    });
})();