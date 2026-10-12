document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOBILE MENU NAVIGATION
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('nav');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            const isOpen = navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open', isOpen);
            // Smooth scroll (Lenis, see motion.js) is paused while the menu covers the page
            if (isOpen) window.lenis?.stop();
            else window.lenis?.start();
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.classList.remove('nav-open');
                window.lenis?.start();
            });
        });
    }

    // ==========================================
    // HEADER SHADOW ON SCROLL
    // ==========================================
    const siteHeader = document.querySelector('header');
    if (siteHeader) {
        const updateHeaderState = () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 10);
        };
        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
    }

    // ==========================================
    // HERO CURSOR SPOTLIGHT
    // ==========================================
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.matchMedia('(hover: hover)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            heroSection.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            heroSection.style.setProperty('--my', `${e.clientY - rect.top}px`);
            heroSection.classList.add('spotlight-active');
        });
        heroSection.addEventListener('mouseleave', () => {
            heroSection.classList.remove('spotlight-active');
        });
    }

    // ==========================================
    // IMAGE LIGHTBOX (only runs if the page has a modal)
    // ==========================================
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImg = document.getElementById('zoomedImage');
        const closeModal = modal.querySelector('.close');
        const prevButton = modal.querySelector('.prev');
        const nextButton = modal.querySelector('.next');
        const images = document.querySelectorAll('.zoomable');
        let currentIndex = -1;

        function openModal(index) {
            currentIndex = index;
            modal.style.display = 'flex';
            modalImg.src = images[currentIndex].src;
            window.lenis?.stop();
        }

        function closeModalFunction() {
            modal.style.display = 'none';
            window.lenis?.start();
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            modalImg.src = images[currentIndex].src;
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            modalImg.src = images[currentIndex].src;
        }

        images.forEach((img, index) => {
            img.addEventListener('click', () => openModal(index));
        });

        closeModal.addEventListener('click', closeModalFunction);

        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showNextImage();
        });

        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showPrevImage();
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModalFunction();
            }
        });
    }

    // ==========================================
    // TYPEWRITER ANIMATION (HERO)
    // ==========================================
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = [
            "concepteur développeur web.", 
            "développeur Full Stack.", 
            "étudiant en Bachelor CDWFS.",
            "à la recherche d'une alternance."
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // faster deletion
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; // normal typing speed
            }

            // Word completed
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // pause before deletion
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }
        
        type();
    }

    // ==========================================
    // ACTIVE NAVIGATION LINKS ON SCROLL (SCROLL SPY)
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formsubmit.co/ajax/danbitton04@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: nameInput.value.trim(),
                        Email: emailInput.value.trim(),
                        Message: messageInput.value.trim()
                    })
                });

                if (response.ok) {
                    alert(`Merci ! Votre message a bien été envoyé. Dan vous répondra très bientôt.`);
                    contactForm.reset();
                } else {
                    throw new Error('Erreur de serveur');
                }
            } catch (error) {
                console.error(error);
                alert('Une erreur est survenue lors de l\'envoi. Veuillez utiliser directement l\'adresse email : danbitton04@gmail.com');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // GITHUB PROJECTS API DYNAMIC LOADING
    // ==========================================
    fetchGitHubProjects();
});

/**
 * Turns a raw repo slug (e.g. "projet-invitation") into a readable title
 * ("Projet Invitation") without touching existing capitalization/acronyms.
 */
function formatRepoName(name) {
    return name
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Fetches public repositories from GitHub and renders them dynamically
 */
async function fetchGitHubProjects() {
    const githubUsername = 'DanBttn';
    const gridContainer = document.getElementById('github-projects-grid');
    const loadingSpinner = document.getElementById('github-projects-loading');

    if (!gridContainer || !loadingSpinner) return;

    try {
        // Fetch repositories sorted by pushed date (so newest/recently updated repos appear first)
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=pushed&direction=desc&per_page=30`);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned status: ${response.status}`);
        }

        const repositories = await response.json();
        
        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        // Repos to keep out of the showcase even though they're public
        // (test/throwaway repos that aren't representative of real work)
        const hiddenRepos = ['bidon-'];

        // Filter: Only public, non-forked, and non-empty repositories, excluding the username profile repo
        const filteredRepos = repositories.filter(repo =>
            !repo.fork &&
            repo.name.toLowerCase() !== githubUsername.toLowerCase() &&
            repo.name !== 'danbttn' &&
            !hiddenRepos.includes(repo.name)
        );

        if (filteredRepos.length === 0) {
            gridContainer.innerHTML = '<p class="no-projects">Aucun dépôt public trouvé pour cet utilisateur.</p>';
            return;
        }

        // Keep the top 6 repositories for a clean layout
        const displayRepos = filteredRepos.slice(0, 6);
        gridContainer.innerHTML = ''; // Clear fallback text

        // Language colors mapping
        const languageColors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#3178c6',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'PHP': '#4f5d95',
            'Java': '#b07219',
            'Python': '#3572A5',
            'Shell': '#89e051',
            'C++': '#f34b7d',
            'C#': '#178600',
            'Ruby': '#701516',
            'Go': '#00ADD8'
        };

        displayRepos.forEach(repo => {
            // Format Last Updated Date
            const pushedDate = new Date(repo.pushed_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            // Language Badge
            const primaryLang = repo.language;
            const langDotColor = languageColors[primaryLang] || '#8b949e';
            const languageBadge = primaryLang ? `
                <span class="repo-lang">
                    <span class="lang-dot" style="background-color: ${langDotColor}"></span>
                    ${primaryLang}
                </span>
            ` : '<span class="repo-lang"><span class="lang-dot" style="background-color: #8b949e"></span>Néant</span>';

            // Card creation
            const card = document.createElement('div');
            card.className = 'project-card';

            const displayName = formatRepoName(repo.name);
            const descriptionHtml = repo.description
                ? `<p class="project-description">${repo.description}</p>`
                : '';

            card.innerHTML = `
                <div class="project-card-header">
                    <div class="project-card-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="project-icon" title="${repo.name}">${repo.name}</span>
                    <div class="project-stats">
                        <span class="stat-item" title="Stars">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-9.7-19.7-37.7-19.7-47.4 0L379.8 316.2l-253.9 36.9c-21.8 3.2-30.5 30-14.7 45.4l183.7 179.1-43.4 252.9c-3.7 21.7 19 38.2 38.5 28L512 739.9l222 116.8c19.5 10.2 42.2-6.3 38.5-28l-43.4-252.9 183.7-179.1c15.8-15.4 7.1-42.2-14.7-45.4zM512 654.5l-153.2 80.6 29.3-170.6-124-120.9 171.3-24.9 76.6-155.2 76.6 155.2 171.3 24.9-124 120.9 29.3 170.6L512 654.5z"></path></svg>
                            ${repo.stargazers_count}
                        </span>
                        <span class="stat-item" title="Forks">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
                            ${repo.forks_count}
                        </span>
                    </div>
                </div>
                <div class="project-card-body">
                    <h4 class="project-title">${displayName}</h4>
                    ${descriptionHtml}
                </div>
                <div class="project-card-footer">
                    ${languageBadge}
                    <span class="project-date">MàJ : ${pushedDate}</span>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link-btn">
                        Code source
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="project-link-btn demo">
                            Démo Live
                        </a>
                    ` : ''}
                </div>
            `;

            gridContainer.appendChild(card);
        });

        // Lets motion.js animate the freshly injected cards
        document.dispatchEvent(new CustomEvent('portfolio:content-added', {
            detail: { elements: gridContainer.children }
        }));

    } catch (error) {
        console.error('Error fetching repositories from GitHub:', error);
        gridContainer.innerHTML = '<p class="error-loading">Impossible de charger les dépôts GitHub pour le moment. Veuillez recharger la page ou réessayer ultérieurement.</p>';
        loadingSpinner.style.display = 'none';
    }
}
