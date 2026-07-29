// ================================================================
// GALLERY DATA
// ----------------------------------------------------------------
// 1. Drop your photos into the images/ folder.
// 2. Uncomment lines below and update the filenames + captions.
// 3. Add as many { src, caption } entries as you like per project.
// ================================================================
const galleries = {
    'ecocar-lyriq': {
        title: 'SRM Powertrain Integration — Cadillac LYRIQ',
        images: [
            { src: 'images/ecocar-1.jpg', caption: 'SRM drive unit mounted in rear subframe' },
            { src: 'images/ecocar-2.jpg', caption: 'Full team at Year 4 EcoCAR EV Challenge competition' },
            { src: 'images/ecocar-3.jpg', caption: 'Me while testing the LYRIQ at Toronto Motorsports Park' },
        ]
    },
    'calibration': {
        title: 'EcoCAR Powertrain Calibration',
        images: [
            { src: 'images/cal-1.jpg', caption: 'AVL DRIVE scores in YEAR 3' },
            { src: 'images/cal-2.jpg', caption: 'AVL DRIVE scores in YEAR 4' },
            { src: 'images/cal-3.jpg', caption: 'Data collection at California Air Resources Board AVL Dyno' },
        ]
    },
    'hybrid-study': {
        title: 'Series Hybrid Engine Sizing Study',
        images: [
            { src: 'images/hybrid-1.jpg', caption: 'Modified input power to battery outside of original motor and battery subsystems.' },
            { src: 'images/hybrid-2.jpg', caption: 'Current direction comparison between hybrid Spark, vs. fully electric Spark EV' },
        ]
    },
    'parking-vehicle': {
        title: 'Autonomous Self-Parking Vehicle',
        images: [
            { src: 'images/parking-1.jpg', caption: 'Example of front-in parking logic' },
            // { src: 'images/parking-2.jpg', caption: 'Sensor array and Arduino wiring' },
        ]
    }
};

// ================================================================
// NAV — add border after scrolling past hero
// ================================================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ================================================================
// ACTIVE NAV LINK on scroll
// ================================================================
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link =>
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        );
    });
}, { rootMargin: '-35% 0px -65% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ================================================================
// REVEAL ANIMATION on scroll
// ================================================================
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll(
    '.timeline-item, .project-card, .skill-group, .stat-card, .edu-card, .hobby-card'
).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 55}ms`;
    revealObserver.observe(el);
});

// ================================================================
// PHOTO SLOTS — reveal image once it loads, keep placeholder hidden
// ================================================================
document.querySelectorAll('.photo-slot img').forEach(img => {
    const show = () => { if (img.naturalWidth > 0) img.classList.add('loaded'); };
    img.complete ? show() : img.addEventListener('load', show);
});

// ================================================================
// CONFETTI — pops on the "2nd place overall" result
// Fires once when it scrolls into view, then again on hover/focus.
// EDIT: tweak COUNT / COLORS / GRAVITY below to taste.
// ================================================================
const CONFETTI = {
    COUNT:    46,
    COLORS:   ['#e55300', '#ff8c42', '#ffb27a', '#c9c9c9', '#ffffff'],
    GRAVITY:  0.30,
    DRAG:     0.985,
    FADE:     0.011,   // higher = shorter lifespan
    COOLDOWN: 600      // ms between bursts, stops hover spam
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastBurst = 0;

function fireConfetti(originEl) {
    if (reduceMotion) return;

    const now = Date.now();
    if (now - lastBurst < CONFETTI.COOLDOWN) return;
    lastBurst = now;

    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // Single throwaway layer per burst, removed when the last piece dies
    const layer = document.createElement('div');
    layer.style.cssText =
        'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;';
    document.body.appendChild(layer);

    const pieces = [];
    for (let i = 0; i < CONFETTI.COUNT; i++) {
        const el = document.createElement('div');
        const w = 5 + Math.random() * 5;
        el.style.cssText =
            `position:absolute;top:0;left:0;width:${w}px;height:${w * 0.55}px;` +
            `background:${CONFETTI.COLORS[i % CONFETTI.COLORS.length]};` +
            `will-change:transform,opacity;`;
        layer.appendChild(el);

        // Fan upward and out from the word
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
        const speed = 5 + Math.random() * 7;

        pieces.push({
            el,
            x:  originX,
            y:  originY,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
            vy: Math.sin(angle) * speed,
            rot: Math.random() * 360,
            vr:  (Math.random() - 0.5) * 22,
            life: 1
        });
    }

    (function tick() {
        let alive = false;

        for (const p of pieces) {
            if (p.life <= 0) continue;

            p.vy  += CONFETTI.GRAVITY;
            p.vx  *= CONFETTI.DRAG;
            p.x   += p.vx;
            p.y   += p.vy;
            p.rot += p.vr;
            p.life -= CONFETTI.FADE;

            p.el.style.transform =
                `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
            p.el.style.opacity = Math.max(0, p.life);
            alive = true;
        }

        alive ? requestAnimationFrame(tick) : layer.remove();
    })();
}

const podium = document.querySelector('.podium');
if (podium) {
    // Pop once the result scrolls into view
    const podiumObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // let the section's reveal animation land first
            setTimeout(() => fireConfetti(podium), 450);
            obs.unobserve(entry.target);
        });
    }, { threshold: 1.0 });

    podiumObserver.observe(podium);

    // ...and again on demand
    podium.addEventListener('mouseenter', () => fireConfetti(podium));
    podium.addEventListener('focus',      () => fireConfetti(podium));
    podium.addEventListener('click',      () => fireConfetti(podium));
}

// ================================================================
// GALLERY MODAL
// ================================================================
const modal        = document.getElementById('gallery-modal');
const modalImg     = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalCount   = document.getElementById('modal-count');
const modalName    = document.getElementById('modal-project-name');
const modalDots    = document.getElementById('modal-dots');
const modalPrev    = document.querySelector('.modal-prev');
const modalNext    = document.querySelector('.modal-next');
const modalClose   = document.querySelector('.modal-close');

let currentImages = [];
let currentIndex  = 0;

function openGallery(galleryId) {
    const data = galleries[galleryId];
    if (!data) return;

    currentImages = data.images;
    currentIndex  = 0;
    modalName.textContent = data.title;

    buildDots();
    showSlide(0);

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
}

function closeGallery() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function showSlide(index) {
    if (!currentImages.length) {
        modalImg.src            = '';
        modalImg.classList.remove('loaded');
        modalCaption.textContent = 'Add your photos to images/ and uncomment the entries in script.js.';
        modalCount.textContent   = '';
        modalPrev.disabled = true;
        modalNext.disabled = true;
        return;
    }

    index          = Math.max(0, Math.min(index, currentImages.length - 1));
    currentIndex   = index;
    const slide    = currentImages[index];

    modalImg.classList.remove('loaded');
    modalImg.onload = () => modalImg.classList.add('loaded');
    modalImg.src    = slide.src;
    modalImg.alt    = slide.caption || '';
    modalCaption.textContent = slide.caption || '';
    modalCount.textContent   =
        `${String(index + 1).padStart(2, '0')} / ${String(currentImages.length).padStart(2, '0')}`;

    document.querySelectorAll('.modal-dot').forEach((d, i) =>
        d.classList.toggle('active', i === index)
    );

    modalPrev.disabled = index === 0;
    modalNext.disabled = index === currentImages.length - 1;
}

function buildDots() {
    modalDots.innerHTML = '';
    currentImages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'modal-dot';
        dot.setAttribute('aria-label', `Image ${i + 1}`);
        dot.addEventListener('click', () => showSlide(i));
        modalDots.appendChild(dot);
    });
}

// Project card click opens gallery
document.querySelectorAll('.project-card[data-gallery]').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('a')) return; // let external links through
        openGallery(card.dataset.gallery);
    });
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery(card.dataset.gallery);
        }
    });
});

modalPrev.addEventListener('click', () => showSlide(currentIndex - 1));
modalNext.addEventListener('click', () => showSlide(currentIndex + 1));
modalClose.addEventListener('click', closeGallery);
modal.addEventListener('click', e => { if (e.target === modal) closeGallery(); });

// Keyboard: ESC closes, arrows navigate
document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeGallery();
    if (e.key === 'ArrowLeft')  showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
});

// Touch swipe in modal
let swipeStartX = 0;
modal.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) > 50) dx < 0 ? showSlide(currentIndex + 1) : showSlide(currentIndex - 1);
});
