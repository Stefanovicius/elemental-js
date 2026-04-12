const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const bundlePath = path.resolve(__dirname, '../dist/elemental.min.js')
const source = fs.readFileSync(bundlePath, 'utf8')

const windowObject = {}
const context = {
  window: windowObject,
  self: windowObject,
  globalThis: windowObject
}

vm.runInNewContext(source, context)

assert.equal(typeof windowObject.def, 'function')
assert.equal(typeof windowObject.derive, 'function')
assert.equal(typeof windowObject.el, 'function')
assert.equal(typeof windowObject.txt, 'function')

console.log('Browser dist globals OK')
