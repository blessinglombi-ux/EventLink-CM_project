/* =========================================================
   EVENTLINK CM
   QR CODE SCANNER
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. ELEMENTS
       ===================================================== */
    const scannerContainer =
        document.querySelector(
            "#qr-scanner"
        );
    const video =
        document.querySelector(
            "#qr-video"
        );
    const startButton =
        document.querySelector(
            "[data-start-scanner]"
        );
    const stopButton =
        document.querySelector(
            "[data-stop-scanner]"
        );
    const resultContainer =
        document.querySelector(
            "#scan-result"
        );
    const resultMessage =
        document.querySelector(
            "#scan-result-message"
        );
    const scannerStatus =
        document.querySelector(
            "#scanner-status"
        );
    /*
     * If the current page does not contain
     * a scanner, there is nothing to do.
     */
    if (!scannerContainer && !video) {
        return;
    }
    /* =====================================================
       2. VARIABLES
       ===================================================== */
    let stream = null;
    let scanning = false;
    let animationFrame = null;
    let lastScannedValue = "";
    let lastScanTime = 0;
    /* =====================================================
       3. START SCANNER
       ===================================================== */
    async function startScanner() {
        if (scanning) {
            return;
        }
        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            showResult(
                "error",
                "Camera access is not supported by this browser."
            );
            return;
        }
        try {
            stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        video: {
                            facingMode: {
                                ideal: "environment"
                            }
                        },
                        audio: false
                    }
                );
            if (video) {
                video.srcObject =
                    stream;
                video.setAttribute(
                    "playsinline",
                    "true"
                );
                await video.play();
            }
            scanning = true;
            updateScannerUI();
            scanFrame();
        } catch (error) {
            console.error(
                "Camera error:",
                error
            );
            showResult(
                "error",
                getCameraErrorMessage(
                    error
                )
            );
        }
    }
    /* =====================================================
       4. STOP SCANNER
       ===================================================== */
    function stopScanner() {
        scanning = false;
        if (animationFrame) {
            cancelAnimationFrame(
                animationFrame
            );
            animationFrame = null;
        }
        if (stream) {
            stream
                .getTracks()
                .forEach(
                    function (track) {
                        track.stop();
                    }
                );
            stream = null;
        }
        if (video) {
            video.srcObject = null;
        }
        updateScannerUI();
    }
    /* =====================================================
       5. CAMERA ERROR MESSAGE
       ===================================================== */
    function getCameraErrorMessage(
        error
    ) {
        if (!error) {
            return "Unable to access the camera.";
        }
        if (
            error.name ===
            "NotAllowedError"
        ) {
            return (
                "Camera permission was denied. " +
                "Please allow camera access and try again."
            );
        }
        if (
            error.name ===
            "NotFoundError"
        ) {
            return (
                "No camera was found on this device."
            );
        }
        if (
            error.name ===
            "NotReadableError"
        ) {
            return (
                "The camera is currently being used by another application."
            );
        }
        return (
            "Unable to access the camera. Please try again."
        );
    }
    /* =====================================================
       6. UPDATE UI
       ===================================================== */
    function updateScannerUI() {
        if (startButton) {
            startButton.disabled =
                scanning;
        }
        if (stopButton) {
            stopButton.disabled =
                !scanning;
        }
        if (scannerStatus) {
            scannerStatus.textContent =
                scanning
                    ? "Scanner is active. Point the camera at a ticket QR code."
                    : "Scanner is stopped.";
        }
        if (scannerContainer) {
            scannerContainer.classList.toggle(
                "scanning",
                scanning
            );
        }
    }
    /* =====================================================
       7. SCAN FRAME
       ===================================================== */
    function scanFrame() {
        if (!scanning || !video) {
            return;
        }
        /*
         * BarcodeDetector is supported by many
         * modern browsers. If it is unavailable,
         * we display an appropriate message.
         */
        if (
            !("BarcodeDetector" in window)
        ) {
            showResult(
                "error",
                "QR scanning is not supported by this browser. Please use a supported browser."
            );
            stopScanner();
            return;
        }
        detectQrCode();
    }
    /* =====================================================
       8. DETECT QR CODE
       ===================================================== */
    async function detectQrCode() {
        if (
            !scanning ||
            !video ||
            video.readyState <
            HTMLMediaElement.HAVE_ENOUGH_DATA
        ) {
            animationFrame =
                requestAnimationFrame(
                    scanFrame
                );
            return;
        }
        try {
            const detector =
                new BarcodeDetector(
                    {
                        formats: ["qr_code"]
                    }
                );
            const codes =
                await detector.detect(
                    video
                );
            if (
                codes &&
                codes.length > 0
            ) {
                const value =
                    codes[0].rawValue;
                if (value) {
                    handleQrResult(
                        value
                    );
                    return;
                }
            }
        } catch (error) {
            console.error(
                "QR detection error:",
                error
            );
        }
        animationFrame =
            requestAnimationFrame(
                scanFrame
            );
    }
    /* =====================================================
       9. HANDLE QR RESULT
       ===================================================== */
    function handleQrResult(
        value
    ) {
        const now =
            Date.now();
        /*
         * Prevent the same QR code from
         * being processed repeatedly.
         */
        if (
            value === lastScannedValue &&
            now - lastScanTime < 3000
        ) {
            animationFrame =
                requestAnimationFrame(
                    scanFrame
                );
            return;
        }
        lastScannedValue =
            value;
        lastScanTime =
            now;
        showResult(
            "success",
            "QR code detected successfully."
        );
        /*
         * Send the scanned ticket information
         * to Django.
         */
        submitScannedTicket(
            value
        );
    }
    /* =====================================================
       10. SEND QR TO DJANGO
       ===================================================== */
    async function submitScannedTicket(
        qrValue
    ) {
        /*
         * The backend URL can be supplied
         * directly in the HTML:
         *
         * data-scan-url="/api/scan-ticket/"
         */
        const scanUrl =
            scannerContainer?.dataset.scanUrl ||
            "/api/scan-ticket/";
        const csrfToken =
            getCsrfToken();
        try {
            const response =
                await fetch(
                    scanUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            ...(csrfToken
                                ? {
                                    "X-CSRFToken":
                                        csrfToken
                                }
                                : {})
                        },
                        body:
                            JSON.stringify(
                                {
                                    qr_code:
                                        qrValue
                                }
                            )
                    }
                );
            const data =
                await response.json();
            if (response.ok) {
                showResult(
                    "success",
                    data.message ||
                    "Ticket verified successfully."
                );
                /*
                 * Stop the scanner after
                 * successful verification.
                 */
                stopScanner();
            } else {
                showResult(
                    "error",
                    data.message ||
                    "This ticket could not be verified."
                );
            }
        } catch (error) {
            console.error(
                "Ticket verification error:",
                error
            );
            showResult(
                "error",
                "Could not connect to the server. Please try again."
            );
        }
    }
    /* =====================================================
       11. DISPLAY RESULT
       ===================================================== */
    function showResult(
        type,
        message
    ) {
        if (resultContainer) {
            resultContainer.classList.remove(
                "success",
                "error"
            );
            resultContainer.classList.add(
                type
            );
            resultContainer.style.display =
                "block";
        }
        if (resultMessage) {
            resultMessage.textContent =
                message;
        }
    }
    /* =====================================================
       12. CSRF TOKEN
       ===================================================== */
    function getCsrfToken() {
        const csrfInput =
            document.querySelector(
                "[name=csrfmiddlewaretoken]"
            );
        if (csrfInput) {
            return csrfInput.value;
        }
        const cookies =
            document.cookie.split(";");
        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {
            const cookie =
                cookies[i].trim();
            if (
                cookie.startsWith(
                    "csrftoken="
                )
            ) {
                return decodeURIComponent(
                    cookie.substring(
                        "csrftoken=".length
                    )
                );
            }
        }
        return "";
    }
    /* =====================================================
       13. BUTTON EVENTS
       ===================================================== */
    if (startButton) {
        startButton.addEventListener(
            "click",
            function () {
                startScanner();
            }
        );
    }
    if (stopButton) {
        stopButton.addEventListener(
            "click",
            function () {
                stopScanner();
            }
        );
    }
    /* =====================================================
       14. PAGE EXIT
       ===================================================== */
    window.addEventListener(
        "beforeunload",
        function () {
            stopScanner();
        }
    );
    /* =====================================================
       15. INITIAL UI
       ===================================================== */
    updateScannerUI();
    /* =====================================================
       16. MODULE LOADED
       ===================================================== */
    console.log(
        "EventLink CM QR scanner loaded successfully."
    );
});