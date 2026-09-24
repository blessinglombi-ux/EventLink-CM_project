// ==========================================
// EventLink CM - Authentication JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Password Visibility
    // ------------------------------------------

    const passwordToggles = document.querySelectorAll(".password-toggle");

    passwordToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function () {

            const targetId = toggle.getAttribute("data-target");

            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) {
                return;
            }

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                toggle.textContent = "Hide";

            } else {

                passwordInput.type = "password";

                toggle.textContent = "Show";
            }

        });

    });


    // ------------------------------------------
    // Registration Form
    // ------------------------------------------

    const registerForm = document.querySelector("#register-form");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            const password = document.querySelector("#password");
            const confirmPassword = document.querySelector("#confirm_password");

            if (password && confirmPassword) {

                if (password.value !== confirmPassword.value) {

                    event.preventDefault();

                    showNotification(
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }

                if (password.value.length < 8) {

                    event.preventDefault();

                    showNotification(
                        "Password must contain at least 8 characters.",
                        "error"
                    );

                    return;
                }
            }

        });

    }


    // ------------------------------------------
    // Login Form
    // ------------------------------------------

    const loginForm = document.querySelector("#login-form");

    if (loginForm) {

        loginForm.addEventListener("submit", function () {

            const button = loginForm.querySelector("button[type='submit']");

            if (button) {
                showLoading(button, "Signing in...");
            }

        });

    }


    // ------------------------------------------
    // Registration Form Loading
    // ------------------------------------------

    if (registerForm) {

        registerForm.addEventListener("submit", function () {

            const button = registerForm.querySelector(
                "button[type='submit']"
            );

            if (button) {
                showLoading(button, "Creating account...");
            }

        });

    }


    // ------------------------------------------
    // Email Verification
    // ------------------------------------------

    const verificationForm =
        document.querySelector("#verification-form");

    if (verificationForm) {

        verificationForm.addEventListener("submit", function () {

            const button =
                verificationForm.querySelector(
                    "button[type='submit']"
                );

            if (button) {
                showLoading(button, "Verifying...");
            }

        });

    }

});