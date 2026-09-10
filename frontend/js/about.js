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