import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/resume.json'), 'utf8'));
const e = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[character]);
const list = values => values.map(value => `<li>${e(value)}</li>`).join('');
const tags = values => values.map(value => `<span>${e(value)}</span>`).join('');
const arrow = '<span aria-hidden="true">↗</span>';
const byId = id => data.projects.find(project => project.id === id);
const select = ids => ids.map(byId).filter(Boolean);
const graduateProjects = select(['healthcare-platform', 'phishing-research']);
const auoProjects = select(['erp-mes-automation', 'material-flow', 'ergonomics-vision']);
const universityProjects = select(['spring-quality']);
const feature = project => `<article class="feature">
  <div class="feature-top"><span>${e(project.categoryLabel)}</span><span>${e(project.number)}</span></div>
  <h3>${e(project.name)}</h3>
  <p>${e(project.description)}</p>
  <div class="feature-result"><small>IMPACT</small><strong>${e(project.outcome)}</strong></div>
  <div class="feature-tags">${tags(project.tags)}</div>
  ${project.paper ? `<a class="feature-link" href="${e(project.paper)}" target="_blank" rel="noopener">${e(project.paperLabel)} ${arrow}</a>` : ''}
  <details><summary>我的工作與方法 <span aria-hidden="true">＋</span></summary><ul>${list(project.details)}</ul><p>${e(project.outcomeDetail)}</p></details>
</article>`;
const features = projects => `<div class="feature-list">${projects.map(feature).join('')}</div>`;
const lineAction = data.lineUrl ? `<a class="contact-button line-button" href="${e(data.lineUrl)}" target="_blank" rel="noopener">${e(data.lineLabel || '加入我的 LINE')} ${arrow}</a>` : '';
const siteUrl = new URL(data.siteUrl);
if (siteUrl.protocol !== 'https:') throw new Error('siteUrl 必須是 HTTPS');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('請填入有效的 email');
const description = `${data.name}（${data.englishName}）的個人履歷。${data.focus}。${data.intro}`;
const [englishFirst, ...englishRest] = data.englishName.split(/\s+/);
const englishLast = englishRest.join(' ');
const structured = JSON.stringify({
  '@context':'https://schema.org',
  '@type':'ProfilePage',
  name:`${data.name}｜${data.englishName}`,
  url:data.siteUrl,
  dateModified:data.updatedAt,
  mainEntity:{
    '@type':'Person',
    name:data.name,
    alternateName:[data.englishName, data.romanizedName],
    jobTitle:data.role,
    url:data.siteUrl,
    email:data.email,
    sameAs:[data.github],
    knowsAbout:data.skills.flatMap(skill => skill.items),
    alumniOf:{'@type':'CollegeOrUniversity',name:data.education.school}
  }
}).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f4f2ed">
  <title>${e(data.englishName)}｜${e(data.name)}・系統開發與研究</title>
  <meta name="description" content="${e(description)}">
  <link rel="canonical" href="${e(data.siteUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:title" content="${e(data.englishName)}｜${e(data.focus)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:url" content="${e(data.siteUrl)}">
  <meta property="og:image" content="${e(new URL('assets/portrait.jpg', siteUrl).href)}">
  <meta property="og:image:alt" content="${e(data.name)}的彩色個人照片">
  <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./assets/style.css">
  <script type="application/ld+json">${structured}</script>
  <script src="./assets/app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">跳至主要內容</a>
  <header class="site-header">
    <a class="brand" href="#" aria-label="${e(data.englishName)}，返回頂部"><strong>CHANDLAR</strong><span>LEE</span></a>
    <nav class="desktop-nav" aria-label="主要導覽"><a href="#now">現在</a><a href="#auo">友達</a><a href="#university">大學</a><a href="#contact">聯絡</a></nav>
    <div class="header-actions"><button type="button" data-print>儲存 PDF</button><button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="開啟導覽選單"><span></span><span></span></button></div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="手機導覽" hidden><a href="#now">現在</a><a href="#auo">友達</a><a href="#university">大學</a><a href="#contact">聯絡</a></nav>
  </header>
  <main id="main">
    <section class="hero">
      <div class="hero-glow glow-one"></div><div class="hero-glow glow-two"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">SYSTEMS · RESEARCH · REAL-WORLD IMPACT</p>
          <h1><span>${e(englishFirst)}</span><span>${e(englishLast)}</span></h1>
          <p class="legal-name">${e(data.name)} <span>/</span> ${e(data.romanizedName)}</p>
          <p class="hero-statement">把複雜的現場，<br><em>做成直覺的系統。</em></p>
          <p class="hero-intro">${e(data.intro)}</p>
          <div class="hero-actions"><a class="primary-button" href="#now">沿著歷程認識我 <span aria-hidden="true">↓</span></a><a href="mailto:${e(data.email)}">直接聯絡 ${arrow}</a></div>
        </div>
        <div class="hero-visual">
          <div class="portrait-shell"><img src="./assets/portrait.jpg" alt="${e(data.name)}的彩色個人照片" width="333" height="388" fetchpriority="high"></div>
          <div class="orbit-label label-a">BUILD<br><b>醫療系統</b></div>
          <div class="orbit-label label-b">RESEARCH<br><b>可信 AI</b></div>
        </div>
      </div>
      <div class="capability-rail">
        ${data.skills.map((skill, index) => `<div><span>0${index + 1}</span><strong>${e(skill.title)}</strong><p>${e(skill.items.slice(0,3).join(' · '))}</p></div>`).join('')}
      </div>
    </section>

    <section class="story-opening" id="story">
      <p class="eyebrow">ONE CONTINUOUS JOURNEY</p>
      <h2>不是把經歷分成幾格，<br>而是看每一步如何走到現在。</h2>
      <p>${e(data.about)}</p>
    </section>

    <section class="journey" aria-label="學習與工作歷程">
      <div class="journey-track">
        <article class="chapter chapter-now" id="now" data-reveal>
          <div class="chapter-marker"><span>NOW</span></div>
          <div class="chapter-content">
            <p class="chapter-kicker">現在 · ${e(data.education.graduate.school)}</p>
            <h2>研究與開發，<br><em>同時面向真實使用者。</em></h2>
            <p class="chapter-lead">${e(data.education.graduate.department)}在學。參與醫療服務的多端系統，也投入釣魚網站偵測論文，讓實作與研究互相驗證。</p>
            <div class="chapter-note"><span>RESEARCH FOCUS</span>${tags(data.education.graduate.research)}</div>
            ${features(graduateProjects)}
          </div>
        </article>

        <article class="chapter chapter-auo" id="auo" data-reveal>
          <div class="chapter-marker"><span>AUO</span></div>
          <div class="chapter-content">
            <p class="chapter-kicker">${e(data.experience[1].period)} · ${e(data.experience[1].englishCompany)}</p>
            <h2>走進製造現場，<br><em>讓資料真正開始流動。</em></h2>
            <p class="chapter-lead">${e(data.experience[1].description)}</p>
            <ul class="chapter-points">${list(data.experience[1].points)}</ul>
            ${features(auoProjects)}
          </div>
        </article>

        <article class="chapter chapter-university" id="university" data-reveal>
          <div class="chapter-marker"><span>NUTC</span></div>
          <div class="chapter-content">
            <p class="chapter-kicker">2025.06 畢業 · ${e(data.education.school)}</p>
            <h2>從工程底層出發，<br><em>建立分析問題的方法。</em></h2>
            <p class="chapter-lead">${e(data.education.department.replace('｜2025.06 畢業',''))}。${e(data.education.award)}。</p>
            ${features(universityProjects)}
            <div class="foundation-grid">
              <div><span>LEADERSHIP</span><ul>${list(data.education.activities)}</ul></div>
              <div><span>CERTIFICATION</span><ul>${list(data.education.certificates)}</ul></div>
            </div>
          </div>
        </article>

        <article class="chapter chapter-contact" id="contact" data-reveal>
          <div class="chapter-marker"><span>NEXT</span></div>
          <div class="chapter-content">
            <p class="chapter-kicker">THE NEXT CHAPTER</p>
            <h2>下一個值得解決的問題，<br><em>也許可以一起完成。</em></h2>
            <p class="chapter-lead">歡迎交流醫療資訊、系統開發、資料分析、研究或合作機會。</p>
            <div class="contact-actions">
              <a class="contact-button email-button" href="mailto:${e(data.email)}">${e(data.email)} ${arrow}</a>
              ${lineAction}
              <a class="contact-button ghost-button" href="${e(data.github)}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a>
              <button class="contact-button ghost-button" type="button" data-copy="${e(data.email)}">複製信箱</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
  <footer class="site-footer"><span>© ${e(data.updatedAt.slice(0,4))} ${e(data.englishName)}</span><div><a href="./editor/">內容管理</a><button type="button" data-print>列印 / PDF</button><a href="#">回到頂部 ↑</a></div></footer>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
</body>
</html>`;

const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root)) throw new Error('Unsafe output path');
await rm(output, {recursive:true, force:true});
await mkdir(path.join(output, 'assets'), {recursive:true});
await mkdir(path.join(output, 'papers'), {recursive:true});
await mkdir(path.join(output, 'editor'), {recursive:true});
await writeFile(path.join(output, 'index.html'), html);
for (const asset of ['style.css','app.js','favicon.svg','portrait.jpg']) await copyFile(path.join(root,'src',asset),path.join(output,'assets',asset));
await copyFile(path.join(root,'src/papers/automotive-shock-absorber-spring-quality.pdf'),path.join(output,'papers/automotive-shock-absorber-spring-quality.pdf'));
for (const asset of ['editor.html','editor.js','editor.css']) await copyFile(path.join(root,'src',asset),path.join(output,'editor',asset === 'editor.html' ? 'index.html' : asset));
await copyFile(path.join(root,'content/resume.json'),path.join(output,'editor/resume.json'));
await writeFile(path.join(output,'.nojekyll'),'');
await writeFile(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',siteUrl).href}\n`);
await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${e(data.siteUrl)}</loc><lastmod>${e(data.updatedAt)}</lastmod></url></urlset>`);
await writeFile(path.join(output,'404.html'),`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>找不到頁面｜${e(data.englishName)}</title><style>body{background:#f4f2ed;color:#171923;font:18px/1.8 system-ui;padding:15vh 8vw}a{color:inherit}h1{font-size:clamp(32px,8vw,64px)}</style><p>404 / PAGE NOT FOUND</p><h1>這一頁暫時迷路了。</h1><a href="${e(data.siteUrl)}">回到履歷首頁 ↗</a></html>`);
for (const name of ['履歷網頁.html',...Array.from({length:8},(_,index)=>`履歷網頁${index+2}.html`)]) await writeFile(path.join(output,name),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./"><meta name="viewport" content="width=device-width,initial-scale=1"><title>前往新版履歷</title><a href="./">前往新版個人履歷 →</a></html>');
console.log('Built dist/ — continuous journey resume, editor, papers and deployment assets.');
