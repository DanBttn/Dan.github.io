document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("zoomedImage");
    const closeModal = document.querySelector(".close");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    // Get all images with the class 'zoomable'
    const images = document.querySelectorAll(".zoomable");
    let currentIndex = 0;

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
});
