import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/resume.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const e = escape;
const list = values => values.map(value => `<li>${e(value)}</li>`).join('');
const tags = values => values.map(value => `<span class="tag">${e(value)}</span>`).join('');
const arrow = '<span aria-hidden="true">↗</span>';
const nav = '<a href="#about">關於</a><a href="#experience">經歷</a><a href="#projects">專案</a><a href="#education">學歷</a><a href="#contact">聯絡</a>';
const siteUrl = new URL(data.siteUrl);
if (siteUrl.protocol !== 'https:') throw new Error('siteUrl 必須是 HTTPS');
if (!/^https:\/\/github\.com\/[a-z\d-]+\/?$/i.test(data.github)) throw new Error('請填入有效的 GitHub 個人頁網址');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('請填入有效的 email');
const description = `${data.name}的個人履歷與專案作品集。${data.focus}。${data.intro}`;
const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', name: `${data.name}｜個人履歷`, url: data.siteUrl, dateModified: data.updatedAt, mainEntity: { '@type': 'Person', name: data.name, alternateName: data.englishName, jobTitle: data.role, url: data.siteUrl, email: data.email, sameAs: [data.github], knowsAbout: data.skills.flatMap(s => s.items), alumniOf: { '@type': 'CollegeOrUniversity', name: data.education.school } } }).replace(/</g, '\\u003c');
const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <title>${e(data.name)} ${e(data.englishName)}｜系統開發・數據分析</title>
  <meta name="description" content="${e(description)}">
  <link rel="canonical" href="${e(data.siteUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:title" content="${e(data.name)}｜${e(data.focus)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:url" content="${e(data.siteUrl)}">
  <meta property="og:image" content="${e(new URL('assets/portrait.jpg', siteUrl).href)}">
  <meta property="og:image:width" content="333">
  <meta property="og:image:height" content="388">
  <meta property="og:image:alt" content="${e(data.name)}的個人照片">
  <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./assets/style.css">
  <script type="application/ld+json">${structured}</script>
  <script src="./assets/app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">跳至主要內容</a>
  <header class="site-header">
    <div class="header-inner">
      <a href="#" class="brand" aria-label="${e(data.name)}，返回頂部"><span class="brand-mark">GL<span>.</span></span><span>${e(data.englishName)}</span></a>
      <nav class="desktop-nav" aria-label="主要導覽">${nav}</nav>
      <div class="header-actions"><button type="button" class="print-button" data-print>履歷 PDF <span aria-hidden="true">↓</span></button><button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="開啟導覽選單"><span></span><span></span></button></div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="手機導覽" hidden>${nav}</nav>
  </header>
  <main id="main">
    <section class="hero wrap" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div class="hero-copy"><p class="eyebrow">SYSTEMS · DATA · AUTOMATION</p><h1 id="hero-title">${e(data.name)}<span>${e(data.englishName)}</span></h1><p class="hero-role">系統開發 <span>/</span> 數據分析 <span>/</span> 流程自動化</p><p class="hero-intro">${e(data.intro)}</p><div class="hero-actions"><a class="button primary" href="mailto:${e(data.email)}">與我聯絡 ${arrow}</a><a class="button secondary" href="#projects">查看專案 <span aria-hidden="true">↓</span></a></div><div class="hero-links"><a href="${e(data.github)}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a><a href="mailto:${e(data.email)}">${e(data.email)}</a></div></div>
        <aside class="profile-card" aria-label="個人照片與學習近況"><div class="portrait-frame"><img src="./assets/portrait.jpg" alt="${e(data.name)}的彩色個人照片" width="333" height="388" fetchpriority="high"></div>${data.education.graduate ? `<p class="profile-status"><span aria-hidden="true">◉</span> ${e(data.education.graduate.status)}</p>` : ''}</aside>
      </div>
      <div class="hero-bottom"><span>製造資訊系統</span><span>資料處理與分析</span><span>ERP 作業自動化</span></div>
    </section>
    <section id="about" class="about-section section-pad">
      <div class="wrap section-grid"><div class="section-label"><span>ABOUT</span><h2>關於我</h2></div><div class="about-content"><p class="lead">以現場需求為起點，<br>連結系統、資料與流程。</p><p>${e(data.about)}</p><div class="expertise-strip">${data.skills.map(s => `<a href="#skills">${e(s.title)} ${arrow}</a>`).join('')}</div></div></div>
    </section>
    <section id="projects" class="wrap section-pad" aria-labelledby="projects-title"><div class="section-heading"><div class="section-label"><span>SELECTED PROJECTS</span><h2 id="projects-title">專案經歷</h2></div><p>需求、實作與成果</p></div>
      <div class="project-toolbar"><div class="filters" role="group" aria-label="依專案類別篩選" hidden><button type="button" data-filter="all" aria-pressed="true">全部專案 <span>${data.projects.length.toString().padStart(2,'0')}</span></button><button type="button" data-filter="system" aria-pressed="false">系統開發</button><button type="button" data-filter="data" aria-pressed="false">數據與自動化</button></div><p class="project-count" role="status" aria-live="polite">${data.projects.length} 個專案</p></div>
      <div class="projects">${data.projects.map(p => `<article class="project" data-category="${e(p.category)}"><div class="project-copy"><div class="project-meta"><span>${e(p.categoryLabel)}</span><span class="project-index" aria-hidden="true">${e(p.number)}</span></div><h3>${e(p.name)}</h3><p class="project-description">${e(p.description)}</p><div class="project-outcome"><span>成果與改善</span><strong>${e(p.outcome)}</strong></div><div class="tags">${tags(p.tags)}</div><details><summary>查看我的工作內容 <span aria-hidden="true">＋</span></summary><ul>${list(p.details)}</ul><p>${e(p.outcomeDetail)}</p></details></div></article>`).join('')}</div>
    </section>
    <section id="experience" class="experience-section section-pad"><div class="wrap section-grid"><div class="section-label"><span>EXPERIENCE</span><h2>工作經歷</h2></div><div class="timeline">${data.experience.map(x => `<article class="experience-item"><p class="eyebrow">${e(x.period)} <span> / ${e(x.englishCompany)}</span></p><div class="job-title"><h3>${e(x.company)}</h3><span>${e(x.role)}</span></div><p>${e(x.description)}</p><ul>${list(x.points)}</ul></article>`).join('')}</div></div></section>
    <section id="skills" class="wrap section-pad"><div class="section-heading"><div class="section-label"><span>SKILLS</span><h2>專業技能</h2></div></div><div class="skills-grid">${data.skills.map(s => `<article class="skill"><h3>${e(s.title)}</h3><p>${e(s.description)}</p><div class="tags">${tags(s.items)}</div></article>`).join('')}</div>
    </section>
    <section id="education" class="education-section section-pad"><div class="wrap section-grid"><div class="section-label"><span>EDUCATION</span><h2>學歷與證照</h2></div><div class="education-content">${data.education.graduate ? `<article class="education-item"><span class="education-badge">${e(data.education.graduate.status)}</span><h3>${e(data.education.graduate.school || '研究所')}</h3>${data.education.graduate.department ? `<p>${e(data.education.graduate.department)}</p>` : ''}${data.education.graduate.period ? `<p class="education-period">${e(data.education.graduate.period)}</p>` : ''}${data.education.graduate.research.length ? `<ul>${list(data.education.graduate.research)}</ul>` : ''}</article>` : ''}<article class="education-item"><h3>${e(data.education.school)}</h3><p>${e(data.education.department)}</p><p class="education-award">${e(data.education.award)}</p><details><summary>在學活動 <span aria-hidden="true">＋</span></summary><ul>${list(data.education.activities)}</ul></details></article><div class="certificates"><h4>專業證照</h4><ul>${list(data.education.certificates)}</ul></div></div></div></section>
    <section id="contact" class="contact-section"><div class="wrap"><p class="eyebrow">CONTACT</p><h2>歡迎交流與聯繫</h2><p>關於系統開發、資料分析或合作機會，歡迎透過 email 聯絡我。</p><div class="contact-actions"><a class="email-link" href="mailto:${e(data.email)}">${e(data.email)} ${arrow}</a><button type="button" class="copy-button" data-copy="${e(data.email)}" hidden>複製信箱</button></div><div class="contact-footer"><span>${e(data.name)} · ${e(data.englishName)}</span><div>${data.showPhone ? `<a href="tel:${e(data.phone.replace(/[^+\d]/g,''))}">${e(data.phone)}</a>` : ''}<a href="${e(data.github)}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a><button type="button" data-print>列印 / 儲存 PDF ${arrow}</button></div></div></div></section>
  </main>
  <footer class="site-footer wrap"><span>© ${e(data.updatedAt.slice(0,4))} ${e(data.englishName)}</span><a href="#">回到頂部 ↑</a></footer>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
</body>
</html>`;

const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root)) throw new Error('Unsafe output path');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(root, 'dist/assets'), { recursive: true });
await writeFile(path.join(root, 'dist/index.html'), html);
for (const asset of ['style.css', 'app.js', 'favicon.svg', 'portrait.jpg']) await copyFile(path.join(root, 'src', asset), path.join(root, 'dist/assets', asset));
await writeFile(path.join(root, 'dist/.nojekyll'), '');
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).href}\n`);
await writeFile(path.join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${e(data.siteUrl)}</loc><lastmod>${e(data.updatedAt)}</lastmod></url></urlset>`);
await writeFile(path.join(root, 'dist/404.html'), '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>找不到頁面｜李冠廷</title><style>body{background:#f5f4ee;color:#203d33;font:18px/1.8 system-ui;padding:15vh 8vw}a{color:inherit}h1{font-size:clamp(32px,8vw,64px)}</style><p>404 / PAGE NOT FOUND</p><h1>這一頁暫時迷路了。</h1><a href="' + e(data.siteUrl) + '">回到李冠廷的個人履歷 ↗</a></html>');
// Keep links sent with the old filename functional, without publishing old drafts.
for (const name of ['履歷網頁.html', ...Array.from({length:8}, (_, i) => `履歷網頁${i+2}.html`)]) await writeFile(path.join(root, 'dist', name), '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./"><meta name="viewport" content="width=device-width,initial-scale=1"><title>前往新版履歷</title><a href="./">前往新版個人履歷 →</a></html>');
console.log('Built dist/ — static HTML, assets, SEO files and legacy URL redirects.');
