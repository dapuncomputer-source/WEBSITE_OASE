const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginError = document.getElementById("loginError");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();


    if (
        usernameValue === "admin" &&
        passwordValue === "oase123"
    ) {

        localStorage.setItem("adminLogin", "true");

        window.location.href = "admin.html";

    } else {

        loginError.textContent =
            "Username atau password salah.";

        loginError.classList.add("show");
    }

});