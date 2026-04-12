# Elemental.js Docs

`elemental-lite` is a tiny browser-only UI library built around five exports:

- `def` creates reactive values
- `derive` derives from multiple reactive sources
- `el` creates elements or selects existing DOM nodes
- `txt` creates reactive text nodes
- `parse` exposes the low-level template parser used by `el`

This document describes the current API as implemented.

## Installation

With npm:

```bash
npm install elemental-lite
```

With ESM:

```js
import { def, derive, el, txt } from 'elemental-lite'
```

With CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/elemental-lite/dist/elemental.min.js"></script>
```

CDN usage exposes `def`, `derive`, `el`, and `txt` on `window`.

## Quick Start

```html
<div id="counter"></div>
```

```js
import { def, el } from 'elemental-lite'

function Counter() {
  const count = def(0)
  return el`button onclick=${() => ++count.val}`('Count: ', count)
}

const [counter] = el('#counter')
counter.append(Counter())
```

## `def`

`def(initialValue)` creates a reactive value.

Primitives use `.val` as the current value:

```js
const count = def(0)
count.val = 1
```

Arrays are reactive proxies. They support direct array-style access and `.val` replacement:

```js
const list = def(['a', 'b'])
list.push('c')
list.val = ['x', 'y']
```

Objects are reactive proxies. You can mutate properties directly:

```js
const state = def({ name: 'Ada', done: false })
state.name = 'Grace'
state.val = { name: 'Linus', done: true }
```

When assigning to `.val` on an object reactive, pass a non-null object.

### Reading `.val`

For objects and arrays, `.val` returns the raw underlying data, not the proxy. This means mutations through `.val` bypass reactivity:

```js
const state = def({ count: 0 })
state.count = 1 // reactive — triggers subscribers
state.val.count = 2 // silent — bypasses the proxy
```

This is useful when you need a plain snapshot for serialization, comparison, or passing to external code.

### `subscribe()`

Every reactive supports `subscribe(callback)`.

```js
const count = def(0)
const unsubscribe = count.subscribe(() => {
  console.log(count.val)
})

count.val = 1
unsubscribe()
```

Updates are batched in a microtask, so multiple synchronous writes collapse into one subscriber flush.

### Derived Values

Use `.derive(fn)` to create derived reactives:

```js
const count = def(2)
const doubled = count.derive(value => value * 2)
```

You can also create a base reactive and multiple derived values in one call:

```js
const [count, doubled, tripled] = def(
  2,
  value => value * 2,
  value => value * 3
)
```

Derived values update automatically when their source changes.

Automatic DOM cleanup is built in. If a derived reactive is only used by DOM bindings created through this library, it is cleaned up when the owning DOM subtree is removed.

`dispose()` exists as an advanced escape hatch, but typical UI usage should not need it.

## `derive`

`derive(dependencies, handler)` creates a reactive derived from multiple sources:

```js
const firstName = def('Ada')
const lastName = def('Lovelace')
const fullName = derive([firstName, lastName], (first, last) => `${first} ${last}`)
```

The result updates when any dependency changes. Lifecycle cleanup follows the same rules as the `.derive()` method.

## `el`

`el` has two modes.

### 1. Element Creation

Use tagged template syntax to create an element factory:

```js
const button = el`button class="primary"`('Click me')
```

Interpolations inside the template become props:

```js
const active = def(true)
const title = def('Save')

const button = el`button disabled=${active} title=${title}`('Save')
```

Children are passed by calling the returned function:

```js
const view = el`div class="panel"`(el`h1`('Hello'), el`p`('World'))
```

### 2. DOM Selection

When called as a normal function, `el(selector)` queries the DOM and always returns an array of matched elements.

```js
const items = el('.item')
const [root] = el('#app')
```

If nothing matches, it returns an empty array:

```js
const nodes = el('.missing') // []
```

## Props

Static props:

```js
el`div class="card" id="profile"`()
```

Boolean props:

```js
const disabled = def(false)
el`button disabled=${disabled}`('Submit')
```

Reactive string-like props:

```js
const first = def('Ada')
const last = def('Lovelace')

el`div data-name="${first} ${last}"`()
```

Event handlers use `on...` props:

```js
el`button onclick=${() => console.log('clicked')}`('Click')
```

Class object props:

```js
el`div class=${{ card: true, active: false, hidden: false }}`()
```

Only keys with truthy values are included. This works with reactive objects whose values are all booleans:

```js
const classes = def({ card: true, active: false })
el`div class=${classes}`()
classes.active = true
```

It also works with plain objects containing reactive boolean values:

```js
const isActive = def(false)
const isHidden = def(false)
el`div class=${{ card: true, active: isActive, hidden: isHidden }}`()
isActive.val = true
```

Style object props:

```js
el`div style=${{ color: 'red', fontSize: '14px' }}`()
```

CamelCase keys are converted to kebab-case. This works with reactive objects whose values are all strings or numbers:

```js
const styles = def({ color: 'red' })
el`div style=${styles}`()
styles.color = 'blue'
```

Plain objects with reactive string or number values also work:

```js
const color = def('red')
const fontSize = def('14px')
el`div style=${{ color, fontSize }}`()
color.val = 'blue'
```

## Children

Children can be:

- strings
- DOM nodes
- arrays of children
- reactive values

Examples:

```js
el`div`('Hello')
el`div`(el`span`('Nested'))
el`div`(['A', ' ', 'B'])
el`div`(def('Reactive text'))
```

Reactive object children use JavaScript string coercion. If you want meaningful text output, define `toString()`:

```js
const person = def({
  name: 'Ada',
  toString() {
    return this.name
  }
})

el`div`(person)
```

## `txt`

`txt` creates a text node from a template literal:

```js
const name = def('Ada')
const node = txt`Hello ${name}!`
```

This is useful when you want a text node directly instead of wrapping it in an element.

## `parse`

`parse` is exported mainly as a low-level utility for the template parser used by `el`.

Example:

```js
const result = parse`button disabled title="Save"`
```

It returns:

```js
{
  tag: 'button',
  props: {
    disabled: [true],
    title: ['Save']
  }
}
```

Malformed input throws. For example, unterminated quoted attributes are rejected.

## Cleanup Model

Reactive DOM bindings created by this library register cleanup automatically.

That includes:

- reactive text interpolations
- reactive props
- reactive children
- derived reactives owned only by DOM bindings

Cleanup runs when the owning custom element disconnects or when child nodes are replaced and removed through the library's own update path.

## Constraints

- Browser-only.
- Requires a live DOM environment.
- Expects `document`, `Node`, `customElements`, and `Promise` microtasks.
- Automatic cleanup currently depends on customized built-in custom elements via `customElements.define(..., { extends })` and `document.createElement(tag, { is })`.

## Practical Notes

- For primitives, use `.val`.
- For objects and arrays, direct mutation works because they are proxies.
- Reading `.val` on objects and arrays returns the raw data, bypassing the proxy. Mutations through `.val` are silent.
- For object text/prop rendering, JavaScript coercion rules apply.
- `el(selector)` always returns an array, so required roots should be checked explicitly.
