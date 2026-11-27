// Objava na GitHub Pages kao čist javni snimak (G-3495): javni `origin/main` nosi JEDAN komit sa stablom lokalnog `main`,
// bez istorije (stara istorija sadrži povučene privatne fotografije i ostaje samo lokalno / u privatnom bundle-u).
//   node tools/objavi-cisto.mjs            : testovi → orfan komit sa stablom HEAD → clean-public-main → push --force-with-lease na origin main → provera ls-remote
//   node tools/objavi-cisto.mjs --proba    : sve osim push-a
// Lokalni `main` se nikada ne gura. Prljavo stablo, crven test ili pomeren udaljeni main zaustavljaju objavu.
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...a) => execFileSync('git', a, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8').trim();
const proba = process.argv.includes('--proba');

if (git('status', '--porcelain')) throw new Error('Radno stablo nije čisto — komituj ili skloni izmene pre objave.');
const grana = git('rev-parse', '--abbrev-ref', 'HEAD');
if (grana !== 'main') throw new Error(`Objava ide sa lokalnog main, a HEAD je ${grana}.`);
const head = git('rev-parse', 'HEAD'), tree = git('rev-parse', 'HEAD^{tree}');
const poruka = git('log', '-1', '--format=%s');

const test = spawnSync('npm', ['test'], { cwd: root, shell: true, encoding: 'utf8' });
const zbir = (test.stdout + test.stderr).match(/ℹ pass (\d+)[\s\S]*?ℹ fail (\d+)/);
if (test.status !== 0 || !zbir || zbir[2] !== '0') throw new Error('npm test nije zelen — nema objave.\n' + (test.stdout + test.stderr).split('\n').filter(l => /^✖|^ℹ (pass|fail)/.test(l)).join('\n'));

const udaljeno = git('ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0];
if (!udaljeno) throw new Error('origin/main nije pročitan.');
const udaljenoTree = (() => { try { git('fetch', '-q', 'origin', 'main'); return git('rev-parse', 'FETCH_HEAD^{tree}'); } catch { return ''; } })();
if (udaljenoTree === tree) { console.log(JSON.stringify({ ok: true, nista: 'javno stablo već jednako lokalnom', udaljeno, tree })); process.exit(0); }

const datum = new Date().toISOString().slice(0, 10);
const snimak = git('-c', 'user.name=Semir Poturak', '-c', 'user.email=scumutator@gmail.com', 'commit-tree', tree, '-m',
  `Javni snimak ${datum} iz main ${head.slice(0, 7)}: ${poruka}`);
git('update-ref', 'refs/heads/clean-public-main', snimak);
const izlaz = { ok: true, main: head.slice(0, 10), tree: tree.slice(0, 10), snimak: snimak.slice(0, 10), prethodniJavni: udaljeno.slice(0, 10), testovi: `pass ${zbir[1]} fail ${zbir[2]}`, push: proba ? 'proba — nije gurano' : null };
if (!proba) {
  const p = spawnSync('git', ['push', `--force-with-lease=refs/heads/main:${udaljeno}`, 'origin', 'clean-public-main:main'], { cwd: root, encoding: 'utf8' });
  if (p.status !== 0) throw new Error('push nije prošao:\n' + p.stdout + p.stderr);
  const posle = git('ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0];
  if (posle !== snimak) throw new Error(`posle push-a udaljeni main je ${posle}, očekivano ${snimak}`);
  izlaz.push = `origin/main = ${posle.slice(0, 10)} (jedan komit, bez istorije)`;
}
console.log(JSON.stringify(izlaz));
