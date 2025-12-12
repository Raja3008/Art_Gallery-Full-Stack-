<script>
document.getElementById("loginButton").addEventListener("click", function() {
    // Load content from login.html into the loginPanel div
    fetch("login.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("loginPanel").innerHTML = html;
            document.getElementById("loginPanel").style.right = "0";
        })
        .catch(error => console.error("Error loading login.html:", error));
});

document.body.addEventListener("click", function(event) {
    if (event.target.closest("#loginPanel") === null && event.target.id !== "loginButton") {
        document.getElementById("loginPanel").style.right = "-300px";
    }
});
</script>

</body>
</html>