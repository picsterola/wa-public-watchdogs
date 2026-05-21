#!/usr/bin/env node
/**
 * Kill switch for the live site. Commit a `.OFFLINE` file at the repo root
 * to make the deploy workflow publish a minimal placeholder page instead of
 * the full registry. Remove the file to restore normal deploys.
 *
 * Usage:
 *   npm run offline   -> creates .OFFLINE, commits, pushes
 *   npm run online    -> removes .OFFLINE, commits, pushes
 *
 * The deploy workflow checks for this file before building. See
 * .github/workflows/deploy.yml and .github/offline.html.
 */
import { existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';

const mode = process.argv.includes('--offline')
  ? 'offline'
  : process.argv.includes('--online')
    ? 'online'
    : null;

if (!mode) {
  console.error('Usage: toggle-offline.mjs --offline | --online');
  process.exit(1);
}

const FLAG = '.OFFLINE';

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

if (mode === 'offline') {
  if (existsSync(FLAG)) {
    console.log('[offline] .OFFLINE already present. Nothing to do.');
    process.exit(0);
  }
  writeFileSync(FLAG, `Created ${new Date().toISOString()}\nSite is paused. Remove this file (npm run online) to restore the full deploy.\n`);
  console.log('[offline] Created .OFFLINE flag.');
  run('git add .OFFLINE');
  run('git commit -m "Kill switch: take site offline"');
  run('git push origin main');
  console.log('\n[offline] Done. Deploy workflow will publish the offline placeholder in ~45s.');
} else {
  if (!existsSync(FLAG)) {
    console.log('[online] .OFFLINE not present. Nothing to do.');
    process.exit(0);
  }
  unlinkSync(FLAG);
  console.log('[online] Removed .OFFLINE flag.');
  run('git add -A .OFFLINE');
  run('git commit -m "Kill switch: bring site back online"');
  run('git push origin main');
  console.log('\n[online] Done. Full site will redeploy in ~45s.');
}
