(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));


  // === EmailJS config (setează valorile din README pentru a activa trimiterea pe email) ===
  const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';


  // Loader
  const loader = qs('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 450);
  });

  // Year
  const year = qs('#year');
  if (year) year.textContent = new Date().getFullYear();


  // Toast
  const toastEl = qs('#toast');
  const toastMsg = qs('#toastMsg');
  let toastT = null;
  const toast = (msg, isError=false) => {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = msg;
    toastEl.classList.toggle('toast--error', !!isError);
    toastEl.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-show'), 3600);
  };

  // Contact form (EmailJS if configured, fallback mailto)
  const form = qs('#contactForm');
  const sendBtn = qs('#sendBtn');
  const configured = () =>
    window.emailjs &&
    EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID &&
    ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(v => String(v).includes('YOUR_EMAILJS_'));

  if (window.emailjs && EMAILJS_PUBLIC_KEY && !String(EMAILJS_PUBLIC_KEY).includes('YOUR_EMAILJS_')) {
    try { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch {}
  }

  const mailtoFallback = (data) => {
    const to = 'contact@exemplu.ro'; // schimbă dacă vrei un email fix
    const subject = encodeURIComponent(`[Site] ${data.subject} — ${data.from_name}`);
    const body = encodeURIComponent(
      `Nume: ${data.from_name}\n` +
      `Telefon: ${data.phone}\n` +
      `Email: ${data.reply_to || '-'}\n` +
      `\nMesaj:\n${data.message}\n`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // anti-spam honeypot
    const honey = form.querySelector('input[name="website"]');
    if (honey && honey.value.trim() !== '') return;

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // basic guards
    if (!data.from_name || !data.phone || !data.subject || !data.message) {
      toast('Te rog completează câmpurile obligatorii.', true);
      return;
    }

    sendBtn && (sendBtn.disabled = true);
    sendBtn && (sendBtn.textContent = 'Se trimite...');

    try {
      if (configured()) {
        // Attach meta
        data.city = 'Călărași';
        data.address = 'Strada București nr. 86, Călărași, România';

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
        toast('Mesaj trimis. Vă contactăm în cel mai scurt timp.');
        form.reset();
      } else {
        toast('Formular neconfigurat — se deschide email-ul.', false);
        mailtoFallback(data);
      }
    } catch (err) {
      toast('Nu s-a putut trimite. Încercați din nou sau sunați non-stop.', true);
      // fallback
      try { mailtoFallback(data); } catch {}
    } finally {
      sendBtn && (sendBtn.disabled = false);
      sendBtn && (sendBtn.textContent = 'Trimite');
    }
  });


  // Mobile menu
  const burger = qs('.burger');
  const mobile = qs('.mobile');
  const panelLinks = qsa('.mobile__panel a');

  const setMenu = (open) => {
    burger?.setAttribute('aria-expanded', String(open));
    mobile?.classList.toggle('is-open', open);
    mobile?.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger?.addEventListener('click', () => {
    const open = !(burger.getAttribute('aria-expanded') === 'true');
    setMenu(open);
  });

  mobile?.addEventListener('click', (e) => {
    if (e.target === mobile) setMenu(false);
  });

  panelLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Smooth scroll (native)
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal on scroll
  const revealEls = qsa('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Count up numbers
  const countEls = qsa('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      const el = ent.target;
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      const duration = 900;
      const start = performance.now();
      const from = 0;

      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const val = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  countEls.forEach(el => countIO.observe(el));

  // Lightbox
  const lightbox = qs('#lightbox');
  const lbImg = qs('.lightbox__img', lightbox);
  const lbCap = qs('.lightbox__caption', lightbox);
  const lbClose = qs('.lightbox__close', lightbox);

  const openLB = (src, caption) => {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCap) lbCap.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLB = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  };

  qsa('#gallery .shot').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = qs('img', fig);
      const cap = qs('figcaption', fig)?.textContent?.trim();
      if (img?.src) openLB(img.src, cap);
    });
  });

  lbClose?.addEventListener('click', closeLB);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });

  // Subtle parallax on hero video
  const heroVideo = qs('.hero__video');
  const onScroll = () => {
    if (!heroVideo) return;
    const y = window.scrollY || 0;
    heroVideo.style.transform = `translateY(${Math.min(40, y * 0.05)}px) scale(1.05)`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // (Removed) Ambient particles
  // Motiv: pe un site de servicii funerare, efectele de tip „ninsoare/particule” pot fi interpretate greșit.
  // Păstrăm un design sobru, premium, cu lumină/gradient subtil doar din CSS.
})();