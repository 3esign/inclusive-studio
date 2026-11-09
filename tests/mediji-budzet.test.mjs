import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, granica, BUDZET } from '../tools/mediji-budzet.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('budžet medija za Pages: slika ≤ 300 KB, video ≤ 2 MB, bilo koji praćeni fajl ≤ 1 MB', () => {
  assert.equal(granica('a/b.jpg'), BUDZET.slika);
  assert.equal(granica('a/b.mp4'), BUDZET.video);
  assert.equal(granica('atlas.html'), BUDZET.ostalo);
  const problemi = check(root);
  assert.deepEqual(problemi, [], 'preko budžeta: ' + problemi.map(p => `${p.file} ${p.bytes}`).join(', '));
});
