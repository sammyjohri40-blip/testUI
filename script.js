/* ==============================
   MediMatch — script.js (index.html)
================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Open the login page when the "Log in" button is clicked
    var loginBtn = document.querySelector('.login-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});