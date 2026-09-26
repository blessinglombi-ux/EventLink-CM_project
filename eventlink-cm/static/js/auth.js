/* =========================================================
   EVENTLINK CM
   Authentication JavaScript
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. PASSWORD SHOW / HIDE
       ===================================================== */
    const passwordToggles =
        document.querySelectorAll(".password-toggle");
    passwordToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const inputId =
                toggle.dataset.target;
            const input =
                inputId
                    ? document.getElementById(inputId)
                    : toggle
                        .closest(".password-wrapper")
                        ?.querySelector("input");
            if (!input) {
                return;
            }
            if (input.type === "password") {
                input.type = "text";
                toggle.textContent = "🙈";
                toggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );
            } else {
                input.type = "password";
                toggle.textContent = "👁";
                toggle.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        });
    });
    /* =====================================================
       2. PASSWORD STRENGTH
       ===================================================== */
    const passwordInput =
        document.querySelector(
            "#password, input[name='password']"
        );
    const strengthBar =
        document.querySelector(
            ".password-strength-bar"
        );
    const strengthText =
        document.querySelector(
            ".password-strength-text"
        );
    if (passwordInput) {
        passwordInput.addEventListener(
            "input",
            function () {
                const password =
                    passwordInput.value;
                const score =
                    calculatePasswordStrength(
                        password
                    );
                updatePasswordStrength(
                    score,
                    strengthBar,
                    strengthText
                );
            }
        );
    }
    /* =====================================================
       3. PASSWORD CONFIRMATION
       ===================================================== */
    const confirmPassword =
        document.querySelector(
            "#confirm_password, input[name='confirm_password']"
        );
    const passwordMessage =
        document.querySelector(
            ".password-match-message"
        );
    if (confirmPassword && passwordInput) {
        confirmPassword.addEventListener(
            "input",
            function () {
                checkPasswordMatch(
                    passwordInput,
                    confirmPassword,
                    passwordMessage
                );
            }
        );
    }
    /* =====================================================
       4. EMAIL VALIDATION
       ===================================================== */
    const emailInputs =
        document.querySelectorAll(
            "input[type='email']"
        );
    emailInputs.forEach(function (input) {
        input.addEventListener(
            "blur",
            function () {
                if (
                    input.value &&
                    !isValidEmail(input.value)
                ) {
                    showFieldError(
                        input,
                        "Please enter a valid email address."
                    );
                } else {
                    clearFieldError(input);
                }
            }
        );
    });
    /* =====================================================
       5. REGISTRATION FORM
       ===================================================== */
    const registrationForm =
        document.querySelector(
            "#registration-form, .registration-form"
        );
    if (registrationForm) {
        registrationForm.addEventListener(
            "submit",
            function (event) {
                if (
                    !validateRegistrationForm(
                        registrationForm
                    )
                ) {
                    event.preventDefault();
                }
            }
        );
    }
    /* =====================================================
       6. LOGIN FORM
       ===================================================== */
    const loginForm =
        document.querySelector(
            "#login-form, .login-form"
        );
    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            function (event) {
                if (
                    !validateLoginForm(
                        loginForm
                    )
                ) {
                    event.preventDefault();
                }
            }
        );
    }
    /* =====================================================
       7. ACCOUNT TYPE SELECTION
       ===================================================== */
    const accountTypeInputs =
        document.querySelectorAll(
            "input[name='account_type']"
        );
    const accountTypeCards =
        document.querySelectorAll(
            ".account-type-card"
        );
    accountTypeInputs.forEach(function (input) {
        input.addEventListener(
            "change",
            function () {
                accountTypeCards.forEach(
                    function (card) {
                        card.classList.remove(
                            "selected"
                        );
                    }
                );
                const card =
                    input.closest(
                        ".account-type-card"
                    );
                if (card) {
                    card.classList.add(
                        "selected"
                    );
                }
            }
        );
    });
    /* =====================================================
       8. VERIFICATION CODE INPUT
       ===================================================== */
    const verificationInputs =
        document.querySelectorAll(
            ".verification-code-input"
        );
    verificationInputs.forEach(
        function (input, index) {
            input.addEventListener(
                "input",
                function () {
                    input.value =
                        input.value
                            .replace(/\D/g, "")
                            .slice(0, 1);
                    if (
                        input.value &&
                        index <
                        verificationInputs.length - 1
                    ) {
                        verificationInputs[
                            index + 1
                        ].focus();
                    }
                }
            );
            input.addEventListener(
                "keydown",
                function (event) {
                    if (
                        event.key === "Backspace" &&
                        !input.value &&
                        index > 0
                    ) {
                        verificationInputs[
                            index - 1
                        ].focus();
                    }
                }
            );
            input.addEventListener(
                "paste",
                function (event) {
                    event.preventDefault();
                    const pasted =
                        (
                            event.clipboardData ||
                            window.clipboardData
                        )
                            .getData("text")
                            .replace(/\D/g, "");
                    pasted
                        .slice(
                            0,
                            verificationInputs.length
                        )
                        .split("")
                        .forEach(
                            function (digit, i) {
                                verificationInputs[
                                    i
                                ].value = digit;
                            }
                        );
                    const lastIndex =
                        Math.min(
                            pasted.length,
                            verificationInputs.length
                        ) - 1;
                    if (lastIndex >= 0) {
                        verificationInputs[
                            lastIndex
                        ].focus();
                    }
                }
            );
        }
    );
    /* =====================================================
       9. RESEND VERIFICATION CODE
       ===================================================== */
    const resendButton =
        document.querySelector(
            "[data-resend-code]"
        );
    const resendTimer =
        document.querySelector(
            "[data-resend-timer]"
        );
    if (resendButton) {
        let countdown = 0;
        let timer = null;
        function startResendTimer() {
            countdown = 60;
            resendButton.disabled = true;
            updateResendText();
            timer =
                setInterval(
                    function () {
                        countdown--;
                        updateResendText();
                        if (countdown <= 0) {
                            clearInterval(timer);
                            resendButton.disabled =
                                false;
                            resendButton.textContent =
                                "Resend code";
                            if (resendTimer) {
                                resendTimer.textContent =
                                    "";
                            }
                        }
                    },
                    1000
                );
        }
        function updateResendText() {
            resendButton.textContent =
                `Resend in ${countdown}s`;
            if (resendTimer) {
                resendTimer.textContent =
                    `You can request another code in ${countdown} seconds.`;
            }
        }
        resendButton.addEventListener(
            "click",
            function () {
                /*
                 * Django will handle the real
                 * email resend request.
                 *
                 * This JavaScript only controls
                 * the button and timer.
                 */
                startResendTimer();
            }
        );
    }
    /* =====================================================
       10. FORGOT PASSWORD FORM
       ===================================================== */
    const forgotPasswordForm =
        document.querySelector(
            "#forgot-password-form, .forgot-password-form"
        );
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener(
            "submit",
            function (event) {
                const email =
                    forgotPasswordForm.querySelector(
                        "input[type='email']"
                    );
                if (
                    email &&
                    !isValidEmail(email.value)
                ) {
                    event.preventDefault();
                    showFieldError(
                        email,
                        "Enter a valid email address."
                    );
                    email.focus();
                }
            }
        );
    }
    /* =====================================================
       11. RESET PASSWORD FORM
       ===================================================== */
    const resetPasswordForm =
        document.querySelector(
            "#reset-password-form, .reset-password-form"
        );
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener(
            "submit",
            function (event) {
                const password =
                    resetPasswordForm.querySelector(
                        "input[name='password']"
                    );
                const confirmation =
                    resetPasswordForm.querySelector(
                        "input[name='confirm_password']"
                    );
                if (
                    password &&
                    confirmation
                ) {
                    if (
                        password.value !==
                        confirmation.value
                    ) {
                        event.preventDefault();
                        showFieldError(
                            confirmation,
                            "Passwords do not match."
                        );
                        confirmation.focus();
                    }
                }
            }
        );
    }
    /* =====================================================
       12. HELPER FUNCTIONS
       ===================================================== */
    function calculatePasswordStrength(password) {
        if (!password) {
            return 0;
        }
        let score = 0;
        if (password.length >= 8) {
            score++;
        }
        if (password.length >= 12) {
            score++;
        }
        if (/[a-z]/.test(password)) {
            score++;
        }
        if (/[A-Z]/.test(password)) {
            score++;
        }
        if (/[0-9]/.test(password)) {
            score++;
        }
        if (
            /[^A-Za-z0-9]/.test(password)
        ) {
            score++;
        }
        return Math.min(score, 5);
    }
    function updatePasswordStrength(
        score,
        bar,
        text
    ) {
        if (bar) {
            const percentage =
                (score / 5) * 100;
            bar.style.width =
                `${percentage}%`;
            bar.classList.remove(
                "weak",
                "medium",
                "strong"
            );
            if (score <= 2) {
                bar.classList.add("weak");
            } else if (score <= 4) {
                bar.classList.add("medium");
            } else {
                bar.classList.add("strong");
            }
        }
        if (text) {
            if (score === 0) {
                text.textContent =
                    "Enter a password.";
            } else if (score <= 2) {
                text.textContent =
                    "Weak password";
            } else if (score <= 4) {
                text.textContent =
                    "Good password";
            } else {
                text.textContent =
                    "Strong password";
            }
        }
    }
    function checkPasswordMatch(
        password,
        confirmation,
        message
    ) {
        if (!confirmation.value) {
            clearFieldError(confirmation);
            if (message) {
                message.textContent = "";
            }
            return;
        }
        if (
            password.value ===
            confirmation.value
        ) {
            confirmation.classList.remove(
                "input-error"
            );
            confirmation.classList.add(
                "input-success"
            );
            if (message) {
                message.textContent =
                    "Passwords match.";
                message.className =
                    "password-match-message success";
            }
        } else {
            confirmation.classList.remove(
                "input-success"
            );
            confirmation.classList.add(
                "input-error"
            );
            if (message) {
                message.textContent =
                    "Passwords do not match.";
                message.className =
                    "password-match-message error";
            }
        }
    }
    function isValidEmail(email) {
        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(
            email.trim()
        );
    }
    function showFieldError(
        input,
        message
    ) {
        input.classList.add(
            "input-error"
        );
        input.classList.remove(
            "input-success"
        );
        let error =
            input.parentElement
                ?.querySelector(
                    ".field-error"
                );
        if (!error) {
            error =
                document.createElement(
                    "small"
                );
            error.className =
                "field-error";
            input.parentElement?.appendChild(
                error
            );
        }
        error.textContent =
            message;
    }
    function clearFieldError(input) {
        input.classList.remove(
            "input-error"
        );
        const error =
            input.parentElement
                ?.querySelector(
                    ".field-error"
                );
        if (error) {
            error.remove();
        }
    }
    function validateRegistrationForm(
        form
    ) {
        let valid = true;
        const email =
            form.querySelector(
                "input[type='email']"
            );
        const password =
            form.querySelector(
                "input[name='password']"
            );
        const confirmation =
            form.querySelector(
                "input[name='confirm_password']"
            );
        if (
            email &&
            !isValidEmail(email.value)
        ) {
            showFieldError(
                email,
                "Please enter a valid email address."
            );
            valid = false;
        }
        if (
            password &&
            password.value.length < 8
        ) {
            showFieldError(
                password,
                "Password must contain at least 8 characters."
            );
            valid = false;
        }
        if (
            password &&
            confirmation &&
            password.value !==
            confirmation.value
        ) {
            showFieldError(
                confirmation,
                "Passwords do not match."
            );
            valid = false;
        }
        return valid;
    }
    function validateLoginForm(form) {
        let valid = true;
        const email =
            form.querySelector(
                "input[type='email']"
            );
        const password =
            form.querySelector(
                "input[name='password']"
            );
        if (
            email &&
            !isValidEmail(email.value)
        ) {
            showFieldError(
                email,
                "Please enter a valid email address."
            );
            valid = false;
        }
        if (
            password &&
            !password.value
        ) {
            showFieldError(
                password,
                "Please enter your password."
            );
            valid = false;
        }
        return valid;
    }
});