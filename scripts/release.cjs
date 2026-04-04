const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const allowedReleaseTypes = new Set(['patch', 'minor', 'major'])
const releaseType = process.argv[2]

if (!allowedReleaseTypes.has(releaseType)) {
  console.error('Usage: pnpm release <patch|minor|major>')
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

if (!process.env.NPM_TOKEN) {
  console.error('Refusing to release without NPM_TOKEN set.')
  process.exit(1)
}

run('npm', ['whoami'])
run('npm', ['version', releaseType, '--no-git-tag-version'])
run('pnpm', ['install', '--lockfile-only'])
run('pnpm', ['release:check'])

const packageJsonPath = path.resolve(__dirname, '../package.json')
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const tag = `v${version}`

run('git', ['add', 'package.json', 'pnpm-lock.yaml'])
run('git', ['commit', '-m', `chore(release): ${tag}`])
run('git', ['tag', '-a', tag, '-m', tag])
run('npm', ['publish', '--provenance=false'])
run('git', ['push', '--follow-tags'])
