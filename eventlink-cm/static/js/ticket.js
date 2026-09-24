// ==========================================
// EventLink CM - Ticket JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Ticket Modal
    // ------------------------------------------

    const ticketButtons =
        document.querySelectorAll(".view-ticket-btn");

    const ticketModal =
        document.querySelector("#ticket-modal");

    const closeModal =
        document.querySelector("#close-ticket-modal");


    ticketButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (ticketModal) {

                ticketModal.classList.add("active");

            }

        });

    });


    if (closeModal && ticketModal) {

        closeModal.addEventListener("click", function () {

            ticketModal.classList.remove("active");

        });

    }


    // ------------------------------------------
    // Close modal when clicking outside
    // ------------------------------------------

    if (ticketModal) {

        ticketModal.addEventListener("click", function (event) {

            if (event.target === ticketModal) {

                ticketModal.classList.remove("active");

            }

        });

    }


    // ------------------------------------------
    // Print Ticket
    // ------------------------------------------

    const printButton =
        document.querySelector("#print-ticket");

    if (printButton) {

        printButton.addEventListener("click", function () {

            window.print();

        });

    }


    // ------------------------------------------
    // Download Ticket
    // ------------------------------------------

    const downloadButton =
        document.querySelector("#download-ticket");

    if (downloadButton) {

        downloadButton.addEventListener("click", function () {

            showNotification(
                "Ticket download will be available soon.",
                "info"
            );

        });

    }

});