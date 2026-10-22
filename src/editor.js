const labels = {
  profile: '基本資料', experience: '工作經歷', projects: '專案', skills: '技能', education: '學歷與證照',
  name: '中文姓名', englishName: '英文姓名', initials: '姓名縮寫', role: '職稱', focus: '專業定位',
  headline: '主標題', intro: '首頁簡介', about: '關於我', email: 'Email', phone: '電話', showPhone: '公開顯示電話',
  github: 'GitHub 個人頁', siteUrl: '網站網址', updatedAt: '更新日期', company: '單位／公司', englishCompany: '英文名稱',
  period: '期間', description: '說明', points: '工作重點', id: '識別代碼', number: '排序編號', category: '分類代碼',
  categoryLabel: '分類名稱', title: '標題', outcome: '主要成果', outcomeDetail: '成果補充', tags: '技術標籤',
  details: '工作內容', paper: '論文路徑', paperLabel: '論文按鈕文字', items: '項目', graduate: '研究所',
  school: '學校', department: '系所／畢業資訊', status: '狀態', research: '研究方向', activities: '在學活動',
  award: '獎項與成績', certificates: '專業證照'
};
const sectionKeys = ['profile', 'experience', 'projects', 'skills', 'education'];
const profileKeys = ['name','englishName','initials','role','focus','headline','intro','about','email','phone','showPhone','github','siteUrl','updatedAt'];
const form = document.querySelector('#editor-form');
const status = document.querySelector('#status');
const nav = document.querySelector('#section-nav');
const toastEl = document.querySelector('#toast');
let model;
let sourceModel;
let saveTimer;

const label = key => labels[key] || key;
const clone = value => JSON.parse(JSON.stringify(value));
const toast = message => {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2600);
};
const persist = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('resume-editor-draft', JSON.stringify(model));
    status.textContent = `草稿已自動儲存｜${new Date().toLocaleTimeString('zh-TW', {hour:'2-digit', minute:'2-digit'})}`;
  }, 250);
};
const setAt = (path, value) => {
  let current = model;
  path.slice(0, -1).forEach(key => current = current[key]);
  current[path.at(-1)] = value;
  persist();
};
const removeAt = path => {
  let current = model;
  path.slice(0, -1).forEach(key => current = current[key]);
  current.splice(path.at(-1), 1);
  render();
  persist();
};
const moveAt = (path, direction) => {
  let current = model;
  path.slice(0, -1).forEach(key => current = current[key]);
  const index = path.at(-1);
  const target = index + direction;
  if (target < 0 || target >= current.length) return;
  [current[index], current[target]] = [current[target], current[index]];
  render();
  persist();
};
const inputType = key => key === 'email' ? 'email' : key === 'updatedAt' ? 'date' : ['github','siteUrl','paper'].includes(key) ? 'url' : 'text';
const isLong = (key, value) => ['intro','about','description','outcomeDetail'].includes(key) || String(value).length > 90;

function scalarField(key, value, path) {
  const field = document.createElement('label');
  field.className = `field${isLong(key, value) ? ' wide' : ''}`;
  const caption = document.createElement('span');
  caption.textContent = label(key);
  field.append(caption);
  if (typeof value === 'boolean') {
    field.classList.add('check-field');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = value;
    input.addEventListener('change', () => setAt(path, input.checked));
    field.prepend(input);
  } else {
    const input = document.createElement(isLong(key, value) ? 'textarea' : 'input');
    if (input.tagName === 'INPUT') input.type = inputType(key);
    input.value = value ?? '';
    input.addEventListener('input', () => setAt(path, input.value));
    field.append(input);
  }
  return field;
}

function primitiveArray(key, values, path) {
  const box = document.createElement('div');
  box.className = 'collection';
  const head = document.createElement('div');
  head.className = 'collection-header';
  head.innerHTML = `<h3>${label(key)}</h3>`;
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'add-button';
  add.textContent = '＋ 新增項目';
  add.addEventListener('click', () => { values.push(''); render(); persist(); });
  head.append(add);
  box.append(head);
  const list = document.createElement('div');
  list.className = 'primitive-list';
  values.forEach((value, index) => {
    const row = document.createElement('div');
    row.className = 'primitive-row';
    const input = document.createElement('input');
    input.value = value;
    input.setAttribute('aria-label', `${label(key)} ${index + 1}`);
    input.addEventListener('input', () => { values[index] = input.value; persist(); });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'mini danger';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `刪除${label(key)} ${index + 1}`);
    remove.addEventListener('click', () => removeAt([...path, index]));
    row.append(input, remove);
    list.append(row);
  });
  box.append(list);
  return box;
}

function objectFields(object, path) {
  const fields = document.createElement('div');
  fields.className = 'fields';
  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) fields.append(Array.isArray(value) && (value.length === 0 || typeof value[0] !== 'object') ? primitiveArray(key, value, [...path, key]) : objectArray(key, value, [...path, key]));
    else if (value && typeof value === 'object') fields.append(objectGroup(key, value, [...path, key]));
    else fields.append(scalarField(key, value, [...path, key]));
  });
  return fields;
}

function newItemFor(key, values) {
  if (key === 'projects') return {id:'',number:'',category:'system',categoryLabel:'',name:'',description:'',outcome:'',outcomeDetail:'',tags:[],paper:'',paperLabel:'',details:[]};
  if (values.length) {
    const item = clone(values[0]);
    Object.keys(item).forEach(field => {
      if (Array.isArray(item[field])) item[field] = [];
      else if (typeof item[field] === 'boolean') item[field] = false;
      else item[field] = '';
    });
    return item;
  }
  if (key === 'experience') return {company:'',englishCompany:'',role:'',period:'',description:'',points:[]};
  if (key === 'skills') return {number:'',title:'',description:'',items:[]};
  return {};
}

function objectArray(key, values, path) {
  const box = document.createElement('div');
  box.className = 'collection';
  const head = document.createElement('div');
  head.className = 'collection-header';
  head.innerHTML = `<h3>${label(key)}</h3>`;
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'add-button';
  add.textContent = `＋ 新增${label(key)}`;
  add.addEventListener('click', () => { values.push(newItemFor(key, values)); render(); persist(); });
  head.append(add);
  box.append(head);
  values.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    const itemHead = document.createElement('div');
    itemHead.className = 'item-head';
    itemHead.innerHTML = `<strong>${item.name || item.company || item.title || `${label(key)} ${index + 1}`}</strong>`;
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    [['↑',-1,'上移'],['↓',1,'下移']].forEach(([text,direction,name]) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'mini'; button.textContent = text; button.title = name;
      button.addEventListener('click', () => moveAt([...path, index], direction));
      actions.append(button);
    });
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'mini danger'; remove.textContent = '×'; remove.title = '刪除';
    remove.addEventListener('click', () => { if (confirm(`確定刪除「${item.name || item.company || label(key)}」？`)) removeAt([...path, index]); });
    actions.append(remove);
    itemHead.append(actions);
    card.append(itemHead, objectFields(item, [...path, index]));
    box.append(card);
  });
  return box;
}

function objectGroup(key, value, path) {
  const box = document.createElement('div');
  box.className = 'collection';
  const title = document.createElement('h3');
  title.className = 'group-title';
  title.textContent = label(key);
  box.append(title, objectFields(value, path));
  return box;
}

function render() {
  form.replaceChildren();
  nav.replaceChildren();
  sectionKeys.forEach(key => {
    const card = document.createElement('section');
    card.className = 'section-card';
    card.id = `edit-${key}`;
    const heading = document.createElement('h2');
    heading.textContent = label(key);
    card.append(heading);
    if (key === 'profile') {
      const profile = Object.fromEntries(profileKeys.filter(field => field in model).map(field => [field, model[field]]));
      card.append(objectFields(profile, []));
    } else if (Array.isArray(model[key])) {
      card.append(objectArray(key, model[key], [key]));
    } else {
      card.append(objectFields(model[key], [key]));
    }
    form.append(card);
    const link = document.createElement('a');
    link.href = `#edit-${key}`;
    link.textContent = label(key);
    nav.append(link);
  });
}

async function load() {
  const response = await fetch('./resume.json', {cache:'no-store'});
  if (!response.ok) throw new Error('無法讀取網站資料');
  sourceModel = await response.json();
  const draft = localStorage.getItem('resume-editor-draft');
  model = draft ? JSON.parse(draft) : clone(sourceModel);
  render();
  status.textContent = draft ? '已載入本機草稿' : '已載入網站版本';
}

document.querySelector('#download').addEventListener('click', () => {
  const blob = new Blob([`${JSON.stringify(model, null, 2)}\n`], {type:'application/json'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resume.json';
  link.click();
  URL.revokeObjectURL(link.href);
  toast('已下載 resume.json');
});
document.querySelector('#reset').addEventListener('click', () => {
  if (!confirm('確定捨棄本機草稿並還原為目前網站版本？')) return;
  model = clone(sourceModel);
  localStorage.removeItem('resume-editor-draft');
  render();
  status.textContent = '已還原網站版本';
});
document.querySelector('#import-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!imported.name || !Array.isArray(imported.projects) || !imported.education) throw new Error('資料結構不完整');
    model = imported;
    render();
    persist();
    toast('JSON 已匯入');
  } catch (error) {
    toast(`匯入失敗：${error.message}`);
  }
  event.target.value = '';
});
load().catch(error => { status.textContent = error.message; });
