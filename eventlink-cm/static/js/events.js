// ==========================================
// EventLink CM - Events JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // Event Search
    // ------------------------------------------

    const searchInput = document.querySelector("#event-search");

    const eventCards = document.querySelectorAll(".event-card");

    if (searchInput && eventCards.length > 0) {

        searchInput.addEventListener("input", function () {

            const searchText =
                searchInput.value.toLowerCase().trim();

            eventCards.forEach(function (card) {

                const cardText =
                    card.textContent.toLowerCase();

                if (cardText.includes(searchText)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }


    // ------------------------------------------
    // Category Filter
    // ------------------------------------------

    const categoryFilter =
        document.querySelector("#category-filter");

    if (categoryFilter && eventCards.length > 0) {

        categoryFilter.addEventListener("change", function () {

            const selectedCategory =
                categoryFilter.value.toLowerCase();

            eventCards.forEach(function (card) {

                const category =
                    card.dataset.category
                    ? card.dataset.category.toLowerCase()
                    : "";

                if (
                    selectedCategory === "" ||
                    category === selectedCategory
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }


    // ------------------------------------------
    // Clear Event Filters
    // ------------------------------------------

    const clearButton =
        document.querySelector("#clear-event-filters");

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            if (searchInput) {
                searchInput.value = "";
            }

            if (categoryFilter) {
                categoryFilter.value = "";
            }

            eventCards.forEach(function (card) {
                card.style.display = "";
            });

        });

    }


    // ------------------------------------------
    // Event Registration Confirmation
    // ------------------------------------------

    const registrationButtons =
        document.querySelectorAll(".register-event-btn");

    registrationButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            const confirmed = confirm(
                "Do you want to register for this event?"
            );

            if (!confirmed) {
                event.preventDefault();
            }

        });

    });

});