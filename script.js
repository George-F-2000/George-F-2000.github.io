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
