document.addEventListener("DOMContentLoaded", function () {
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

    // === MODAL POUR LES IMAGES ===
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("zoomedImage");
    const closeModal = document.querySelector(".close");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");


    // Get all images with the class 'zoomable'
    const images = document.querySelectorAll(".zoomable");
    let currentIndex = -1;

    // Open modal and set the current image
    function openModal(index) {
        currentIndex = index;
        modal.style.display = "flex";
        modalImg.src = images[currentIndex].src;
    }

    // Close modal
    function closeModalFunction() {
        modal.style.display = "none";
    }

    // Show next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    // Show previous image
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    // Add click event to each image to open modal with that image
    images.forEach((img, index) => {
        img.addEventListener("click", () => openModal(index));
    });

    // Close modal on close button click
    closeModal.addEventListener("click", closeModalFunction);

    // Navigate to next image on 'Next' button click
    nextButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showNextImage();
    });

    // Navigate to previous image on 'Prev' button click
    prevButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showPrevImage();
    });

    // Close modal if clicked outside the image
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalFunction();
        }
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
    });

    // Applique l'observateur à chaque élément
    slideElements.forEach(element => {
        observer.observe(element);
    });
});

