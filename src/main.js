// ─── Renta Premium JS — Electric Blue Edition ───

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHamburger();
  initScrollHeader();
  initScrollReveal();
  initWordCycle();
  initServicesSimulators();
  initFaqAccordion();
  initNewsletterForm();
  initContactForm();
  initCounters();
});

// ─── Theme Toggle ───
function initTheme() {
  const btn = document.getElementById('theme-toggle-btn');
  const stored = localStorage.getItem('renta_theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }
  btn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('renta_theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', isDark ? 'fa-moon' : 'fa-sun');
  });
}

// ─── Mobile Hamburger Drawer ───
function initHamburger() {
  const btn      = document.getElementById('hamburger-btn');
  const drawer   = document.getElementById('nav-drawer');
  const overlay  = document.getElementById('nav-drawer-overlay');
  const closeBtn = document.getElementById('nav-drawer-close');

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    btn?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    btn?.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// ─── Shrink Header on Scroll ───
function initScrollHeader() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ─── Scroll-Reveal (Intersection Observer) ───
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ─── Animated Counter ───
function initCounters() {
  const counterEls = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);

    if (target >= 1000) {
      el.textContent = (current >= 1000 ? (current / 1000).toFixed(0) + 'K' : current) + suffix;
    } else {
      el.textContent = current + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ─── Hero Word Cycling ───
function initWordCycle() {
  const el = document.getElementById('hero-word-cycle');
  if (!el) return;

  const words = ['Dream Space', 'Next Home', 'Perfect Office', 'Ideal Airbnb', 'Safe Hostel', 'Shop Space'];
  let index = 0;

  function cycleWord() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350);
  }

  el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  setInterval(cycleWord, 2800);
}

// ─── Interactive Services Simulators ───
function initServicesSimulators() {
  const cards = document.querySelectorAll('.service-item-card');
  const panes = document.querySelectorAll('.simulator-pane');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const target = card.dataset.simulator;
      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === target) pane.classList.add('active');
      });
    });
  });

  // 1. Chat Simulator
  const chatInput  = document.getElementById('chat-sim-input');
  const chatSend   = document.getElementById('chat-sim-send-btn');
  const chatBox    = document.getElementById('chat-messages-container');
  const chatTyping = document.getElementById('chat-typing-indicator');

  const replies = [
    'Yes, the apartment is fully available! When would you like to schedule a viewing?',
    'Electricity is prepaid yaka, and water is back-up pumped — never any scarcity.',
    'For long-term lease (6+ months) I can lower the price by 100,000 UGX/month. Let\'s arrange a viewing first.',
    'We require a 1-month security deposit. The contract is signed digitally inside Renta.',
    'Sure! Let\'s arrange a physical viewing tomorrow at 11am — does that work for you?'
  ];
  let replyIdx = 0;

  function appendMsg(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    const now = new Date();
    div.innerHTML = `${text}<span class="chat-time">${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}</span>`;
    chatBox?.insertBefore(div, chatTyping);
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }

  function sendMsg() {
    const text = chatInput?.value.trim();
    if (!text) return;
    chatInput.value = '';
    appendMsg('tenant', text);
    if (chatTyping) chatTyping.style.display = 'flex';
    if (chatBox)    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      if (chatTyping) chatTyping.style.display = 'none';
      const lower = text.toLowerCase();
      let resp = replies[replyIdx % replies.length];
      if (lower.includes('price') || lower.includes('rent') || lower.includes('cost') || lower.includes('much')) resp = replies[2];
      else if (lower.includes('view') || lower.includes('visit') || lower.includes('see'))  resp = replies[4];
      else if (lower.includes('water') || lower.includes('power') || lower.includes('yaka')) resp = replies[1];
      else replyIdx++;
      appendMsg('landlord', resp);
      showToast('New message from Arthur Mugisha', 'fa-message');
    }, 1500);
  }

  chatSend?.addEventListener('click', sendMsg);
  chatInput?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });

  // 2. Mover Estimator
  const slider     = document.getElementById('mover-distance');
  const distVal    = document.getElementById('mover-dist-val');
  const moverOpts  = document.querySelectorAll('.mover-option');
  const baseEl     = document.getElementById('mover-summary-base');
  const distCostEl = document.getElementById('mover-summary-distance');
  const totalEl    = document.getElementById('mover-summary-total');

  let vBase = 30000, vRate = 1500;

  function calcMover() {
    const d = parseInt(slider?.value || 15);
    if (distVal) distVal.textContent = `${d} km`;
    const dc = d * vRate;
    const tot = vBase + dc;
    if (baseEl)     baseEl.textContent     = `UGX ${vBase.toLocaleString()}`;
    if (distCostEl) distCostEl.textContent = `UGX ${dc.toLocaleString()}`;
    if (totalEl)    totalEl.textContent    = `UGX ${tot.toLocaleString()}`;
  }

  moverOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      moverOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      vBase = parseInt(opt.dataset.base);
      vRate = parseInt(opt.dataset.rate);
      calcMover();
    });
  });
  slider?.addEventListener('input', calcMover);

  // 3. Scheduler
  const calDays    = document.querySelectorAll('.calendar-day:not(.empty):not(.booked)');
  const timeSlots  = document.querySelectorAll('.time-slot');
  const scheduleBtn= document.getElementById('schedule-sim-submit');
  let selDay = null, selTime = null;

  calDays.forEach(d => {
    d.addEventListener('click', () => {
      calDays.forEach(x => x.classList.remove('active'));
      d.classList.add('active');
      selDay = d.textContent;
    });
  });
  timeSlots.forEach(s => {
    s.addEventListener('click', () => {
      timeSlots.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      selTime = s.textContent;
    });
  });
  scheduleBtn?.addEventListener('click', () => {
    if (!selDay || !selTime) { showToast('Please select a date and time slot first.', 'fa-triangle-exclamation'); return; }
    showToast(`Viewing booked for July ${selDay} at ${selTime}!`, 'fa-circle-check');
  });

  // 4. Sign Pad
  const signPad   = document.getElementById('sign-pad');
  const sigName   = document.getElementById('agreement-name');
  const submitAg  = document.getElementById('agreement-sim-submit');

  signPad?.addEventListener('click', () => {
    const name = sigName?.value.trim() || 'Joseph Nsubuga';
    if (signPad) {
      signPad.innerHTML = `<span>${name}</span>`;
      signPad.classList.add('signed');
    }
    showToast('Document signed digitally', 'fa-signature');
  });

  submitAg?.addEventListener('click', () => {
    if (!signPad?.classList.contains('signed')) {
      showToast('Please tap the signature area to sign.', 'fa-triangle-exclamation');
      return;
    }
    showToast('Lease agreement submitted securely!', 'fa-file-shield');
  });
}

// ─── FAQ Accordion ───
function initFaqAccordion() {
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

// ─── Newsletter ───
function initNewsletterForm() {
  document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input?.value.trim()) {
      input.value = '';
      showToast('Subscribed! Check your email for the app link.', 'fa-paper-plane');
    }
  });
}

// ─── Contact Form ───
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contact-name')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();
    const btn     = form.querySelector('.contact-submit-btn');

    if (!name || !email || !message) {
      showToast('Please fill all required fields.', 'fa-triangle-exclamation');
      return;
    }
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; }

    setTimeout(() => {
      form.reset();
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; }
      showToast("Message sent! We'll reply within 24 hours.", 'fa-circle-check');
    }, 1600);
  });
}

// ─── Toast Notification ───
window.showToast = function(message, icon = 'fa-circle-info') {
  const toast = document.getElementById('notification-toast');
  if (!toast) return;
  toast.querySelector('i').className = `fa-solid ${icon}`;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
};
