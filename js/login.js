function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const message =
        document.getElementById("message");


    const savedUser =
        JSON.parse(
            localStorage.getItem("eventlinkUser")
        );


    if (
        savedUser &&
        savedUser.email === email &&
        savedUser.password === password
    ) {

        message.textContent =
            "Login successful!";


        setTimeout(function() {

            window.location.href =
                "events.html";

        }, 1000);

    }

    else {

        message.textContent =
            "Invalid email or password.";

    }

}