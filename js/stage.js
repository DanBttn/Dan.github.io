document.addEventListener("DOMContentLoaded", () => {
    // === SMOOTH SCROLL POUR LA NAVIGATION ===
    const navLinks = document.querySelectorAll("nav ul li a");
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;

    // Ajouter un écouteur d'événements à chaque lien de la navbar
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            const href = this.getAttribute("href");
            
            // Vérifier si c'est un lien interne (commence par #)
            if (href && href.startsWith("#")) {
                event.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    // Ajouter la classe active pour le lien en cours
                    navLinks.forEach(link => link.classList.remove("active"));
                    this.classList.add("active");

                    // Défilement fluide vers la section cible
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // === EFFET SLIDE-IN POUR LE DÉFILEMENT ===
    const slideElements = document.querySelectorAll('.slide-in');

    // Utilise IntersectionObserver pour observer quand les éléments entrent dans le viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe 'active' pour déclencher l'animation
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Arrête d'observer l'élément une fois qu'il est visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Applique l'observateur à chaque élément
    slideElements.forEach(element => {
        observer.observe(element);
    });
});


