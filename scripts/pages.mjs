// Optional maintenance helper. Uses an existing Git credential in memory only.
// Never prints or persists the credential. No dependency or token setup required
// if this machine already has HTTPS Git access to the repository.
import { spawnSync } from 'node:child_process';
const mode = process.argv[2] || 'status';
if (!['status', 'enable', 'runs'].includes(mode)) throw new Error('Usage: node scripts/pages.mjs [status|enable|runs]');
const credential = spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' }, windowsHide: true });
if (credential.status !== 0) { console.error('No saved GitHub credential available. Configure Pages through repository Settings → Pages.'); process.exit(1); }
const fields = Object.fromEntries(credential.stdout.trim().split(/\r?\n/).map(line => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
if (!fields.password) { console.error('Git credential did not contain an access token.'); process.exit(1); }
const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${fields.password}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'resume-pages-maintenance' };
const api = async (suffix = '/pages', method = 'GET', body) => {
  const res = await fetch(`https://api.github.com/repos/fr3636k/resume${suffix}`, { method, headers: { ...headers, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const raw = await res.text();
  let data; try { data = JSON.parse(raw); } catch { data = {}; }
  if (!res.ok) { console.error(JSON.stringify({ status: res.status, message: data.message || res.statusText })); process.exit(1); }
  return data;
};
if (mode === 'enable') {
  const existing = await fetch('https://api.github.com/repos/fr3636k/resume/pages', { headers });
  if (![200,404].includes(existing.status)) { console.error(`Cannot determine Pages configuration: HTTP ${existing.status}`); process.exit(1); }
  const data = await api('/pages', existing.status === 404 ? 'POST' : 'PUT', { build_type: 'workflow' });
  console.log(JSON.stringify({ configured: true, url: data.html_url || 'https://fr3636k.github.io/resume/', build_type: 'workflow' }));
} else if (mode === 'runs') {
  const data = await api('/actions/workflows/deploy.yml/runs?per_page=3');
  console.log(JSON.stringify(data.workflow_runs.map(r => ({ id:r.id, sha:r.head_sha, status:r.status, conclusion:r.conclusion, url:r.html_url }))));
} else {
  const data = await api();
  console.log(JSON.stringify({ url: data.html_url, status: data.status, build_type: data.build_type, https_enforced: data.https_enforced }));
}
