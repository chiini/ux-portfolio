const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const processList = document.querySelector('.process-list');
if (processList) {
  const dotsNav = document.createElement('nav');
  dotsNav.className = 'scroll-dots';
  dotsNav.setAttribute('aria-label', 'Section navigation');

  const entries = Array.from(processList.querySelectorAll('.process-step'))
    .map((step) => {
      const targetId = step.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return null;

      const colorClass = Array.from(step.querySelector('.topic-num').classList)
        .find((cls) => cls.startsWith('topic-num-'));
      const color = colorClass ? colorClass.replace('topic-num-', '') : '1';

      const label = step.querySelector('h3').textContent;

      const dot = document.createElement('a');
      dot.href = step.getAttribute('href');
      dot.className = 'scroll-dot';
      dot.dataset.color = color;
      dot.dataset.label = label;
      dot.setAttribute('aria-label', label);
      dotsNav.appendChild(dot);

      return { dot, target };
    })
    .filter(Boolean);

  if (entries.length) {
    document.body.appendChild(dotsNav);

    const hero = document.querySelector('.project-hero');
    if (hero) {
      const heroObserver = new IntersectionObserver((observed) => {
        observed.forEach((entry) => {
          dotsNav.classList.toggle('visible', !entry.isIntersecting);
        });
      }, { threshold: 0 });
      heroObserver.observe(hero);
    } else {
      dotsNav.classList.add('visible');
    }

    const setActive = (id) => {
      entries.forEach(({ dot, target }) => {
        dot.classList.toggle('active', target.id === id);
      });
    };

    const observer = new IntersectionObserver((observed) => {
      observed.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    entries.forEach(({ target }) => observer.observe(target));
  }
}
