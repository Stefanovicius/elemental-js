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
npm install elem-js
```

Or include via **CDN**:

```html
<script src="https://cdn.jsdelivr.net/npm/elem-js/dist/elemental.min.js"></script>
```

You can use `@require` to import it in userscripts:

```javascript
// @require     https://cdn.jsdelivr.net/npm/elem-js/dist/elemental.min.js
```

## Example of a Counter Component

```javascript
// available via window when using CDN
// const { def, el } = window;
import { def, el } from 'elem-js'

function Counter() {
  const count = def(0)
  const increment = () => ++count.val
  return el`button onclick=${increment}`('Count is: ', count)
}

el('#counter').append(Counter())
```

## Future Plans

Elemental.js is just at the beginning of its journey, here are the plans for its evolution:

- **Building a Website**: Every lib needs a home. I'm working on a dedicated website to showcase Elemental.js, complete with examples, and documentation.
- **Building a Community**: Once the foundation is solid, I'll be laying out clear guidelines for contributions. And add a userscripts section to the site.
- **Feature Expansion**: I have a vision of adding more features while keeping the core simple and intuitive. Stay tuned for updates that bring new capabilities to your elemental toolkit.

## Let the Elements Be With You

Embrace the power of Elemental.js and let the elements guide your path to creating enchanting user interfaces. Who knew controlling the elements could be this easy?
