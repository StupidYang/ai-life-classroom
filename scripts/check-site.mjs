// Dependency-free preflight for local editing and GitHub Pages deployment.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, createContext, runInContext } from 'node:vm';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(root, 'dist');
const html = readFileSync(resolve(site, 'index.html'), 'utf8');
const assets = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)]
  .map(match => match[1]).filter(value => !value.startsWith('data:'));
for (const asset of assets) {
  assert(!/^(?:https?:)?\/\//.test(asset), `Offline page contains external dependency: ${asset}`);
  const target = resolve(site, asset);
  const local = relative(site, target);
  assert(!local.startsWith('..') && !isAbsolute(local), `Asset escapes dist: ${asset}`);
  assert(existsSync(target), `Missing asset: ${asset}`);
}
for (const name of readdirSync(site).filter(name => name.endsWith('.js'))) {
  new Script(readFileSync(resolve(site, name), 'utf8'), { filename: name });
}

const context = createContext({});
const dataFiles = ['data.js', 'demo-data.js', 'trust-data.js'];
for (const name of dataFiles) runInContext(readFileSync(resolve(site, name), 'utf8'), context, { timeout: 1000 });
const data = JSON.parse(runInContext('JSON.stringify({lessons:LESSONS, order:COURSE_ORDER, core:CORE_LESSONS, demos:DEMOS, labs:TRUST_CASES, templates:SCENES})', context));
const unique = (items, label) => assert.equal(new Set(items).size, items.length, `Duplicate ${label}`);
unique(data.order, 'lesson order ID');
assert.equal(data.order.length, data.lessons.length, 'Lesson order omits content');
for (const id of [...data.order, ...data.core]) assert(data.lessons[id], `Unknown lesson ID: ${id}`);
for (const lesson of data.lessons) {
  assert(lesson.title && lesson.sections.length && lesson.prompt, 'Lesson missing teaching content');
  assert(Number.isInteger(lesson.quiz.answer) && lesson.quiz.options[lesson.quiz.answer], `Invalid quiz: ${lesson.title}`);
}
unique(data.demos.map(item => item.slug), 'demo slug');
unique(data.labs.map(item => item.id), 'verification exercise ID');
unique(data.templates.map(item => item.id), 'template ID');
for (const demo of data.demos) assert(demo.options[demo.correct] && demo.result, `Incomplete demo: ${demo.slug}`);
for (const lab of data.labs) {
  unique(lab.sources.map(item => item.id), `source in ${lab.id}`);
  for (const claim of lab.claims) assert(lab.sources.some(source => source.id === claim[3]), `Unknown evidence reference: ${lab.id}/${claim[3]}`);
}
console.log(`Site checks passed: ${assets.length} local assets; ${data.lessons.length} lessons; ${data.demos.length} demos; ${data.labs.length} verification exercises; ${data.templates.length} templates.`);
console.log('This preflight checks structure and syntax. Open the website to check layout, interactions, and factual accuracy.');
