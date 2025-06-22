import { describe, it, expect, vi } from 'vitest'
import { createReactive } from '../src/reactive/core'

describe('batched reactivity', () => {
  it('batches multiple updates in a microtask', async () => {
    const a = createReactive(0)
    const spy = vi.fn()
    a.subscribe(spy)
    a.val = 1
    a.val = 2
    a.val = 3
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('calls subscribers again on next tick', async () => {
    const a = createReactive(0)
    const spy = vi.fn()
    a.subscribe(spy)
    a.val = 1
    await Promise.resolve()
    a.val = 2
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('deduplicates multiple subscribers', async () => {
    const a = createReactive(0)
    const spy = vi.fn()
    a.subscribe(spy)
    a.subscribe(spy)
    a.val = 1
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('Reactive numbers', () => {
  it('creates a reactive with a value', () => {
    const reactive = createReactive(5)
    expect(reactive.val).toBe(5)
  })

  it('creates a reactive with a value and a derivative', () => {
    const [reactive, derived] = createReactive(5, (val) => val * 2)
    expect(reactive.val).toBe(5)
    expect(derived.val).toBe(10)
  })

  it('creates a reactive with a value and a derivative', () => {
    const reactive = createReactive(5)
    const derived = reactive.derive((val) => val * 2)
    expect(reactive.val).toBe(5)
    expect(derived.val).toBe(10)
  })

  it('updates the derivative on the reactive change', async () => {
    const [reactive, derived] = createReactive(5, (val) => val * 2)
    reactive.val = 10
    await Promise.resolve()
    expect(derived.val).toBe(20)
  })

  it('updates multiple derivatives', async () => {
    const [reactive, derivedA, derivedB] = createReactive(
      5,
      (val) => val * 2,
      (val) => val * 3
    )
    reactive.val = 10
    await Promise.resolve()
    expect(derivedA.val).toBe(20)
    expect(derivedB.val).toBe(30)
  })
})

describe('Reactive strings', () => {
  it('creates a reactive with a value', () => {
    const reactive = createReactive('Hello World!')
    expect(reactive.val).toBe('Hello World!')
  })

  it('creates a reactive with a value and a derivative', () => {
    const [reactive, derived] = createReactive('Hello World!', (val) => val.toUpperCase())
    expect(reactive.val).toBe('Hello World!')
    expect(derived.val).toBe('HELLO WORLD!')
  })

  it('creates a reactive with a value and a derivative', () => {
    const reactive = createReactive('Hello World!')
    const derived = reactive.derive((val) => val.toUpperCase())
    expect(reactive.val).toBe('Hello World!')
    expect(derived.val).toBe('HELLO WORLD!')
  })

  it('updates the derivative on the reactive change', async () => {
    const [reactive, derived] = createReactive('Hello World!', (val) => val.toUpperCase())
    reactive.val = 'Hello World Again!'
    await Promise.resolve()
    expect(derived.val).toBe('HELLO WORLD AGAIN!')
  })

  it('updates multiple derivatives', async () => {
    const [reactive, derivedA, derivedB] = createReactive(
      'Hello World!',
      (val) => val.toUpperCase(),
      (val) => val.toLowerCase()
    )
    reactive.val = 'Hello World Again!'
    await Promise.resolve()
    expect(derivedA.val).toBe('HELLO WORLD AGAIN!')
    expect(derivedB.val).toBe('hello world again!')
  })
})
