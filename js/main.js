console.log("✅ JavaScript linked successfully!");

// Accordion toggle for Essentials page
document.addEventListener("DOMContentLoaded", function () {
  
  // Check if page is Essentials
  const onEssentials =
    location.pathname.toLowerCase().includes("essentials.html") ||
    document.title.toLowerCase().includes("essentials");

  if (!onEssentials) return; // Exit if not on essentials

  // Select all accordion buttons and panels
  const buttons = document.querySelectorAll(".accordion-btn");
  const panels  = document.querySelectorAll(".accordion-panel");

  // Close all panels
  function closeAll() {
    buttons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    panels.forEach(p => p.hidden = true);
  }

  // Toggle selected accordion item
  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      const id = this.getAttribute("aria-controls");
      const panel = document.getElementById(id);

      closeAll(); // collapse all others
      if (!expanded && panel) {
        this.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        this.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
});


// Toggle show/hide map on Contact page
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

// Simple image slider for Gallery section
(function () {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const stage  = gallery.querySelector('.slide-stage');
  const img    = stage.querySelector('.slide-img');
  const cap    = stage.querySelector('.slide-caption');
  const prev   = gallery.querySelector('.slide-nav.prev');
  const next   = gallery.querySelector('.slide-nav.next');
  const dotsEl = gallery.querySelector('.slide-dots');
  const thumbs = Array.from(gallery.querySelectorAll('.thumb-grid .thumb'));

  // Create slide list from thumbnails
  const slides = thumbs.map(t => ({
    src: t.dataset.src,
    title: t.dataset.title || ''
  }));

  let index = 0;

  // Create navigation dots
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

  // Update active dot
  function updateDots() {
    Array.from(dotsEl.children).forEach((d, di) => {
      d.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  }

  // Switch slides
  function go(i) {
    index = (i + slides.length) % slides.length;
    const s = slides[index];
    img.src = s.src;
    img.alt = s.title;
    cap.textContent = s.title;
    updateDots();
  }

  // Prev/next buttons
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  // Click thumbnails to jump to slide
  thumbs.forEach((t, i) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Start slider
  renderDots();
  go(0);
})();

// Simple lightbox for gallery images
(function () {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-cap');
  const closeBtn = box?.querySelector('.lightbox-close');

  let items = Array.from(grid.querySelectorAll('img'));
  let idx = -1;

  // Open selected image in lightbox
  function open(i) {
    const el = items[i];
    if (!el) return;
    idx = i;
    img.src = el.getAttribute('data-full') || el.src;
    img.alt = el.alt || '';
    cap.textContent =
      el.closest('figure')?.querySelector('figcaption')?.textContent || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // Close the lightbox
  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
  }

  // Go to next/previous image
  function next(delta) {
    if (idx < 0) return;
    idx = (idx + delta + items.length) % items.length;
    open(idx);
  }

  // Open on click
  grid.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'IMG') {
      const i = items.indexOf(target);
      open(i);
    }
  });

  // Close and background click
  closeBtn?.addEventListener('click', close);
  box?.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  // Keyboard support: Esc + arrow keys
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next(1);
    if (e.key === 'ArrowLeft') next(-1);
  });
})();

// Scroll animation reveal on view
(function () {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;

  // If no IntersectionObserver, show all
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  // Observer adds animation when visible
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        o.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  items.forEach(el => obs.observe(el));
})();

// Live message counter for contact form
(function () {
  const msg = document.getElementById('message');
  if (!msg) return;

  const LIMIT = 500;
  let counter = document.getElementById('msgCounter');

  // Create counter element if missing
  if (!counter) {
    counter = document.createElement('small');
    counter.id = 'msgCounter';
    counter.className = 'msg-counter';
    msg.insertAdjacentElement('afterend', counter);
  }

  // Update count and warn near limit
  const update = () => {
    const len = msg.value.length;
    counter.textContent = `${len}/${LIMIT} characters`;
    counter.classList.toggle('is-limit', len > LIMIT * 0.9);
    msg.setCustomValidity(
      len > LIMIT
        ? `Please keep your message under ${LIMIT} characters.`
        : ''
    );
  };

  msg.addEventListener('input', update);
  update();
})();
// Quick filter for Essentials page
(function () {
  // Run only on essentials page
  const onEssentials =
    location.pathname.toLowerCase().includes('essentials.html') ||
    document.title.toLowerCase().includes('essentials');
  if (!onEssentials) return;

  // Get all lists in accordion panels
  const lists = document.querySelectorAll(
    '.accordion-panel .accordion-list, .accordion-panel ul, .accordion-panel ol'
  );
  if (!lists.length) return;

  // Add filter input above accordion
  const wrap = document.createElement('div');
  wrap.className = 'ess-filter-wrap';
  wrap.innerHTML = `
    <input type="search" id="essFilter" placeholder="Quick filter essentials (e.g., shoes, toiletries, milk)" />
  `;
  const acc = document.querySelector('.accordion');
  if (acc) acc.insertAdjacentElement('beforebegin', wrap);

  // Filter list items as user types
  const input = document.getElementById('essFilter');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    lists.forEach(list => {
      list.querySelectorAll('li, tr, td').forEach(node => {
        const text = node.textContent.trim().toLowerCase();
        node.style.display = q && !text.includes(q) ? 'none' : '';
      });
    });
  });
})();

// Back-to-top button for easy scroll
(function () {
  // Create button
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = 'Top';
  document.body.appendChild(btn);

  // Show or hide button on scroll
  const toggle = () => {
    if (window.scrollY > 600) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  // Smooth scroll to top when clicked
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
// Donation search with gentle validation and themed toast
const looksNonsense = (s) => {
  if (s.length < 3) return true;                           // too short
  const lettersOnly = /^[a-z\s]+$/.test(s);                // only letters/spaces
  if (!lettersOnly) return false;                          // allow mixed terms
  const compact = s.replace(/\s+/g, '');                   // remove spaces
  if (!/[aeiou]/i.test(compact)) return true;              // needs a vowel
  if (/^([a-z])\1{2,}$/i.test(compact)) return true;       // repeated same letter
  return false;
};

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("donationSearch");  // input field
  const results   = document.getElementById("donationResults"); // results area
  if (!searchBox || !results) return;                           // guard if missing

  // Predefined donation items (alphabetical-ish)
  const donationItems = [
    "backpacks","baby clothes","baby wipes","bandages","batteries","blankets","books","bottled water","biscuits",
    "canned beans","canned fish","canned food","cereal","cooking oil",
    "detergent","diapers / nappies","dish soap","dried beans",
    "flour","formula (baby)","hand sanitizer","hygiene kits",
    "jackets","jerseys","laundry detergent","long-life milk",
    "milk","notebooks","pasta","pens","pencils","rice",
    "sanitary pads","school shoes","soap","socks","stationery",
    "sugar","toilet paper","toothbrush","toothpaste","towels",
    "toys","t-shirts","uniforms","vests"
  ];

  // Create a small themed toast
  const toast = document.createElement("div");
  toast.style.position   = "fixed";
  toast.style.bottom     = "24px";
  toast.style.left       = "50%";
  toast.style.transform  = "translateX(-50%)";
  toast.style.background = "#1a4c48";
  toast.style.color      = "#ffffff";
  toast.style.padding    = "10px 18px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize   = "0.95rem";
  toast.style.boxShadow  = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.opacity    = "0";
  toast.style.transition = "opacity 0.4s ease";
  toast.style.zIndex     = "9999";
  document.body.appendChild(toast);

  const showToast = (message) => {                           // show toast briefly
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => (toast.style.opacity = "0"), 1800);
  };

  // Helpers to normalise and classify input
  const norm     = s  => s.toLowerCase().trim();             // normalise text
  const isLetter = ch => /^[a-z]$/.test(ch);                 // A–Z check
  const isNumber = ch => /^[0-9]$/.test(ch);                 // 0–9 check

  const setResults = (html, tone = "success") => {           // update UI state
    results.className = "donation-results " + tone;
    results.innerHTML = html;
  };

  // Live search behaviour on input
  searchBox.addEventListener("input", () => {
    const q = norm(searchBox.value);                         // current query
    if (!q) { setResults(""); return; }                      // clear if empty

    // Prevent numeric-first searches (e.g., "2l")
    if (isNumber(q.charAt(0))) {
      showToast("Please type a letter (A–Z) to search for donation items.");
      setResults("");
      return;
    }

    // Guard against nonsense terms (e.g., "jjj")
    if (looksNonsense(q)) {
      showToast("Please enter a meaningful search term (e.g., 'food', 'clothes', 'donation').");
      setResults("");
      return;
    }

    // Match items by first letter or substring
    let matches;
    if (q.length === 1 && isLetter(q)) {
      matches = donationItems.filter(item => norm(item).startsWith(q));
    } else {
      matches = donationItems.filter(item => norm(item).includes(q));
    }

    // Show matches or a kind fallback
    if (matches.length) {
      const unique = [...new Set(matches)].sort((a, b) => a.localeCompare(b));
      setResults("✅ You can donate: " + unique.join(", "), "success");
    } else {
      setResults(`
        We may still be able to accept that item.<br>
        Our list shows current priorities, but donations from the heart help too.
        <div class="donation-help-links">
          <a href="ways-to-give.html" class="donation-link"> See Ways to Give</a>
          <span class="divider">|</span>
          <a href="contact.html" class="donation-link"> Ask Us About Your Item</a>
        </div>
      `, "info");
    }
  });
});
// Back-to-top: create once, show after scrolling, smooth-jump to top
(function () {
  try {
    if (document.querySelector('.bora-backtotop')) return;

    const btn = document.createElement('button');
    btn.className = 'bora-backtotop';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = 'Top';
    document.body.appendChild(btn);

    const showAfter = 600; // reveal threshold (px)

    const onScroll = () => {
      if (window.scrollY > showAfter) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onScroll(); // initial state
    window.addEventListener('scroll', onScroll, { passive: true });
  } catch (e) {
    console && console.warn && console.warn('BackToTop skipped:', e);
  }
})();

// Contact form: validate fields, live counter, and thank-you modal
document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('contactForm');
  if (!form) return; // only on contact page

  // field refs
  const firstName = document.getElementById('first-name');
  const lastName  = document.getElementById('last-name');
  const email     = document.getElementById('email');
  const topic     = document.getElementById('query-topic');
  const message   = document.getElementById('message');
  const statusEl  = document.getElementById('formStatus');
  const counterEl = document.getElementById('msgCounter');

  const emailRe = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/; // email regex
  const LIMIT   = 500;                                                   // message cap

  // set inline error text by <small id="...Error">
  function setError(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  // clear all error/info text
  function clearErrors() {
    setError('firstNameError', '');
    setError('lastNameError',  '');
    setError('emailError',     '');
    setError('topicError',     '');
    setError('messageError',   '');
    if (statusEl) statusEl.textContent = '';
  }

  // update live character counter
  function updateCounter() {
    if (!counterEl || !message) return;
    const len = message.value.length;
    counterEl.textContent = `${len}/${LIMIT} characters`;
  }
  if (message) {
    message.addEventListener('input', updateCounter);
    updateCounter();
  }

  // validate inputs and return overall state
  function validate() {
    clearErrors();
    let firstInvalid = null;

    if (!firstName.value.trim()) {
      setError('firstNameError', 'Please enter your name.');
      firstInvalid ||= firstName;
    }

    if (!lastName.value.trim()) {
      setError('lastNameError', 'Please enter your surname.');
      firstInvalid ||= lastName;
    }

    const emailVal = email.value.trim();
    if (!emailVal) {
      setError('emailError', 'Please enter your email address.');
      firstInvalid ||= email;
    } else if (!emailRe.test(emailVal)) {
      setError('emailError', 'Please enter a valid email (e.g., name@example.com).');
      firstInvalid ||= email;
    }

    if (!topic.value) {
      setError('topicError', 'Please select a topic.');
      firstInvalid ||= topic;
    }

    const msg = message.value.trim();
    if (!msg) {
      setError('messageError', 'Please write a short message.');
      firstInvalid ||= message;
    } else if (msg.length > LIMIT) {
      setError('messageError', `Please keep your message under ${LIMIT} characters.`);
      firstInvalid ||= message;
    }

    return { ok: !firstInvalid, firstInvalid };
  }

  // simple thank-you modal (no external CSS)
  function showThankYouModal({ first, last, email, topic, message }) {
    const overlay = document.createElement('div');           // backdrop
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,.45)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const dialog = document.createElement('div');            // dialog
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'thankYouTitle');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '14px';
    dialog.style.maxWidth = '560px';
    dialog.style.width = 'min(92%, 560px)';
    dialog.style.padding = '20px 20px 16px';
    dialog.style.boxShadow = '0 18px 40px rgba(0,0,0,.18)';
    dialog.style.fontFamily = 'Arial, sans-serif';
    dialog.style.color = '#243433';

    dialog.innerHTML = `
      <h3 id="thankYouTitle" style="margin:0 0 8px;color:#1a4c48;font-weight:800;">Thank you for your message</h3>
      <p style="margin:0 0 10px;">We’ve recorded the details below. We’ll get back to you shortly.</p>
      <div style="border:1px solid #d7e7e4;border-radius:10px;background:#f6faf9;padding:12px 14px;margin:10px 0 14px;">
        <p style="margin:6px 0;"><b>Name:</b> ${first} ${last}</p>
        <p style="margin:6px 0;"><b>Email:</b> ${email}</p>
        <p style="margin:6px 0;"><b>Topic:</b> ${topic}</p>
        <p style="margin:6px 0;"><b>Message:</b> ${message.length > 120 ? (message.slice(0,120) + '…') : message}</p>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="modalClose" class="btn" type="button" style="background:#1a4c48;color:#fff;border:none;border-radius:10px;padding:10px 16px;cursor:pointer;">Close</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    dialog.tabIndex = -1;                                     // focus for a11y
    dialog.focus();

    const close = () => overlay.remove();                     // remove modal

    overlay.addEventListener('click', (e) => {                // click outside
      if (e.target === overlay) close();
    });
    dialog.querySelector('#modalClose').addEventListener('click', close); // button
    document.addEventListener('keydown', (e) => {             // Esc to close
      if (e.key === 'Escape') close();
    }, { once: true });
  }

  // submit: validate → show modal → reset
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { ok, firstInvalid } = validate();

    if (!ok) {
      if (statusEl) statusEl.textContent = 'Please fix the highlighted fields.';
      if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
      return;
    }

    if (statusEl) statusEl.textContent = '';                  // clear status

    showThankYouModal({
      first: firstName.value.trim(),
      last : lastName.value.trim(),
      email: email.value.trim(),
      topic: topic.value,
      message: message.value.trim()
    });

    form.reset();                                             // clear form
    updateCounter();                                          // reset counter
  });

  // clear individual error message on input
  [firstName, lastName, email, topic, message].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      switch (el) {
        case firstName: setError('firstNameError', ''); break;
        case lastName:  setError('lastNameError',  ''); break;
        case email:     setError('emailError',     ''); break;
        case topic:     setError('topicError',     ''); break;
        case message:   setError('messageError',   ''); break;
      }
    });
  });
});
// Essentials: hide the built-in quick filter only on essentials.html
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.toLowerCase().includes('essentials.html')) return;

  const qf = document.querySelector('input[placeholder^="Quick filter essentials"]');
  if (!qf) return;

  const wrap = qf.closest('#donation-search') || qf.parentElement;
  (wrap || qf).style.display = 'none';
});

// Donate: copy banking details on click with a small themed toast
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#banking');
  if (!section) return;

  // toast element (reused each time)
  let toast = document.getElementById('donateToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'donateToast';
    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      bottom: '24px',
      transform: 'translateX(-50%)',
      background: '#1a4c48',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '10px',
      fontWeight: '700',
      boxShadow: '0 6px 16px rgba(0,0,0,.2)',
      opacity: '0',
      transition: 'opacity .25s ease',
      zIndex: '9999',
    });
    document.body.appendChild(toast);
  }

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => (toast.style.opacity = '0'), 1400);
  };

  // cross-browser clipboard helper
  const copyText = async (text) => {
    try {
      if (navigator.clipboard && (location.protocol === 'https:' || location.hostname === 'localhost')) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast('Copied to clipboard');
    } catch {
      showToast('Press Ctrl+C to copy');
    }
  };

  const list = section.querySelector('ul');
  if (!list) return;

  // make each row focusable and copy on click/Enter/Space
  list.querySelectorAll('li').forEach((li) => (li.tabIndex = 0));

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    copyText(li.textContent.trim());
  });

  list.addEventListener('keydown', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyText(li.textContent.trim());
    }
  });
});






