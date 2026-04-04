# Elemental.js

Welcome to Elemental.js – the lightweight, no-nonsense JavaScript library for building reactive UIs with a touch of magic. Don't just write code - _control the elements_.

## Introduction

Tired of the heavyweight frameworks? Want something simple yet powerful? Elemental.js is your spell-book for creating simple dynamic, web interfaces with minimal fuss. Simple syntax, powerful features - all in one compact package.

## Features

- **Effortless Reactivity**: Breathe life into your UI with a straightforward reactivity model. Watch as your UI updates magically as your data changes.
- **Zero Dependencies**: With Elemental.js, what you see is what you get - no external dependencies, just pure JavaScript wizardry.
- **Lightweight and Fast**: Designed to be lean and mean. Enjoy the speed without the bloat of larger frameworks.
- **Easy to Learn**: Jump right in, even if you're not a sorcerer of JavaScript. Clear syntax makes it a breeze.

## Getting Started

Install through `npm`:

```bash
npm install elemental-lite
```

Or include via **CDN**:

```html
<script src="https://cdn.jsdelivr.net/npm/elemental-lite/dist/elemental.min.js"></script>
```

This exposes `def`, `el`, and `txt` on `window`.

You can use `@require` to import it in userscripts:

```javascript
// @require     https://cdn.jsdelivr.net/npm/elemental-lite/dist/elemental.min.js
```

## Example of a Counter Component

With npm / ESM:

```html
<div id="counter"></div>
```

```javascript
import { def, el } from 'elemental-lite'

function Counter() {
  const count = def(0)
  const increment = () => ++count.val
  return el`button onclick=${increment}`('Count is: ', count)
}

el('#counter').append(Counter())
```

With CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/elemental-lite/dist/elemental.min.js"></script>

<div id="counter"></div>

<script>
  function Counter() {
    const count = def(0)
    const increment = () => ++count.val
    return el`button onclick=${increment}`('Count is: ', count)
  }

  el('#counter').append(Counter())
</script>
```

## Let the Elements Be With You

Embrace the power of Elemental.js and let the elements guide your path to creating enchanting user interfaces. Who knew controlling the elements could be this easy?

## Note

Elemental.js is a small hobby experiment. It is intentionally simple, still lightly validated, and should be treated as an exploratory library rather than a production-proven framework.
