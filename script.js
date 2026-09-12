document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 350);
  });
  
  setTimeout(() => preloader.classList.add('done'), 1800);

  /* ---------------- Sticky header on scroll ---------------- */
  const header = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Mobile nav toggle ---------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  burgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    const icon = burgerBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      mainNav.classList.remove('open');
      const icon = burgerBtn.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    });
  });

  /* ---------------- Active link on scroll (scrollspy) ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------------- Dark mode toggle ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', theme === 'light');
    icon.classList.toggle('fa-regular', theme === 'light');
    icon.classList.toggle('fa-sun', theme === 'dark');
    icon.classList.toggle('fa-solid', theme === 'dark');
    localStorage.setItem('holux-theme', theme);
  };

  const savedTheme = localStorage.getItem('holux-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- Scroll reveal animations ---------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-in');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------------- Residence favorite toggle ---------------- */
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  /* ---------------- Popular Residences carousel ---------------- */
  const track = document.getElementById('residenceTrack');
  const cards = Array.from(track.children);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');

  let perView = getPerView();
  let index = 0;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const totalDots = maxIndex() + 1;
    for (let i = 0; i < totalDots; i++) {
      const d = document.createElement('span');
      d.className = 'dot-item' + (i === index ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function update() {
    const gap = 28;
    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex();
    updateDots();
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      perView = getPerView();
      index = Math.min(index, maxIndex());
      buildDots();
      update();
    }, 150);
  });

  buildDots();
  update();

  /* Auto-play carousel */
  let autoplay = setInterval(() => {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  }, 4500);

  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }, 4500);
  });

  /* ---------------- Search form ---------------- */
  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = searchForm.querySelector('input');
    const btn = searchForm.querySelector('button');
    const original = btn.innerHTML;
    if (!input.value.trim()) {
      input.focus();
      searchForm.style.animation = 'shake .4s';
      setTimeout(() => searchForm.style.animation = '', 400);
      return;
    }
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btn.innerHTML = original; }, 1200);
    }, 900);
  });

  /* ---------------- CTA subscribe form ---------------- */
  const ctaForm = document.getElementById('ctaForm');
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = ctaForm.querySelector('button');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed';
      ctaForm.querySelector('input').value = '';
      setTimeout(() => { btn.innerHTML = original; }, 1800);
    }, 900);
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Shake keyframe ---------------- */
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes shake {
      0%,100%{ transform:translateX(0); }
      20%{ transform:translateX(-8px); }
      40%{ transform:translateX(8px); }
      60%{ transform:translateX(-6px); }
      80%{ transform:translateX(6px); }
    }
  `;
  document.head.appendChild(styleTag);

});