const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const allowedReleaseTypes = new Set(['patch', 'minor', 'major'])
const args = process.argv.slice(2)
const hotfix = args.includes('--hotfix')
const releaseType = args.find(a => a !== '--hotfix')

if (!allowedReleaseTypes.has(releaseType)) {
  console.error('Usage: pnpm release <patch|minor|major> [--hotfix]')
  process.exit(1)
}

const root = path.resolve(__dirname, '..')

const run = (command, args) =>
  execFileSync(command, args, { stdio: 'inherit', cwd: root })

const capture = (command, args) =>
  execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim()

const pass = (msg) => console.log(`\x1b[32m\u2713\x1b[0m ${msg}`)
const fail = (msg) => { console.error(`\x1b[31m\u2717 ${msg}\x1b[0m`); process.exit(1) }

// --- Pre-flight checks ---

const workingTreeStatus = capture('git', ['status', '--porcelain'])
if (workingTreeStatus) fail('Dirty worktree. Commit or stash first.')
pass('Clean worktree')

const currentBranch = capture('git', ['branch', '--show-current'])
if (currentBranch !== 'main') fail('Not on main branch.')
pass('On main branch')

capture('git', ['fetch', 'origin', 'main', 'dev'])

const ahead = capture('git', ['rev-list', '--count', 'origin/main..main'])
const behindMain = capture('git', ['rev-list', '--count', 'main..origin/main'])
if (ahead !== '0' || behindMain !== '0') fail(`main out of sync with origin (${ahead} ahead, ${behindMain} behind). Push or pull first.`)
pass('Synced with origin/main')

if (!hotfix) {
  const behindDev = capture('git', ['rev-list', '--count', 'main..origin/dev'])
  if (behindDev !== '0') fail(`main is ${behindDev} commit(s) behind origin/dev. Merge dev first (or use --hotfix).`)
  pass('dev merged into main')
}

if (!process.env.NPM_TOKEN) fail('NPM_TOKEN not set.')
pass('NPM_TOKEN set')

// --- Test ---

pass('Running release checks…')
run('pnpm', ['release:check'])
pass('All checks passed')

// --- Bump ---

run('npm', ['version', releaseType, '--no-git-tag-version'])
run('pnpm', ['install', '--lockfile-only'])

const packageJsonPath = path.resolve(root, 'package.json')
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const tag = `v${version}`
pass(`Bumped to ${tag}`)

const readmePath = path.resolve(root, 'README.md')
const readme = fs.readFileSync(readmePath, 'utf8')
const updatedReadme = readme.replace(/elemental-lite@[^/]+/g, `elemental-lite@${version}`)
if (updatedReadme !== readme) fs.writeFileSync(readmePath, updatedReadme)

// --- Publish ---

try {
  run('git', ['add', 'package.json', 'pnpm-lock.yaml', 'README.md'])
  run('git', ['commit', '-m', `chore(release): ${tag}`])
  run('git', ['tag', '-a', tag, '-m', tag])
  run('npm', ['publish', '--provenance=false'])
  run('git', ['push', '--follow-tags'])
  pass(`Released ${tag}`)
} catch (error) {
  console.error(`\x1b[31m\u2717 Release failed, rolling back\u2026\x1b[0m`)
  try { run('git', ['tag', '-d', tag]) } catch {}
  try { run('git', ['reset', '--hard', 'HEAD~1']) } catch {
    run('git', ['checkout', '--', 'package.json', 'pnpm-lock.yaml', 'README.md'])
  }
  throw error
}
