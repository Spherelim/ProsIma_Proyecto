const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "Public/CSS/navbar.css";
document.head.appendChild(link);


fetch("Public/components/navbar.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    })
    .catch(error => {
        console.error("Error loading navbar:", error);
    });

