// JavaScript pour surbrillance du lien actif et défilement fluide

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    // Ajouter un écouteur d'événements à chaque lien de la navbar
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            // Ajouter la classe active pour le lien en cours
            navLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");

            // Défilement fluide vers la section cible
            targetSection.scrollIntoView({ behavior: "smooth" });
        });
    });
});
