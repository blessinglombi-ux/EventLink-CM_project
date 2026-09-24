// ==========================================
// EventLink CM - Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Mobile Navigation
    // ------------------------------------------

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            navigation.classList.toggle("active");
        });
    }


    // ------------------------------------------
    // Close mobile menu after clicking a link
    // ------------------------------------------

    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navigation) {
                navigation.classList.remove("active");
            }
        });
    });


    // ------------------------------------------
    // Current Year
    // ------------------------------------------

    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // ------------------------------------------
    // Auto-hide Django messages
    // ------------------------------------------

    const messages = document.querySelectorAll(".alert");

    messages.forEach(function (message) {

        setTimeout(function () {
            message.style.opacity = "0";

            setTimeout(function () {
                message.remove();
            }, 500);

        }, 5000);

    });


    // ------------------------------------------
    // Confirm buttons
    // ------------------------------------------

    const confirmButtons = document.querySelectorAll("[data-confirm]");

    confirmButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            const message = button.getAttribute("data-confirm");

            if (!confirm(message)) {
                event.preventDefault();
            }

        });

    });

});


// ==========================================
// Show Notification
// ==========================================

function showNotification(message, type = "success") {

    const notification = document.createElement("div");

    notification.className = "custom-notification " + type;

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.classList.add("show");
    }, 10);

    setTimeout(function () {

        notification.classList.remove("show");

        setTimeout(function () {
            notification.remove();
        }, 300);

    }, 3000);
}


// ==========================================
// Simple Loading Button
// ==========================================

function showLoading(button, text = "Please wait...") {

    if (!button) {
        return;
    }

    button.dataset.originalText = button.innerHTML;

    button.innerHTML = text;

    button.disabled = true;
}


function hideLoading(button) {

    if (!button) {
        return;
    }

    button.innerHTML = button.dataset.originalText || "Submit";

    button.disabled = false;
}