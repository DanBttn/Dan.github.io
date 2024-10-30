document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();  // Empêche l'envoi réel du formulaire
    alert('Merci pour votre message, Dan vous répondra bientôt.');
});
// Sélectionne tous les éléments avec la classe .slide-in
document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelectorAll('.slide-in');

    // Utilise IntersectionObserver pour observer quand les éléments entrent dans le viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe 'active' pour déclencher l'animation
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Arrête d'observer l'élément une fois qu'il est visible
            }
        });
    });

    // Applique l'observateur à chaque compétence
    skills.forEach(skill => {
        observer.observe(skill);
    });
});
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

