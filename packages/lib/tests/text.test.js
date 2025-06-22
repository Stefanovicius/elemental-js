import { describe, it, expect } from 'vitest'
import { text } from '../src/element/text'
import { def } from '../src/main'

describe('text.js', () => {
  it('should create static text nodes', () => {
    const node = text`Hello World`
    expect(node.nodeValue).toBe('Hello World')
  })

  it('should handle reactive interpolations', async () => {
    const name = def('John')
    const node = text`Hello ${name}!`

    expect(node.nodeValue).toBe('Hello John!')

    name.val = 'Jane'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Hello Jane!')
  })

  it('should handle multiple interpolations', async () => {
    const first = def('John')
    const last = def('Doe')
    const node = text`${first} ${last}`

    expect(node.nodeValue).toBe('John Doe')

    first.val = 'Jane'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Jane Doe')

    last.val = 'Smith'
    await Promise.resolve()
    expect(node.nodeValue).toBe('Jane Smith')
  })
})
