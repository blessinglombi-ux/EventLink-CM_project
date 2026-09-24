// ==========================================
// EventLink CM - QR Scanner JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const scannerButton =
        document.querySelector("#start-scanner");

    const scannerArea =
        document.querySelector("#qr-scanner-area");

    const stopButton =
        document.querySelector("#stop-scanner");


    // ------------------------------------------
    // Start Scanner
    // ------------------------------------------

    if (scannerButton) {

        scannerButton.addEventListener("click", function () {

            if (scannerArea) {

                scannerArea.style.display = "block";

            }

            showNotification(
                "QR scanner is ready.",
                "info"
            );

        });

    }


    // ------------------------------------------
    // Stop Scanner
    // ------------------------------------------

    if (stopButton) {

        stopButton.addEventListener("click", function () {

            if (scannerArea) {

                scannerArea.style.display = "none";

            }

        });

    }

});


// ==========================================
// Process Scanned Ticket
// ==========================================

function processQRCode(ticketCode) {

    if (!ticketCode) {

        showNotification(
            "No ticket code was detected.",
            "error"
        );

        return;

    }

    console.log("Scanned ticket:", ticketCode);

    showNotification(
        "Ticket scanned successfully.",
        "success"
    );

    /*
        Later this will send the ticket code
        to the Django backend.

        Example:

        fetch("/api/check-in/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ticket_code: ticketCode
            })
        });
    */
}