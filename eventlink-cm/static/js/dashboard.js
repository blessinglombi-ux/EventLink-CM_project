/* =========================================================
   EVENTLINK CM
   Dashboard JavaScript
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. DASHBOARD SIDEBAR
       ===================================================== */
    const sidebarToggle =
        document.querySelector(".sidebar-toggle");
    const sidebar =
        document.querySelector(".dashboard-sidebar");
    const overlay =
        document.querySelector(".sidebar-overlay");
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
            if (overlay) {
                overlay.classList.toggle("active");
            }
        });
    }
    if (overlay) {
        overlay.addEventListener("click", function () {
            sidebar?.classList.remove("open");
            overlay.classList.remove("active");
        });
    }
    /* =====================================================
       2. DASHBOARD PROFILE MENU
       ===================================================== */
    const profileButtons =
        document.querySelectorAll(
            ".profile-menu-button"
        );
    profileButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            const menu =
                button.closest(".profile-menu");
            if (!menu) {
                return;
            }
            menu.classList.toggle("open");
        });
    });
    document.addEventListener("click", function () {
        document
            .querySelectorAll(".profile-menu.open")
            .forEach(function (menu) {
                menu.classList.remove("open");
            });
    });
    /* =====================================================
       3. STATISTICS COUNTER
       ===================================================== */
    const counters =
        document.querySelectorAll(
            "[data-dashboard-count]"
        );
    counters.forEach(function (counter) {
        const target =
            parseInt(
                counter.dataset.dashboardCount,
                10
            );
        if (isNaN(target)) {
            return;
        }
        animateCounter(
            counter,
            target
        );
    });
    function animateCounter(
        element,
        target
    ) {
        const duration = 900;
        const startTime =
            performance.now();
        function update(currentTime) {
            const elapsed =
                currentTime - startTime;
            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );
            const value =
                Math.floor(
                    progress * target
                );
            element.textContent =
                value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(
                    update
                );
            }
        }
        requestAnimationFrame(
            update
        );
    }
    /* =====================================================
       4. PROGRESS BARS
       ===================================================== */
    const progressBars =
        document.querySelectorAll(
            "[data-progress]"
        );
    progressBars.forEach(function (bar) {
        const percentage =
            Math.min(
                Math.max(
                    parseFloat(
                        bar.dataset.progress
                    ) || 0,
                    0
                ),
                100
            );
        requestAnimationFrame(function () {
            bar.style.width =
                `${percentage}%`;
        });
    });
    /* =====================================================
       5. DASHBOARD TABS
       ===================================================== */
    const tabButtons =
        document.querySelectorAll(
            "[data-dashboard-tab]"
        );
    const tabContents =
        document.querySelectorAll(
            "[data-dashboard-content]"
        );
    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const target =
                button.dataset.dashboardTab;
            tabButtons.forEach(
                function (item) {
                    item.classList.remove(
                        "active"
                    );
                }
            );
            tabContents.forEach(
                function (content) {
                    content.classList.remove(
                        "active"
                    );
                }
            );
            button.classList.add(
                "active"
            );
            const content =
                document.querySelector(
                    `[data-dashboard-content="${target}"]`
                );
            if (content) {
                content.classList.add(
                    "active"
                );
            }
        });
    });
    /* =====================================================
       6. DASHBOARD SEARCH
       ===================================================== */
    const dashboardSearch =
        document.querySelector(
            "#dashboard-search"
        );
    const dashboardItems =
        document.querySelectorAll(
            "[data-dashboard-item]"
        );
    if (
        dashboardSearch &&
        dashboardItems.length
    ) {
        dashboardSearch.addEventListener(
            "input",
            function () {
                const search =
                    dashboardSearch.value
                        .trim()
                        .toLowerCase();
                dashboardItems.forEach(
                    function (item) {
                        const text =
                            item.textContent
                                .toLowerCase();
                        item.style.display =
                            text.includes(search)
                                ? ""
                                : "none";
                    }
                );
            }
        );
    }
    /* =====================================================
       7. NOTIFICATION PANEL
       ===================================================== */
    const notificationButton =
        document.querySelector(
            ".notification-button"
        );
    const notificationPanel =
        document.querySelector(
            ".notification-panel"
        );
    if (
        notificationButton &&
        notificationPanel
    ) {
        notificationButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();
                notificationPanel.classList.toggle(
                    "open"
                );
            }
        );
        document.addEventListener(
            "click",
            function () {
                notificationPanel.classList.remove(
                    "open"
                );
            }
        );
    }
    /* =====================================================
       8. MARK NOTIFICATIONS AS READ
       ===================================================== */
    const notificationItems =
        document.querySelectorAll(
            "[data-notification]"
        );
    notificationItems.forEach(
        function (notification) {
            notification.addEventListener(
                "click",
                function () {
                    notification.classList.remove(
                        "unread"
                    );
                }
            );
        }
    );
    /* =====================================================
       9. MARK ALL NOTIFICATIONS AS READ
       ===================================================== */
    const markAllRead =
        document.querySelector(
            "[data-mark-all-read]"
        );
    if (markAllRead) {
        markAllRead.addEventListener(
            "click",
            function () {
                document
                    .querySelectorAll(
                        "[data-notification].unread"
                    )
                    .forEach(
                        function (notification) {
                            notification.classList.remove(
                                "unread"
                            );
                        }
                    );
                const badge =
                    document.querySelector(
                        ".notification-count"
                    );
                if (badge) {
                    badge.textContent = "0";
                    badge.style.display =
                        "none";
                }
            }
        );
    }
    /* =====================================================
       10. ORGANIZER EVENT FILTER
       ===================================================== */
    const statusFilter =
        document.querySelector(
            "#event-status-filter"
        );
    const organizerEvents =
        document.querySelectorAll(
            "[data-organizer-event]"
        );
    if (
        statusFilter &&
        organizerEvents.length
    ) {
        statusFilter.addEventListener(
            "change",
            function () {
                const selected =
                    statusFilter.value;
                organizerEvents.forEach(
                    function (eventCard) {
                        const status =
                            eventCard.dataset.status;
                        if (
                            selected === "all" ||
                            selected === status
                        ) {
                            eventCard.style.display =
                                "";
                        } else {
                            eventCard.style.display =
                                "none";
                        }
                    }
                );
            }
        );
    }
    /* =====================================================
       11. ATTENDANCE SEARCH
       ===================================================== */
    const attendanceSearch =
        document.querySelector(
            "#attendance-search"
        );
    const attendanceRows =
        document.querySelectorAll(
            "[data-attendance-row]"
        );
    if (
        attendanceSearch &&
        attendanceRows.length
    ) {
        attendanceSearch.addEventListener(
            "input",
            function () {
                const search =
                    attendanceSearch.value
                        .trim()
                        .toLowerCase();
                attendanceRows.forEach(
                    function (row) {
                        const text =
                            row.textContent
                                .toLowerCase();
                        row.style.display =
                            text.includes(search)
                                ? ""
                                : "none";
                    }
                );
            }
        );
    }
    /* =====================================================
       12. ATTENDANCE FILTER
       ===================================================== */
    const attendanceFilter =
        document.querySelector(
            "#attendance-filter"
        );
    if (
        attendanceFilter &&
        attendanceRows.length
    ) {
        attendanceFilter.addEventListener(
            "change",
            function () {
                const selected =
                    attendanceFilter.value;
                attendanceRows.forEach(
                    function (row) {
                        const status =
                            row.dataset.attendanceStatus;
                        if (
                            selected === "all" ||
                            selected === status
                        ) {
                            row.style.display =
                                "";
                        } else {
                            row.style.display =
                                "none";
                        }
                    }
                );
            }
        );
    }
    /* =====================================================
       13. SELECT ALL CHECKBOXES
       ===================================================== */
    const selectAll =
        document.querySelector(
            "[data-select-all]"
        );
    if (selectAll) {
        selectAll.addEventListener(
            "change",
            function () {
                const checkboxes =
                    document.querySelectorAll(
                        "[data-select-item]"
                    );
                checkboxes.forEach(
                    function (checkbox) {
                        checkbox.checked =
                            selectAll.checked;
                    }
                );
            }
        );
    }
    /* =====================================================
       14. PROFILE EDIT MODE
       ===================================================== */
    const editProfileButton =
        document.querySelector(
            "[data-edit-profile]"
        );
    const profileForm =
        document.querySelector(
            "#profile-form"
        );
    if (
        editProfileButton &&
        profileForm
    ) {
        const inputs =
            profileForm.querySelectorAll(
                "input, textarea, select"
            );
        editProfileButton.addEventListener(
            "click",
            function () {
                const editing =
                    profileForm.classList.toggle(
                        "editing"
                    );
                inputs.forEach(
                    function (input) {
                        if (
                            input.dataset.alwaysDisabled
                        ) {
                            return;
                        }
                        input.disabled =
                            !editing;
                    }
                );
                editProfileButton.textContent =
                    editing
                        ? "Cancel"
                        : "Edit profile";
            }
        );
    }
    /* =====================================================
       15. DASHBOARD DATE
       ===================================================== */
    const dateElements =
        document.querySelectorAll(
            "[data-dashboard-date]"
        );
    dateElements.forEach(
        function (element) {
            const date =
                new Date();
            element.textContent =
                date.toLocaleDateString(
                    undefined,
                    {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );
        }
    );
    /* =====================================================
       16. ORGANIZER EVENT PROGRESS
       ===================================================== */
    const eventProgress =
        document.querySelectorAll(
            "[data-event-progress]"
        );
    eventProgress.forEach(
        function (element) {
            const registered =
                Number(
                    element.dataset.registered
                ) || 0;
            const capacity =
                Number(
                    element.dataset.capacity
                ) || 0;
            if (capacity <= 0) {
                return;
            }
            const percentage =
                Math.min(
                    (registered / capacity) * 100,
                    100
                );
            const bar =
                element.querySelector(
                    ".progress-bar"
                );
            const text =
                element.querySelector(
                    ".progress-text"
                );
            if (bar) {
                setTimeout(
                    function () {
                        bar.style.width =
                            `${percentage}%`;
                    },
                    100
                );
            }
            if (text) {
                text.textContent =
                    `${registered} / ${capacity} registered`;
            }
        }
    );
    /* =====================================================
       17. DASHBOARD TABLE ROW HOVER
       ===================================================== */
    const tableRows =
        document.querySelectorAll(
            ".dashboard-table tbody tr"
        );
    tableRows.forEach(
        function (row) {
            row.addEventListener(
                "mouseenter",
                function () {
                    row.classList.add(
                        "highlight"
                    );
                }
            );
            row.addEventListener(
                "mouseleave",
                function () {
                    row.classList.remove(
                        "highlight"
                    );
                }
            );
        }
    );
    /* =====================================================
       18. RESPONSIVE SIDEBAR CLOSE
       ===================================================== */
    window.addEventListener(
        "resize",
        function () {
            if (
                window.innerWidth > 900 &&
                sidebar
            ) {
                sidebar.classList.remove(
                    "open"
                );
                if (overlay) {
                    overlay.classList.remove(
                        "active"
                    );
                }
            }
        }
    );
    /* =====================================================
       19. DASHBOARD MODULE LOADED
       ===================================================== */
    console.log(
        "EventLink CM dashboard module loaded successfully."
    );
});