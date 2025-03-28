import { describe, it, expect } from 'vitest'
import { def } from '../src/reactive/core'

describe('Reactive numbers', () => {
  it('creates a reactive with a value', () => {
    const reactive = def(5)
    expect(reactive.val).toBe(5)
  })

  it('creates a reactive with a value and a derivative', () => {
    const [reactive, derived] = def(5, (val) => val * 2)
    expect(reactive.val).toBe(5)
    expect(derived.val).toBe(10)
  })

  it('creates a reactive with a value and a derivative', () => {
    const reactive = def(5)
    const derived = reactive.derive((val) => val * 2)
    expect(reactive.val).toBe(5)
    expect(derived.val).toBe(10)
  })

  it('updates the derivative on the reactive change', () => {
    const [reactive, derived] = def(5, (val) => val * 2)
    reactive.val = 10
    expect(derived.val).toBe(20)
  })

  it('updates multiple derivatives', () => {
    const [reactive, derivedA, derivedB] = def(
      5,
      (val) => val * 2,
      (val) => val * 3
    )
    reactive.val = 10
    expect(derivedA.val).toBe(20)
    expect(derivedB.val).toBe(30)
  })
})

describe('Reactive strings', () => {
  it('creates a reactive with a value', () => {
    const reactive = def('Hello World!')
    expect(reactive.val).toBe('Hello World!')
  })

  it('creates a reactive with a value and a derivative', () => {
    const [reactive, derived] = def('Hello World!', (val) => val.toUpperCase())
    expect(reactive.val).toBe('Hello World!')
    expect(derived.val).toBe('HELLO WORLD!')
  })

  it('creates a reactive with a value and a derivative', () => {
    const reactive = def('Hello World!')
    const derived = reactive.derive((val) => val.toUpperCase())
    expect(reactive.val).toBe('Hello World!')
    expect(derived.val).toBe('HELLO WORLD!')
  })

  it('updates the derivative on the reactive change', () => {
    const [reactive, derived] = def('Hello World!', (val) => val.toUpperCase())
    reactive.val = 'Hello World Again!'
    expect(derived.val).toBe('HELLO WORLD AGAIN!')
  })

  it('updates multiple derivatives', () => {
    const [reactive, derivedA, derivedB] = def(
      'Hello World!',
      (val) => val.toUpperCase(),
      (val) => val.toLowerCase()
    )
    reactive.val = 'Hello World Again!'
    expect(derivedA.val).toBe('HELLO WORLD AGAIN!')
    expect(derivedB.val).toBe('hello world again!')
  })
})
