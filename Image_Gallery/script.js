// --- DOM Element Selection ---
const galleryItems = document.querySelectorAll('.gallery-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let visibleItems = [...galleryItems]; // Dynamically tracks active category items for clean navigation

// --- Category Filtering Architecture ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle Active styles on filter buttons
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        visibleItems = []; // Wipe list clean to rebuild based on choice

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
                visibleItems.push(item);
            } else {
                item.classList.add('hide');
            }
        });
    });
});

// --- Lightbox Operations ---
function openLightbox(index) {
    currentIndex = index;
    const imgSrc = visibleItems[currentIndex].querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background content scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore normal scrolling
}

function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    lightboxImg.src = visibleItems[currentIndex].querySelector('img').src;
}

function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    lightboxImg.src = visibleItems[currentIndex].querySelector('img').src;
}

// --- Dynamic Event Listeners ---
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Map clicks to our active dynamically filtered index tracker
        const index = visibleItems.indexOf(item);
        if (index !== -1) openLightbox(index);
    });
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Close Lightbox if a user clicks outside the picture container
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Full Keyboard Support (Esc, Left arrow, Right arrow)
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});