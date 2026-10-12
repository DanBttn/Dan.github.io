/**
 * Motion design du portfolio : défilement fluide (Lenis) + animations (GSAP / ScrollTrigger).
 * Chargé sur toutes les pages, avant index.js. Sans GSAP ou si l'utilisateur préfère
 * réduire les animations, le site reste entièrement lisible (voir staticFallback).
 */
(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;

    if (reducedMotion || !window.gsap || !window.ScrollTrigger) {
        staticFallback();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });
    root.classList.add('motion');

    const header = document.querySelector('header');
    const hero = document.querySelector('.hero-section');

    // ==========================================
    // LENIS (SMOOTH SCROLL) SYNCHRONISÉ AVEC GSAP
    // ==========================================
    let lenis = null;
    if (window.Lenis) {
        lenis = new Lenis({ lerp: 0.09, autoRaf: false });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        // Utilisé par index.js pour bloquer le scroll (menu mobile, lightbox)
        window.lenis = lenis;

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const id = decodeURIComponent(link.getAttribute('href').slice(1));
            const target = id ? document.getElementById(id) : null;
            if (id && !target) return;

            e.preventDefault();
            lenis.scrollTo(target || 0, {
                offset: target && header ? -header.offsetHeight + 1 : 0,
                duration: 1.3
            });
        });
    }

    // ==========================================
    // BARRE DE PROGRESSION
    // ==========================================
    gsap.to('#scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });

    // ==========================================
    // INTRO DU HERO
    // ==========================================
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });

    if (header) {
        intro.from(header, { yPercent: -100, duration: 0.9, clearProps: 'transform' }, 0);
    }

    if (hero) {
        const heroTitle = hero.querySelector('h1');
        const titleWords = heroTitle ? splitWords(heroTitle) : [];
        const codeBox = hero.querySelector('.code-box');
        const panel = hero.querySelector('.glass-card');

        if (codeBox) {
            // Page d'accueil : texte à gauche, fenêtre de code à droite
            const code = codeBox.querySelector('code');
            code.innerHTML = code.innerHTML
                .split('\n')
                .map((line) => `<span class="code-line">${line}</span>`)
                .join('');

            intro
                .from(hero.querySelector('.badge'), { autoAlpha: 0, y: 20, duration: 0.6 }, 0.1)
                .from(titleWords, { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.15)
                .from(hero.querySelectorAll('.hero-content h2, .hero-lead'), { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.5)
                .from(hero.querySelectorAll('.hero-actions .btn'), { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 }, 0.7)
                .from(codeBox, { autoAlpha: 0, y: 60, rotationY: -18, rotationX: 8, transformPerspective: 1000, duration: 1.3 }, 0.35)
                .from(codeBox.querySelectorAll('.code-line'), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.045, ease: 'power2.out' }, 0.8);

            // Parallaxe à la sortie du hero (uniquement quand les deux colonnes sont côte à côte)
            gsap.matchMedia().add('(min-width: 993px)', () => {
                const scrollTrigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
                gsap.to('.hero-content', { y: -70, opacity: 0.15, ease: 'none', scrollTrigger });
                gsap.to('.hero-graphic', { y: 90, ease: 'none', scrollTrigger });
            });
        } else if (panel) {
            // Pages projet : carte centrée
            intro
                .from(panel, { autoAlpha: 0, y: 50, scale: 0.96, duration: 1 }, 0.1)
                .from(titleWords, { yPercent: 115, duration: 1, stagger: 0.08 }, 0.3)
                .from([...panel.children].filter((child) => child !== heroTitle), { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, 0.45);
        }
    }

    // L'intro démarre une fois les polices prêtes (évite un saut de texte en pleine animation)
    root.classList.remove('motion-pending');
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 600))]).then(() => intro.play());

    // ==========================================
    // BANDEAU DÉFILANT RÉACTIF À LA VITESSE DE SCROLL
    // ==========================================
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const setX = gsap.quickSetter(marqueeTrack, 'x', 'px');
        const baseSpeed = 60; // px par seconde
        let loopWidth = marqueeTrack.scrollWidth / 2;
        let x = 0;
        let direction = -1;
        let boost = 0;
        let hovered = false;

        window.addEventListener('resize', () => { loopWidth = marqueeTrack.scrollWidth / 2; });
        marqueeTrack.parentElement.addEventListener('mouseenter', () => { hovered = true; });
        marqueeTrack.parentElement.addEventListener('mouseleave', () => { hovered = false; });

        gsap.ticker.add((time, deltaTime) => {
            const velocity = lenis ? lenis.velocity : 0;
            if (velocity) direction = velocity > 0 ? -1 : 1;
            boost += (Math.min(Math.abs(velocity) * 14, 900) - boost) * 0.1;

            if (hovered) return;
            x = gsap.utils.wrap(-loopWidth, 0, x + direction * (baseSpeed + boost) * (deltaTime / 1000));
            setX(x);
        });
    }

    // ==========================================
    // TITRES DE SECTION
    // ==========================================
    gsap.utils.toArray('.section-header').forEach((sectionHeader) => {
        const subtitle = sectionHeader.querySelector('.section-subtitle');
        const title = sectionHeader.querySelector('.section-title');
        const tl = gsap.timeline({ scrollTrigger: { trigger: sectionHeader, start: 'top 86%', once: true } });

        if (subtitle) tl.from(subtitle, { autoAlpha: 0, x: -24, duration: 0.7, ease: 'power3.out' }, 0);
        if (title) tl.from(splitWords(title), { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.06 }, 0.08);
    });

    // ==========================================
    // APPARITION DES BLOCS AU SCROLL
    // ==========================================
    reveal(gsap.utils.toArray('.card, .slide-in, .version-item, .demo-phone-item, .section-desc, .featured-project-container > h3, .github-header, .github-footer'));

    // Texte "À propos" qui s'éclaire au fil de la lecture
    const aboutInfo = document.querySelector('.about-info');
    if (aboutInfo) {
        const words = [];
        aboutInfo.querySelectorAll(':scope > p').forEach((paragraph) => words.push(...splitWords(paragraph, false)));
        gsap.fromTo(words, { opacity: 0.2 }, {
            opacity: 1,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: aboutInfo, start: 'top 75%', end: 'bottom 70%', scrub: true }
        });
    }

    // Barres de compétences + compteur
    gsap.utils.toArray('.skill-bar-item').forEach((item) => {
        const line = item.querySelector('.progress-line');
        const label = item.querySelector('.skill-percentage');
        const percent = parseFloat(line.dataset.percent);
        const counter = { value: 0 };

        label.textContent = '0%';
        gsap.timeline({ defaults: { duration: 1.6, ease: 'power3.out' }, scrollTrigger: { trigger: item, start: 'top 92%', once: true } })
            .to(line.querySelector('span'), { width: `${percent}%` }, 0)
            .to(counter, { value: percent, onUpdate: () => { label.textContent = `${Math.round(counter.value)}%`; } }, 0);
    });

    // Grilles de logos
    gsap.utils.toArray('.skills-icon-grid').forEach((grid) => {
        gsap.from(grid.children, {
            autoAlpha: 0,
            y: 24,
            scale: 0.85,
            duration: 0.6,
            ease: 'back.out(1.6)',
            stagger: 0.045,
            scrollTrigger: { trigger: grid, start: 'top 88%', once: true }
        });
    });

    // Parallaxe des visuels de projets vedettes
    gsap.utils.toArray('.featured-img-container img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
            yPercent: 7,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: { trigger: img.closest('.featured-img-container'), start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // Halos d'arrière-plan
    gsap.to('.blob-1', { y: 500, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.5 } });
    gsap.to('.blob-2', { y: -500, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.5 } });

    // ==========================================
    // INTERACTIONS AU SURVOL (SOURIS UNIQUEMENT)
    // ==========================================
    tilt(gsap.utils.toArray('.card, .glass-card, .version-item'));

    if (canHover) {
        gsap.utils.toArray('.btn').forEach((btn) => {
            btn.addEventListener('pointermove', (e) => {
                const rect = btn.getBoundingClientRect();
                gsap.to(btn, {
                    x: (e.clientX - rect.left - rect.width / 2) * 0.25,
                    y: (e.clientY - rect.top - rect.height / 2) * 0.35,
                    duration: 0.4,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            });
            btn.addEventListener('pointerleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
            });
        });
    }

    // ==========================================
    // CONTENU AJOUTÉ APRÈS COUP (CARTES GITHUB) & IMAGES LAZY
    // ==========================================
    document.addEventListener('portfolio:content-added', (e) => {
        const elements = [...e.detail.elements];
        reveal(elements);
        tilt(elements);
        ScrollTrigger.refresh();
    });

    const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        if (!img.complete) img.addEventListener('load', () => refresh.restart(true), { once: true });
    });
    window.addEventListener('load', () => refresh.restart(true));

    // ==========================================
    // HELPERS
    // ==========================================

    /**
     * Découpe le texte d'un élément en mots animables et renvoie ces mots.
     * masked = true : chaque mot est placé dans un masque (.w) pour un effet de
     * révélation par le bas, et les éléments enfants (ex : texte en dégradé) sont
     * gardés d'un bloc. masked = false : simples <span>, balises imbriquées conservées.
     */
    function splitWords(element, masked = true) {
        const words = [];
        const span = (className) => {
            const el = document.createElement('span');
            el.className = className;
            return el;
        };

        const walk = (parent) => {
            [...parent.childNodes].forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const fragment = document.createDocumentFragment();
                    node.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (!part.trim()) {
                            fragment.append(' ');
                            return;
                        }
                        const word = span(masked ? 'wi' : 'fw');
                        word.textContent = part;
                        words.push(word);
                        if (masked) {
                            const mask = span('w');
                            mask.append(word);
                            fragment.append(mask);
                        } else {
                            fragment.append(word);
                        }
                    });
                    node.replaceWith(fragment);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (masked) {
                        const mask = span('w');
                        node.replaceWith(mask);
                        mask.append(node);
                        node.classList.add('wi');
                        words.push(node);
                    } else {
                        walk(node);
                    }
                }
            });
        };

        walk(element);
        return words;
    }

    /** Fait apparaître les éléments par groupes à mesure qu'ils entrent dans l'écran. */
    function reveal(elements) {
        const targets = elements.filter((el) => !el.closest('.hero-section'));
        if (!targets.length) return;

        gsap.set(targets, { autoAlpha: 0, y: 48 });
        ScrollTrigger.batch(targets, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09 })
        });
    }

    /** Inclinaison 3D des cartes qui suit le curseur. */
    function tilt(elements) {
        if (!canHover) return;

        elements.forEach((el) => {
            gsap.set(el, { transformPerspective: 900 });
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                gsap.to(el, {
                    rotationX: ((e.clientY - rect.top) / rect.height - 0.5) * -5,
                    rotationY: ((e.clientX - rect.left) / rect.width - 0.5) * 5,
                    duration: 0.5,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            });
            el.addEventListener('pointerleave', () => {
                gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
            });
        });
    }

    /** Sans animations : on affiche simplement l'état final. */
    function staticFallback() {
        root.classList.remove('motion', 'motion-pending');

        document.querySelectorAll('.progress-line').forEach((line) => {
            const fill = line.querySelector('span');
            if (fill) fill.style.width = line.dataset.percent;
        });

        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const update = () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                scrollProgress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
            };
            update();
            window.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update);
        }
    }
})();
