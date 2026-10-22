const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const closeMenu = () => {
  mobileNav.hidden = true;
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', '開啟導覽選單');
};
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
let toastTimer;
const toast = message => {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
};
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    toast('信箱已複製');
  } catch {
    toast(`請手動複製：${button.dataset.copy}`);
  }
}));

const journey = document.querySelector('.journey-track');
const updateProgress = () => {
  const bounds = journey.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (innerHeight * .56 - bounds.top) / Math.max(1, bounds.height - innerHeight * .35)));
  journey.style.setProperty('--timeline-progress', `${progress * 100}%`);
};
updateProgress();
addEventListener('scroll', updateProgress, {passive:true});
addEventListener('resize', updateProgress);

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${entry.target.id}`));
  }), {rootMargin:'-25% 0px -60% 0px'});
  links.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}

let printState;
addEventListener('beforeprint', () => {
  printState = [...document.querySelectorAll('details')].map(element => ({element, open:element.open}));
  printState.forEach(({element}) => element.open = true);
});
addEventListener('afterprint', () => {
  printState?.forEach(({element, open}) => element.open = open);
  printState = undefined;
});
