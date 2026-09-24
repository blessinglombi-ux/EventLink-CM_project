// ==========================================
// EventLink CM - Dashboard JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Dashboard Sidebar
    // ------------------------------------------

    const sidebarToggle =
        document.querySelector("#sidebar-toggle");

    const sidebar =
        document.querySelector(".dashboard-sidebar");

    if (sidebarToggle && sidebar) {

        sidebarToggle.addEventListener("click", function () {

            sidebar.classList.toggle("active");

        });

    }


    // ------------------------------------------
    // Dashboard Sidebar Links
    // ------------------------------------------

    const sidebarLinks =
        document.querySelectorAll(".dashboard-sidebar a");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            sidebarLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    // ------------------------------------------
    // Delete Confirmation
    // ------------------------------------------

    const deleteButtons =
        document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            const confirmed = confirm(
                "Are you sure you want to delete this?"
            );

            if (!confirmed) {
                event.preventDefault();
            }

        });

    });


    // ------------------------------------------
    // Event Status
    // ------------------------------------------

    const statusElements =
        document.querySelectorAll("[data-progress]");

    statusElements.forEach(function (element) {

        const progress =
            parseInt(element.dataset.progress);

        if (!isNaN(progress)) {

            const progressBar =
                element.querySelector(".progress-bar");

            if (progressBar) {

                progressBar.style.width =
                    progress + "%";

            }

        }

    });

});