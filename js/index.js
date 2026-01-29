document.addEventListener('DOMContentLoaded', () => {
    // === SMOOTH SCROLL POUR LA NAVIGATION ===
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
    });

    // Applique l'observateur à chaque élément
    slideElements.forEach(element => {
        observer.observe(element);
    });

    // === ANIMATION DES COMPÉTENCES (si présentes) ===
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        // Utiliser un délai pour l'animation afin qu'elle ne se déclenche pas en même temps
        setTimeout(() => {
            skill.classList.add('slide-in');
        }, index * 150); // Délai croissant pour chaque élément
    });
});

// === GESTION DU FORMULAIRE (si présent) ===
window.addEventListener('load', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();  // Empêche l'envoi réel du formulaire
            alert('Merci pour votre message, Dan vous répondra bientôt.');
        });
    }
});

