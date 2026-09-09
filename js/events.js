function toggleMenu() {

    const menu =
        document.getElementById("navMenu");

    if (menu.style.display === "flex") {

        menu.style.display = "none";

    } else {

        menu.style.display = "flex";

        menu.style.flexDirection = "column";

        menu.style.position = "absolute";

        menu.style.top = "75px";

        menu.style.right = "5%";

        menu.style.background = "#10003c";

        menu.style.padding = "15px";
    }
}


function filterEvents() {

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const category =
        document
        .getElementById("categoryFilter")
        .value;


    const events =
        document.querySelectorAll(".event-card");


    events.forEach(function(event) {

        const text =
            event.innerText.toLowerCase();

        const eventCategory =
            event.dataset.category;


        const matchesSearch =
            text.includes(search);

        const matchesCategory =
            category === "all" ||
            eventCategory === category;


        if (matchesSearch && matchesCategory) {

            event.style.display = "block";

        } else {

            event.style.display = "none";

        }

    });

}


function joinEvent(eventName) {

    alert(
        "You selected: " +
        eventName +
        "\n\nPlease login or register to continue."
    );

}