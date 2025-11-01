console.log("✅ JavaScript linked successfully!");
// -------------------- Part 3: Accordion (Essentials page) --------------------
document.addEventListener("DOMContentLoaded", function () {
  // Only run on essentials page (by filename or title)
  const onEssentials =
    location.pathname.toLowerCase().includes("essentials.html") ||
    document.title.toLowerCase().includes("essentials");

  if (!onEssentials) return;

  const buttons = document.querySelectorAll(".accordion-btn");
  const panels  = document.querySelectorAll(".accordion-panel");

  function closeAll() {
    buttons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    panels.forEach(p => p.hidden = true);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      const id = this.getAttribute("aria-controls");
      const panel = document.getElementById(id);

      // Single-open behaviour: close others then toggle this one
      closeAll();
      if (!expanded && panel) {
        this.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        this.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
});

// Part 3 – Step 2: Map Show/Hide Toggle (Contact page)
(function () {
  const btn = document.getElementById('mapToggle');
  const panel = document.getElementById('mapPanel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
    btn.textContent = isOpen ? 'Show Drop-off Maps' : 'Hide Drop-off Maps';

    if (!isOpen) {
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  });
})();

// ===== Step 3: Simple Gallery Slider (Impacts) =====
(function () {
  const gallery = document.getElementById('gallery');
  if (!gallery) return; // not on impacts page

  const stage  = gallery.querySelector('.slide-stage');
  const img    = stage.querySelector('.slide-img');
  const cap    = stage.querySelector('.slide-caption');
  const prev   = gallery.querySelector('.slide-nav.prev');
  const next   = gallery.querySelector('.slide-nav.next');
  const dotsEl = gallery.querySelector('.slide-dots');
  const thumbs = Array.from(gallery.querySelectorAll('.thumb-grid .thumb'));

  // Build slides from thumbnails (single source of truth)
  const slides = thumbs.map(t => ({
    src: t.dataset.src,
    title: t.dataset.title || ''
  }));

  let index = 0;

  function renderDots() {
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'slide-dot';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === index) b.setAttribute('aria-selected', 'true');
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    });
  }

  function updateDots() {
    Array.from(dotsEl.children).forEach((d, di) => {
      d.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    const s = slides[index];
    img.src = s.src;
    img.alt = s.title;
    cap.textContent = s.title;
    updateDots();
  }

  // Controls
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  

  // Thumbnails jump
  thumbs.forEach((t, i) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Init
  renderDots();
  go(0);
})();
// ----- Simple lightbox for gallery -----
(function () {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-cap');
  const closeBtn = box?.querySelector('.lightbox-close');

  let items = Array.from(grid.querySelectorAll('img'));
  let idx = -1;

  function open(i) {
    const el = items[i];
    if (!el) return;
    idx = i;
    img.src = el.getAttribute('data-full') || el.src;
    img.alt = el.alt || '';
    cap.textContent = el.closest('figure')?.querySelector('figcaption')?.textContent || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
  }
  function next(delta) {
    if (idx < 0) return;
    idx = (idx + delta + items.length) % items.length;
    open(idx);
  }

  grid.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'IMG') {
      const i = items.indexOf(target);
      open(i);
    }
  });

  closeBtn?.addEventListener('click', close);
  box?.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  // keyboard: Esc to close, arrows to navigate
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next(1);
    if (e.key === 'ArrowLeft') next(-1);
  });
})();


