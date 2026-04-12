import { describe, it, expect } from 'vitest'
import { createReactive } from '../src/reactive/core'
import { derive } from '../src/reactive/derive'

describe('derive', () => {
  it('derives from multiple sources', () => {
    const a = createReactive(2)
    const b = createReactive(3)
    const sum = derive([a, b], (a, b) => a + b)
    expect(sum.val).toBe(5)
  })

  it('updates when any source changes', async () => {
    const a = createReactive(1)
    const b = createReactive(10)
    const sum = derive([a, b], (a, b) => a + b)

    a.val = 2
    await Promise.resolve()
    expect(sum.val).toBe(12)

    b.val = 20
    await Promise.resolve()
    expect(sum.val).toBe(22)
  })

  it('notifies subscribers on change', async () => {
    const a = createReactive('hello')
    const b = createReactive('world')
    const joined = derive([a, b], (a, b) => `${a} ${b}`)
    const spy = vi.fn()

    joined.subscribe(spy)
    a.val = 'hi'
    await Promise.resolve()
    await Promise.resolve()

    expect(spy).toHaveBeenCalled()
    expect(joined.val).toBe('hi world')
  })

  it('disposes source subscriptions on dispose', async () => {
    const a = createReactive(1)
    const b = createReactive(2)
    const sum = derive([a, b], (a, b) => a + b)

    sum.dispose()
    a.val = 10
    await Promise.resolve()

    expect(sum.val).toBe(3)
  })

  it('works with object reactives', async () => {
    const user = createReactive({ name: 'Ada' })
    const greeting = createReactive('Hello')
    const message = derive([greeting, user], (g, u) => `${g}, ${u.name}`)

    expect(message.val).toBe('Hello, Ada')

    user.name = 'Grace'
    await Promise.resolve()
    await Promise.resolve()
    expect(message.val).toBe('Hello, Grace')
  })
})
