#!/usr/bin/env node
/*
 * Derive Find Relief subpages from the refined index plain.html.
 *
 * /find-relief/talk-to-a-doctor and /find-relief/how-to-take-linzess are not
 * standalone live pages — they redirect to #talktoadoctor / #howtotake on the
 * single /find-relief page. Each subpage is therefore the index with the other
 * anchor's content removed, the hero retitled, and the section-nav cross-link
 * pointed at the sibling subpage.
 *
 * Top-level sections are blank-line separated `<div> ... </div>` blocks.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspace = process.env.WORKSPACE_PATH || resolve(__dirname, '../..');
const baseDir = join(workspace, 'content/linzess/migration-dinesh/find-relief');
const indexPath = join(baseDir, 'index.plain.html');

const raw = readFileSync(indexPath, 'utf-8').replace(/\n$/, '');

// Split into top-level sections on blank lines between a `</div>` and `<div>`.
// The file is a flat list of `<div> ... </div>` blocks separated by blank lines.
const sections = raw.split(/\n\n(?=<div>\n)/);

// Identify each section by a stable marker in its content.
const find = (marker) => {
  const idx = sections.findIndex((s) => s.includes(marker));
  if (idx === -1) throw new Error(`Section not found for marker: ${marker}`);
  return sections[idx];
};

const heroSection = find('class="hero no-padding');           // hero + section-nav + hero-container meta
const talkSection = find('classes_customClass</div>\n        <div>find-relief-talk'); // talk group
const howToVideoSection = find('id="howtotake"');             // howtotake video/cards/savings group start
const instructionsSection = find('find-relief-instructions');
const dosingPanels = sections.filter((s) => s.includes('find-relief-dosing-panel'));
const savingsToutSection = sections.find((s) => s.includes('find-relief-savings-tout'));
const bottomNavSection = find('find-relief-bottom-nav-section');
const isiSection = find('classes_customClass</div>\n        <div>isi</div>');
const safetyBarSection = find('class="safety-bar split"');
const metadataSection = find('class="metadata"');

// howtotake content sections (everything between #howtotake start and bottom-nav,
// excluding talk): the howtotake video/cards/savings-tout group, instructions, dosing panels.
const howToGroup = [howToVideoSection, instructionsSection, ...dosingPanels, savingsToutSection]
  .filter(Boolean);

function retitleHero(heroBlock, title) {
  // hero H1 is the only <h1> in the hero section
  return heroBlock.replace(/<h1 id="find-relief">[^<]*<\/h1>/, `<h1 id="find-relief">${title}</h1>`);
}

function rewriteNav(heroBlock, { selfAnchor, siblingAnchor, siblingPath }) {
  // Keep self anchor as #anchor; rewrite sibling anchor link to the sibling page path.
  return heroBlock.replace(
    new RegExp(`<a href="${siblingAnchor}">${siblingAnchor}</a>`),
    `<a href="${siblingPath}">${siblingPath}</a>`,
  );
}

function buildPage(parts) {
  return `${parts.join('\n\n')}\n`;
}

// --- talk-to-a-doctor ---
let talkHero = retitleHero(heroSection, 'Talk to a Doctor');
talkHero = rewriteNav(talkHero, {
  selfAnchor: '#talktoadoctor',
  siblingAnchor: '#howtotake',
  siblingPath: '/find-relief/how-to-take-linzess',
});
const talkPage = buildPage([
  talkHero,
  talkSection,
  bottomNavSection,
  isiSection,
  safetyBarSection,
  metadataSection,
]);

// --- how-to-take-linzess ---
let howHero = retitleHero(heroSection, 'How to Take LINZESS');
howHero = rewriteNav(howHero, {
  selfAnchor: '#howtotake',
  siblingAnchor: '#talktoadoctor',
  siblingPath: '/find-relief/talk-to-a-doctor',
});
const howPage = buildPage([
  howHero,
  ...howToGroup,
  bottomNavSection,
  isiSection,
  safetyBarSection,
  metadataSection,
]);

mkdirSync(baseDir, { recursive: true });
writeFileSync(join(baseDir, 'talk-to-a-doctor.plain.html'), talkPage, 'utf-8');
writeFileSync(join(baseDir, 'how-to-take-linzess.plain.html'), howPage, 'utf-8');

console.log('Wrote:');
console.log(`  ${join(baseDir, 'talk-to-a-doctor.plain.html')} (${talkPage.split('\n').length} lines)`);
console.log(`  ${join(baseDir, 'how-to-take-linzess.plain.html')} (${howPage.split('\n').length} lines)`);
