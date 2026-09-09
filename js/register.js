function registerUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    const message =
        document.getElementById("message");


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    const user = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "eventlinkUser",
        JSON.stringify(user)
    );


    message.textContent =
        "Registration successful!";


    setTimeout(function() {

        window.location.href =
            "login.html";

    }, 1000);

}