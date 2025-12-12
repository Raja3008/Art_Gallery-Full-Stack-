const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function validateLogin() {
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPsw').value;

    // Login validation here
    // This example checks if both fields are non-empty
    if (email.trim() === '' || password.trim() === '') {
        alert("Please enter both email and password");
        return false;
    }

    // If validation passes, redirect to fs.html
    window.location.href = "fs.html";
    return false;
}

function validateSignup() {
    var name = document.getElementById('signupName').value;
    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPsw').value;

    // Signup validation here
    // This example checks if all fields are non-empty
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
        alert("Please fill in all fields");
        return false;
    }

    // If validation passes, redirect to fs.html
    window.location.href = "fs.html";
    return false;
}
