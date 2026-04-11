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

const run = (command, args) =>
  execFileSync(command, args, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  })

const capture = (command, args) =>
  execFileSync(command, args, {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8'
  }).trim()

const workingTreeStatus = capture('git', ['status', '--porcelain'])
if (workingTreeStatus) {
  console.error('Refusing to release from a dirty worktree.')
  process.exit(1)
}

const currentBranch = capture('git', ['branch', '--show-current'])
if (currentBranch !== 'main') {
  console.error('Refusing to release outside the main branch.')
  process.exit(1)
}

run('git', ['fetch', 'origin', 'main', 'dev'])

const ahead = capture('git', ['rev-list', '--count', 'origin/main..main'])
const behindMain = capture('git', ['rev-list', '--count', 'main..origin/main'])
if (ahead !== '0' || behindMain !== '0') {
  console.error(`main is out of sync with origin/main (${ahead} ahead, ${behindMain} behind). Push or pull first.`)
  process.exit(1)
}

if (!hotfix) {
  const behindDev = capture('git', ['rev-list', '--count', 'main..origin/dev'])
  if (behindDev !== '0') {
    console.error(`main is ${behindDev} commit(s) behind origin/dev. Merge dev first (or use --hotfix).`)
    process.exit(1)
  }
}

if (!process.env.NPM_TOKEN) {
  console.error('Refusing to release without NPM_TOKEN set.')
  process.exit(1)
}

run('pnpm', ['release:check'])

run('npm', ['version', releaseType, '--no-git-tag-version'])
run('pnpm', ['install', '--lockfile-only'])

const packageJsonPath = path.resolve(__dirname, '../package.json')
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const tag = `v${version}`

const readmePath = path.resolve(__dirname, '../README.md')
const readme = fs.readFileSync(readmePath, 'utf8')
const updatedReadme = readme.replace(/elemental-lite@[^/]+/g, `elemental-lite@${version}`)
if (updatedReadme !== readme) fs.writeFileSync(readmePath, updatedReadme)

try {
  run('git', ['add', 'package.json', 'pnpm-lock.yaml', 'README.md'])
  run('git', ['commit', '-m', `chore(release): ${tag}`])
  run('git', ['tag', '-a', tag, '-m', tag])
  run('npm', ['publish', '--provenance=false'])
  run('git', ['push', '--follow-tags'])
} catch (error) {
  console.error('Release failed, rolling back…')
  try { run('git', ['tag', '-d', tag]) } catch {}
  try { run('git', ['reset', '--hard', 'HEAD~1']) } catch {
    run('git', ['checkout', '--', 'package.json', 'pnpm-lock.yaml', 'README.md'])
  }
  throw error
}
