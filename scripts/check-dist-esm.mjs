import { strict as assert } from 'node:assert'

const mod = await import('../dist/elemental.js')

assert.equal(typeof mod.def, 'function')
assert.equal(typeof mod.el, 'function')
assert.equal(typeof mod.txt, 'function')

console.log('ESM dist import OK')
