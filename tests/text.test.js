import { describe, it, expect } from 'vitest'
import { createReactive } from '../src/reactive/core'
import { text } from '../src/element/text'

describe('text.js', () => {
  it('should create static text nodes', () => {
    const node = text`Hello World`
    expect(node.nodeValue).toBe('Hello World')
  })

  it('should handle reactive interpolations', async () => {
    const name = createReactive('John')
    const node = text`Hello ${name}!`

    expect(node.nodeValue).toBe('Hello John!')

    name.val = 'Jane'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Hello Jane!')
  })

  it('should handle multiple interpolations', async () => {
    const first = createReactive('John')
    const last = createReactive('Doe')
    const node = text`${first} ${last}`

    expect(node.nodeValue).toBe('John Doe')

    first.val = 'Jane'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Jane Doe')

    last.val = 'Smith'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Jane Smith')
  })

  it('should handle object reactives through val-backed stringification', async () => {
    const person = createReactive({
      name: 'John',
      toString() {
        return this.name
      }
    })
    const node = text`${person}`

    expect(node.nodeValue).toBe('John')

    person.name = 'Jane'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Jane')
  })
})
