/* =========================================================
   EVENTLINK CM
   Main JavaScript
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. MOBILE MENU
       ===================================================== */
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("open");
            const expanded =
                mainNav.classList.contains("open");
            menuToggle.setAttribute(
                "aria-expanded",
                expanded
            );
        });
    }
    /* =====================================================
       2. DASHBOARD SIDEBAR
       ===================================================== */
    const sidebarToggle =
        document.querySelector(".sidebar-toggle");
    const dashboardSidebar =
        document.querySelector(".dashboard-sidebar");
    const sidebarOverlay =
        document.querySelector(".sidebar-overlay");
    function openSidebar() {
        if (dashboardSidebar) {
            dashboardSidebar.classList.add("open");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }
        document.body.classList.add("sidebar-open");
    }
    function closeSidebar() {
        if (dashboardSidebar) {
            dashboardSidebar.classList.remove("open");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
        document.body.classList.remove("sidebar-open");
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener(
            "click",
            function () {
                if (
                    dashboardSidebar &&
                    dashboardSidebar.classList.contains("open")
                ) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }
        );
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }
    /* =====================================================
       3. CLOSE MOBILE MENUS WITH ESCAPE
       ===================================================== */
    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                closeSidebar();
                if (mainNav) {
                    mainNav.classList.remove("open");
                }
            }
        }
    );
    /* =====================================================
       4. NAVIGATION DROPDOWNS
       ===================================================== */
    const dropdownButtons =
        document.querySelectorAll(
            ".dropdown-toggle"
        );
    dropdownButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                const dropdown =
                    button.closest(".dropdown");
                if (!dropdown) {
                    return;
                }
                dropdown.classList.toggle("open");
            }
        );
    });
    /* =====================================================
       5. CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
       ===================================================== */
    document.addEventListener(
        "click",
        function (event) {
            const dropdowns =
                document.querySelectorAll(".dropdown");
            dropdowns.forEach(function (dropdown) {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove("open");
                }
            });
        }
    );
    /* =====================================================
       6. ALERT AUTO CLOSE
       ===================================================== */
    const alerts =
        document.querySelectorAll(
            ".alert[data-auto-close]"
        );
    alerts.forEach(function (alert) {
        const delay =
            parseInt(
                alert.dataset.autoClose,
                10
            ) || 5000;
        setTimeout(function () {
            alert.style.opacity = "0";
            alert.style.transform =
                "translateY(-5px)";
            setTimeout(function () {
                alert.remove();
            }, 300);
        }, delay);
    });
    /* =====================================================
       7. CONFIRMATION BUTTONS
       ===================================================== */
    const confirmButtons =
        document.querySelectorAll(
            "[data-confirm]"
        );
    confirmButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function (event) {
                const message =
                    button.dataset.confirm;
                if (
                    message &&
                    !window.confirm(message)
                ) {
                    event.preventDefault();
                }
            }
        );
    });
    /* =====================================================
       8. CURRENT YEAR
       ===================================================== */
    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );
    yearElements.forEach(function (element) {
        element.textContent =
            new Date().getFullYear();
    });
    /* =====================================================
       9. BACK TO TOP BUTTON
       ===================================================== */
    const backToTop =
        document.querySelector(
            ".back-to-top"
        );
    if (backToTop) {
        function updateBackToTop() {
            if (window.scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        }
        window.addEventListener(
            "scroll",
            updateBackToTop
        );
        updateBackToTop();
        backToTop.addEventListener(
            "click",
            function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }
    /* =====================================================
       10. SMOOTH SCROLL
       ===================================================== */
    const smoothLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );
    smoothLinks.forEach(function (link) {
        link.addEventListener(
            "click",
            function (event) {
                const targetId =
                    link.getAttribute("href");
                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }
                const target =
                    document.querySelector(
                        targetId
                    );
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    });
    /* =====================================================
       11. PASSWORD VISIBILITY
       ===================================================== */
    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle"
        );
    passwordToggles.forEach(function (toggle) {
        toggle.addEventListener(
            "click",
            function () {
                const targetId =
                    toggle.dataset.target;
                let passwordInput = null;
                if (targetId) {
                    passwordInput =
                        document.getElementById(
                            targetId
                        );
                } else {
                    const wrapper =
                        toggle.closest(
                            ".password-wrapper"
                        );
                    if (wrapper) {
                        passwordInput =
                            wrapper.querySelector(
                                "input"
                            );
                    }
                }
                if (!passwordInput) {
                    return;
                }
                if (
                    passwordInput.type ===
                    "password"
                ) {
                    passwordInput.type = "text";
                    toggle.textContent = "🙈";
                    toggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );
                } else {
                    passwordInput.type = "password";
                    toggle.textContent = "👁";
                    toggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }
            }
        );
    });
    /* =====================================================
       12. IMAGE PREVIEW
       ===================================================== */
    const imageInputs =
        document.querySelectorAll(
            'input[type="file"][data-preview]'
        );
    imageInputs.forEach(function (input) {
        input.addEventListener(
            "change",
            function () {
                const previewId =
                    input.dataset.preview;
                const preview =
                    document.getElementById(
                        previewId
                    );
                const file =
                    input.files &&
                    input.files[0];
                if (!preview || !file) {
                    return;
                }
                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {
                    preview.textContent =
                        "Please select an image.";
                    return;
                }
                const reader =
                    new FileReader();
                reader.onload =
                    function (event) {
                        if (
                            preview.tagName
                            .toLowerCase() ===
                            "img"
                        ) {
                            preview.src =
                                event.target.result;
                        } else {
                            preview.style.backgroundImage =
                                `url("${event.target.result}")`;
                            preview.classList.add(
                                "has-image"
                            );
                        }
                    };
                reader.readAsDataURL(file);
            }
        );
    });
    /* =====================================================
       13. FILE NAME DISPLAY
       ===================================================== */
    const fileInputs =
        document.querySelectorAll(
            'input[type="file"][data-file-name]'
        );
    fileInputs.forEach(function (input) {
        input.addEventListener(
            "change",
            function () {
                const outputId =
                    input.dataset.fileName;
                const output =
                    document.getElementById(
                        outputId
                    );
                if (!output) {
                    return;
                }
                if (
                    input.files &&
                    input.files.length > 0
                ) {
                    if (input.files.length === 1) {
                        output.textContent =
                            input.files[0].name;
                    } else {
                        output.textContent =
                            `${input.files.length} files selected`;
                    }
                } else {
                    output.textContent =
                        "No file selected";
                }
            }
        );
    });
    /* =====================================================
       14. DELETE / REMOVE ELEMENT
       ===================================================== */
    const removeButtons =
        document.querySelectorAll(
            "[data-remove]"
        );
    removeButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                const selector =
                    button.dataset.remove;
                if (!selector) {
                    return;
                }
                const element =
                    document.querySelector(
                        selector
                    );
                if (!element) {
                    return;
                }
                element.style.opacity = "0";
                element.style.transform =
                    "scale(0.98)";
                setTimeout(function () {
                    element.remove();
                }, 200);
            }
        );
    });
    /* =====================================================
       15. LOADING BUTTON
       ===================================================== */
    const loadingForms =
        document.querySelectorAll(
            "form[data-loading]"
        );
    loadingForms.forEach(function (form) {
        form.addEventListener(
            "submit",
            function () {
                const submitButton =
                    form.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );
                if (!submitButton) {
                    return;
                }
                submitButton.classList.add(
                    "auth-loading"
                );
                submitButton.disabled = true;
            }
        );
    });
    /* =====================================================
       16. CHARACTER COUNTER
       ===================================================== */
    const textareas =
        document.querySelectorAll(
            "textarea[data-maxlength]"
        );
    textareas.forEach(function (textarea) {
        const maxLength =
            parseInt(
                textarea.dataset.maxlength,
                10
            );
        const counterId =
            textarea.dataset.counter;
        const counter =
            counterId
                ? document.getElementById(counterId)
                : null;
        function updateCounter() {
            if (!counter) {
                return;
            }
            counter.textContent =
                `${textarea.value.length}/${maxLength}`;
        }
        textarea.addEventListener(
            "input",
            updateCounter
        );
        updateCounter();
    });
    /* =====================================================
       17. COPY TO CLIPBOARD
       ===================================================== */
    const copyButtons =
        document.querySelectorAll(
            "[data-copy]"
        );
    copyButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            async function () {
                const value =
                    button.dataset.copy;
                if (!value) {
                    return;
                }
                try {
                    await navigator.clipboard.writeText(
                        value
                    );
                    const originalText =
                        button.textContent;
                    button.textContent =
                        "Copied!";
                    setTimeout(function () {
                        button.textContent =
                            originalText;
                    }, 1500);
                } catch (error) {
                    console.error(
                        "Copy failed:",
                        error
                    );
                }
            }
        );
    });
    /* =====================================================
       18. FORM INPUT FOCUS
       ===================================================== */
    const formInputs =
        document.querySelectorAll(
            ".form-control, .form-select"
        );
    formInputs.forEach(function (input) {
        input.addEventListener(
            "focus",
            function () {
                const group =
                    input.closest(
                        ".form-group"
                    );
                if (group) {
                    group.classList.add(
                        "focused"
                    );
                }
            }
        );
        input.addEventListener(
            "blur",
            function () {
                const group =
                    input.closest(
                        ".form-group"
                    );
                if (group) {
                    group.classList.remove(
                        "focused"
                    );
                }
            }
        );
    });
    /* =====================================================
       19. LAZY LOAD IMAGES
       ===================================================== */
    const lazyImages =
        document.querySelectorAll(
            "img[data-src]"
        );
    if ("IntersectionObserver" in window) {
        const imageObserver =
            new IntersectionObserver(
                function (entries, observer) {
                    entries.forEach(
                        function (entry) {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }
                            const image =
                                entry.target;
                            image.src =
                                image.dataset.src;
                            image.removeAttribute(
                                "data-src"
                            );
                            observer.unobserve(
                                image
                            );
                        }
                    );
                }
            );
        lazyImages.forEach(
            function (image) {
                imageObserver.observe(
                    image
                );
            }
        );
    } else {
        lazyImages.forEach(
            function (image) {
                image.src =
                    image.dataset.src;
            }
        );
    }
    /* =====================================================
       20. CONSOLE MESSAGE
       ===================================================== */
    console.log(
        "EventLink CM frontend loaded successfully."
    );
});