const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const closeMenu = () => { mobileNav.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '開啟導覽選單'); };
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const filterGroup = document.querySelector('.filters');
filterGroup.hidden = false;
filterGroup.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
  filterGroup.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let count = 0;
  document.querySelectorAll('.project').forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; if (!project.hidden) count++; });
  document.querySelector('.project-count').textContent = `${count} 個專案`;
}));

document.querySelectorAll('[data-print]').forEach(button => {
  button.addEventListener('click', () => window.print());
});
let toastTimer;
const toast = message => { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500); };
document.querySelectorAll('[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast('信箱已複製，期待收到你的訊息。');
    } catch { toast(`請長按或選取信箱複製：${button.dataset.copy}`); }
  });
});
// Printing always includes every project, including expanded detail content.
let printState;
window.addEventListener('beforeprint', () => {
  printState = [...document.querySelectorAll('.project, details')].map(el => ({ el, hidden: el.hidden, open: el.open }));
  printState.forEach(({ el }) => { el.hidden = false; if (el.tagName === 'DETAILS') el.open = true; });
});
window.addEventListener('afterprint', () => { printState?.forEach(({el, hidden, open}) => { el.hidden = hidden; if (el.tagName === 'DETAILS') el.open = open; }); printState = undefined; });

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) links.forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
}
