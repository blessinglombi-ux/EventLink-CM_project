/* =========================================================
   EVENTLINK CM
   Ticket JavaScript
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. PRINT TICKET
       ===================================================== */
    const printButtons =
        document.querySelectorAll(
            "[data-print-ticket]"
        );
    printButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                window.print();
            }
        );
    });
    /* =====================================================
       2. DOWNLOAD / SAVE TICKET
       ===================================================== */
    const downloadButtons =
        document.querySelectorAll(
            "[data-download-ticket]"
        );
    downloadButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                const ticket =
                    document.querySelector(
                        ".ticket-detail-card, .ticket-card"
                    );
                if (!ticket) {
                    return;
                }
                /*
                 * The actual PDF generation can later
                 * be handled by Django or a PDF library.
                 *
                 * For now we use the browser print
                 * dialog so the ticket can be saved
                 * as PDF.
                 */
                window.print();
            }
        );
    });
    /* =====================================================
       3. CANCEL TICKET
       ===================================================== */
    const cancelButtons =
        document.querySelectorAll(
            "[data-cancel-ticket]"
        );
    cancelButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function (event) {
                const confirmed =
                    window.confirm(
                        "Are you sure you want to cancel this ticket?"
                    );
                if (!confirmed) {
                    event.preventDefault();
                    return;
                }
                button.disabled = true;
                button.textContent =
                    "Cancelling...";
            }
        );
    });
    /* =====================================================
       4. QR CODE IMAGE ERROR
       ===================================================== */
    const qrImages =
        document.querySelectorAll(
            ".ticket-qr img, .ticket-detail-qr img"
        );
    qrImages.forEach(function (image) {
        image.addEventListener(
            "error",
            function () {
                const container =
                    image.closest(
                        ".ticket-qr, .ticket-detail-qr"
                    );
                if (!container) {
                    return;
                }
                image.style.display =
                    "none";
                let message =
                    container.querySelector(
                        ".qr-error-message"
                    );
                if (!message) {
                    message =
                        document.createElement(
                            "div"
                        );
                    message.className =
                        "qr-error-message";
                    message.textContent =
                        "QR code unavailable.";
                    container.appendChild(
                        message
                    );
                }
            }
        );
    });
    /* =====================================================
       5. TICKET STATUS
       ===================================================== */
    const ticketStatus =
        document.querySelector(
            "[data-ticket-status]"
        );
    if (ticketStatus) {
        const status =
            ticketStatus.dataset.ticketStatus;
        updateTicketStatus(
            ticketStatus,
            status
        );
    }
    function updateTicketStatus(
        element,
        status
    ) {
        element.classList.remove(
            "valid",
            "used",
            "cancelled",
            "pending"
        );
        switch (status) {
            case "valid":
                element.classList.add(
                    "valid"
                );
                element.textContent =
                    "Valid";
                break;
            case "used":
                element.classList.add(
                    "used"
                );
                element.textContent =
                    "Used";
                break;
            case "cancelled":
                element.classList.add(
                    "cancelled"
                );
                element.textContent =
                    "Cancelled";
                break;
            case "pending":
                element.classList.add(
                    "pending"
                );
                element.textContent =
                    "Pending";
                break;
        }
    }
    /* =====================================================
       6. COPY TICKET NUMBER
       ===================================================== */
    const copyTicketButtons =
        document.querySelectorAll(
            "[data-copy-ticket]"
        );
    copyTicketButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                async function () {
                    const ticketNumber =
                        button.dataset.copyTicket;
                    if (!ticketNumber) {
                        return;
                    }
                    try {
                        await navigator.clipboard.writeText(
                            ticketNumber
                        );
                        const originalText =
                            button.textContent;
                        button.textContent =
                            "Copied!";
                        setTimeout(
                            function () {
                                button.textContent =
                                    originalText;
                            },
                            1500
                        );
                    } catch (error) {
                        console.error(
                            "Unable to copy ticket number:",
                            error
                        );
                    }
                }
            );
        }
    );
    /* =====================================================
       7. TICKET FILTER
       ===================================================== */
    const ticketFilter =
        document.querySelector(
            "#ticket-filter"
        );
    const tickets =
        document.querySelectorAll(
            "[data-ticket-card]"
        );
    if (
        ticketFilter &&
        tickets.length
    ) {
        ticketFilter.addEventListener(
            "change",
            function () {
                const selected =
                    ticketFilter.value;
                tickets.forEach(
                    function (ticket) {
                        const status =
                            ticket.dataset.status;
                        if (
                            selected === "all" ||
                            status === selected
                        ) {
                            ticket.style.display =
                                "";
                        } else {
                            ticket.style.display =
                                "none";
                        }
                    }
                );
                updateTicketEmptyState();
            }
        );
    }
    function updateTicketEmptyState() {
        const visibleTickets =
            Array.from(tickets)
                .filter(
                    function (ticket) {
                        return (
                            ticket.style.display !==
                            "none"
                        );
                    }
                );
        const emptyMessage =
            document.querySelector(
                ".empty-filter-message"
            );
        if (!emptyMessage) {
            return;
        }
        emptyMessage.style.display =
            visibleTickets.length === 0
                ? "block"
                : "none";
    }
    /* =====================================================
       8. TICKET SEARCH
       ===================================================== */
    const ticketSearch =
        document.querySelector(
            "#ticket-search"
        );
    if (
        ticketSearch &&
        tickets.length
    ) {
        ticketSearch.addEventListener(
            "input",
            function () {
                const search =
                    ticketSearch.value
                        .trim()
                        .toLowerCase();
                tickets.forEach(
                    function (ticket) {
                        const text =
                            ticket.textContent
                                .toLowerCase();
                        ticket.style.display =
                            text.includes(search)
                                ? ""
                                : "none";
                    }
                );
                updateTicketEmptyState();
            }
        );
    }
    /* =====================================================
       9. TICKET COUNTDOWN
       ===================================================== */
    const countdownElements =
        document.querySelectorAll(
            "[data-ticket-countdown]"
        );
    countdownElements.forEach(
        function (element) {
            const eventDate =
                new Date(
                    element.dataset.ticketCountdown
                );
            if (
                isNaN(
                    eventDate.getTime()
                )
            ) {
                return;
            }
            function updateCountdown() {
                const now =
                    new Date();
                const difference =
                    eventDate.getTime() -
                    now.getTime();
                if (difference <= 0) {
                    element.textContent =
                        "Event has started";
                    return;
                }
                const days =
                    Math.floor(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );
                const hours =
                    Math.floor(
                        (
                            difference /
                            (1000 * 60 * 60)
                        ) % 24
                    );
                const minutes =
                    Math.floor(
                        (
                            difference /
                            (1000 * 60)
                        ) % 60
                    );
                element.textContent =
                    `${days}d ${hours}h ${minutes}m`;
            }
            updateCountdown();
            setInterval(
                updateCountdown,
                60000
            );
        }
    );
    /* =====================================================
       10. ATTENDANCE STATUS
       ===================================================== */
    const attendanceElements =
        document.querySelectorAll(
            "[data-attendance]"
        );
    attendanceElements.forEach(
        function (element) {
            const status =
                element.dataset.attendance;
            if (status === "attended") {
                element.classList.add(
                    "attendance-attended"
                );
                element.textContent =
                    "Attended";
            } else if (
                status === "not-attended"
            ) {
                element.classList.add(
                    "attendance-absent"
                );
                element.textContent =
                    "Not attended";
            } else {
                element.classList.add(
                    "attendance-pending"
                );
                element.textContent =
                    "Pending";
            }
        }
    );
    /* =====================================================
       11. TICKET CARD CLICK
       ===================================================== */
    const clickableTickets =
        document.querySelectorAll(
            "[data-ticket-link]"
        );
    clickableTickets.forEach(
        function (ticket) {
            ticket.addEventListener(
                "click",
                function (event) {
                    /*
                     * Do not interfere with buttons
                     * or links inside the ticket.
                     */
                    if (
                        event.target.closest(
                            "button, a"
                        )
                    ) {
                        return;
                    }
                    const link =
                        ticket.dataset.ticketLink;
                    if (link) {
                        window.location.href =
                            link;
                    }
                }
            );
        }
    );
    /* =====================================================
       12. TICKET QR ZOOM
       ===================================================== */
    const qrZoomButtons =
        document.querySelectorAll(
            "[data-zoom-qr]"
        );
    qrZoomButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    const qr =
                        button.closest(
                            ".ticket-qr-wrapper"
                        )?.querySelector(
                            "img"
                        );
                    if (!qr) {
                        return;
                    }
                    openQrModal(
                        qr.src
                    );
                }
            );
        }
    );
    function openQrModal(
        qrSource
    ) {
        const existingModal =
            document.querySelector(
                ".qr-modal"
            );
        if (existingModal) {
            existingModal.remove();
        }
        const modal =
            document.createElement(
                "div"
            );
        modal.className =
            "qr-modal";
        modal.innerHTML = `
            <div class="qr-modal-overlay"></div>
            <div class="qr-modal-content">
                <button
                    type="button"
                    class="qr-modal-close"
                    aria-label="Close QR code"
                >
                    &times;
                </button>
                <img
                    src="${qrSource}"
                    alt="Ticket QR code"
                >
                <p>
                    Scan this QR code at the event.
                </p>
            </div>
        `;
        document.body.appendChild(
            modal
        );
        const closeButton =
            modal.querySelector(
                ".qr-modal-close"
            );
        const modalOverlay =
            modal.querySelector(
                ".qr-modal-overlay"
            );
        closeButton.addEventListener(
            "click",
            function () {
                modal.remove();
            }
        );
        modalOverlay.addEventListener(
            "click",
            function () {
                modal.remove();
            }
        );
    }
    /* =====================================================
       13. TICKET MODULE LOADED
       ===================================================== */
    console.log(
        "EventLink CM ticket module loaded successfully."
    );
});