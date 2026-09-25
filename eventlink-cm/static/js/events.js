/* =========================================================
   EVENTLINK CM
   Events JavaScript
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. EVENT SEARCH
       ===================================================== */
    const searchInput =
        document.querySelector(
            "#event-search, .event-search input"
        );
    const eventCards =
        document.querySelectorAll(
            "[data-event-card]"
        );
    if (searchInput && eventCards.length > 0) {
        searchInput.addEventListener(
            "input",
            function () {
                const search =
                    searchInput.value
                        .trim()
                        .toLowerCase();
                eventCards.forEach(
                    function (card) {
                        const searchableText =
                            card.textContent
                                .toLowerCase();
                        if (
                            searchableText.includes(
                                search
                            )
                        ) {
                            card.style.display = "";
                        } else {
                            card.style.display = "none";
                        }
                    }
                );
                updateEmptySearchMessage();
            }
        );
    }
    /* =====================================================
       2. CATEGORY FILTER
       ===================================================== */
    const categoryButtons =
        document.querySelectorAll(
            ".category-filter"
        );
    categoryButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    categoryButtons.forEach(
                        function (item) {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );
                    button.classList.add(
                        "active"
                    );
                    const category =
                        button.dataset.category;
                    filterEventsByCategory(
                        category
                    );
                }
            );
        }
    );
    function filterEventsByCategory(category) {
        eventCards.forEach(
            function (card) {
                if (
                    !category ||
                    category === "all"
                ) {
                    card.style.display = "";
                    return;
                }
                const cardCategory =
                    (
                        card.dataset.category ||
                        ""
                    ).toLowerCase();
                if (
                    cardCategory ===
                    category.toLowerCase()
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        );
        updateEmptySearchMessage();
    }
    /* =====================================================
       3. SEARCH + CATEGORY EMPTY MESSAGE
       ===================================================== */
    function updateEmptySearchMessage() {
        const visibleCards =
            Array.from(eventCards)
                .filter(
                    function (card) {
                        return (
                            card.style.display !==
                            "none"
                        );
                    }
                );
        const emptyMessage =
            document.querySelector(
                ".events-empty-search"
            );
        if (!emptyMessage) {
            return;
        }
        if (
            visibleCards.length === 0
        ) {
            emptyMessage.style.display =
                "block";
        } else {
            emptyMessage.style.display =
                "none";
        }
    }
    /* =====================================================
       4. EVENT SORTING
       ===================================================== */
    const sortSelect =
        document.querySelector(
            "#event-sort, .event-sort select"
        );
    const eventGrid =
        document.querySelector(
            ".events-page-grid"
        );
    if (
        sortSelect &&
        eventGrid &&
        eventCards.length > 1
    ) {
        sortSelect.addEventListener(
            "change",
            function () {
                const cards =
                    Array.from(
                        eventGrid.querySelectorAll(
                            "[data-event-card]"
                        )
                    );
                const sortValue =
                    sortSelect.value;
                cards.sort(
                    function (a, b) {
                        if (
                            sortValue ===
                            "name"
                        ) {
                            return getEventName(a)
                                .localeCompare(
                                    getEventName(b)
                                );
                        }
                        if (
                            sortValue ===
                            "date"
                        ) {
                            return (
                                getEventDate(a) -
                                getEventDate(b)
                            );
                        }
                        if (
                            sortValue ===
                            "latest"
                        ) {
                            return (
                                getEventDate(b) -
                                getEventDate(a)
                            );
                        }
                        return 0;
                    }
                );
                cards.forEach(
                    function (card) {
                        eventGrid.appendChild(
                            card
                        );
                    }
                );
            }
        );
    }
    function getEventName(card) {
        const title =
            card.querySelector(
                "[data-event-name], h2, h3"
            );
        return title
            ? title.textContent.trim()
            : "";
    }
    function getEventDate(card) {
        const dateElement =
            card.querySelector(
                "[data-event-date]"
            );
        if (!dateElement) {
            return 0;
        }
        const date =
            new Date(
                dateElement.dataset.eventDate ||
                dateElement.textContent
            );
        return isNaN(date.getTime())
            ? 0
            : date.getTime();
    }
    /* =====================================================
       5. EVENT IMAGE PREVIEW
       ===================================================== */
    const eventImageInput =
        document.querySelector(
            "#event-image, input[name='image']"
        );
    const eventImagePreview =
        document.querySelector(
            "#event-image-preview"
        );
    if (
        eventImageInput &&
        eventImagePreview
    ) {
        eventImageInput.addEventListener(
            "change",
            function () {
                const file =
                    eventImageInput.files[0];
                if (!file) {
                    return;
                }
                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {
                    alert(
                        "Please select a valid image."
                    );
                    eventImageInput.value = "";
                    return;
                }
                const reader =
                    new FileReader();
                reader.onload =
                    function (event) {
                        eventImagePreview.src =
                            event.target.result;
                        eventImagePreview.style.display =
                            "block";
                    };
                reader.readAsDataURL(file);
            }
        );
    }
    /* =====================================================
       6. EVENT DESCRIPTION COUNTER
       ===================================================== */
    const description =
        document.querySelector(
            "#description, textarea[name='description']"
        );
    const descriptionCounter =
        document.querySelector(
            "#description-counter"
        );
    if (
        description &&
        descriptionCounter
    ) {
        function updateDescriptionCounter() {
            const max =
                description.maxLength;
            const current =
                description.value.length;
            if (max > 0) {
                descriptionCounter.textContent =
                    `${current}/${max}`;
            } else {
                descriptionCounter.textContent =
                    `${current} characters`;
            }
        }
        description.addEventListener(
            "input",
            updateDescriptionCounter
        );
        updateDescriptionCounter();
    }
    /* =====================================================
       7. CREATE EVENT FORM
       ===================================================== */
    const createEventForm =
        document.querySelector(
            "#create-event-form"
        );
    if (createEventForm) {
        createEventForm.addEventListener(
            "submit",
            function (event) {
                if (
                    !validateEventForm(
                        createEventForm
                    )
                ) {
                    event.preventDefault();
                }
            }
        );
    }
    /* =====================================================
       8. EDIT EVENT FORM
       ===================================================== */
    const editEventForm =
        document.querySelector(
            "#edit-event-form"
        );
    if (editEventForm) {
        editEventForm.addEventListener(
            "submit",
            function (event) {
                if (
                    !validateEventForm(
                        editEventForm
                    )
                ) {
                    event.preventDefault();
                }
            }
        );
    }
    function validateEventForm(form) {
        let valid = true;
        const title =
            form.querySelector(
                "input[name='title']"
            );
        const date =
            form.querySelector(
                "input[name='date']"
            );
        const location =
            form.querySelector(
                "input[name='location']"
            );
        const slots =
            form.querySelector(
                "input[name='slots']"
            );
        if (
            title &&
            !title.value.trim()
        ) {
            showEventError(
                title,
                "Event title is required."
            );
            valid = false;
        }
        if (
            date &&
            !date.value
        ) {
            showEventError(
                date,
                "Please select the event date."
            );
            valid = false;
        }
        if (
            location &&
            !location.value.trim()
        ) {
            showEventError(
                location,
                "Event location is required."
            );
            valid = false;
        }
        if (
            slots &&
            (
                !slots.value ||
                Number(slots.value) < 1
            )
        ) {
            showEventError(
                slots,
                "Registration slots must be at least 1."
            );
            valid = false;
        }
        return valid;
    }
    function showEventError(
        input,
        message
    ) {
        input.classList.add(
            "input-error"
        );
        let error =
            input.parentElement
                ?.querySelector(
                    ".event-field-error"
                );
        if (!error) {
            error =
                document.createElement(
                    "small"
                );
            error.className =
                "event-field-error";
            input.parentElement?.appendChild(
                error
            );
        }
        error.textContent =
            message;
    }
    /* =====================================================
       9. DELETE EVENT CONFIRMATION
       ===================================================== */
    const deleteButtons =
        document.querySelectorAll(
            "[data-delete-event]"
        );
    deleteButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function (event) {
                    const confirmed =
                        window.confirm(
                            "Are you sure you want to delete this event?"
                        );
                    if (!confirmed) {
                        event.preventDefault();
                    }
                }
            );
        }
    );
    /* =====================================================
       10. LAUNCH EVENT CONFIRMATION
       ===================================================== */
    const launchButtons =
        document.querySelectorAll(
            "[data-launch-event]"
        );
    launchButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function (event) {
                    const confirmed =
                        window.confirm(
                            "Launch this event? Participants will be able to see it."
                        );
                    if (!confirmed) {
                        event.preventDefault();
                    }
                }
            );
        }
    );
    /* =====================================================
       11. REGISTER FOR EVENT
       ===================================================== */
    const registrationButtons =
        document.querySelectorAll(
            "[data-register-event]"
        );
    registrationButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    if (
                        button.disabled
                    ) {
                        return;
                    }
                    button.disabled = true;
                    const originalText =
                        button.textContent;
                    button.textContent =
                        "Registering...";
                    /*
                     * The actual registration is
                     * handled by Django.
                     */
                    setTimeout(
                        function () {
                            /*
                             * If Django returns
                             * successfully, the page
                             * can display the success
                             * message.
                             */
                            button.disabled =
                                false;
                            button.textContent =
                                originalText;
                        },
                        3000
                    );
                }
            );
        }
    );
    /* =====================================================
       12. CANCEL REGISTRATION
       ===================================================== */
    const cancelButtons =
        document.querySelectorAll(
            "[data-cancel-registration]"
        );
    cancelButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function (event) {
                    const confirmed =
                        window.confirm(
                            "Are you sure you want to cancel this registration?"
                        );
                    if (!confirmed) {
                        event.preventDefault();
                    }
                }
            );
        }
    );
    /* =====================================================
       13. DATE MINIMUM
       ===================================================== */
    const dateInputs =
        document.querySelectorAll(
            "input[type='date'][data-future-date]"
        );
    dateInputs.forEach(
        function (input) {
            const today =
                new Date();
            const year =
                today.getFullYear();
            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");
            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");
            input.min =
                `${year}-${month}-${day}`;
        }
    );
    /* =====================================================
       14. EVENT CAPACITY
       ===================================================== */
    const capacityInputs =
        document.querySelectorAll(
            "input[name='slots']"
        );
    capacityInputs.forEach(
        function (input) {
            input.addEventListener(
                "input",
                function () {
                    if (
                        Number(input.value) < 1
                    ) {
                        input.value = 1;
                    }
                }
            );
        }
    );
    /* =====================================================
       15. EVENT COUNTDOWN
       ===================================================== */
    const countdowns =
        document.querySelectorAll(
            "[data-event-countdown]"
        );
    countdowns.forEach(
        function (element) {
            const eventDate =
                new Date(
                    element.dataset.eventCountdown
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
                const seconds =
                    Math.floor(
                        (
                            difference /
                            1000
                        ) % 60
                    );
                element.textContent =
                    `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
            updateCountdown();
            setInterval(
                updateCountdown,
                1000
            );
        }
    );
    /* =====================================================
       16. EVENTLINK MESSAGE
       ===================================================== */
    console.log(
        "EventLink CM events module loaded successfully."
    );
});