import { describe, it, expect, vi } from 'vitest'
import { registerCleanup, cleanupNode, cleanupTree } from '../src/element/cleanup'
import { handleChildren } from '../src/element/children'
import { createReactive } from '../src/reactive/core'
import { text } from '../src/element/text'

function createElement() {
  return document.createElement('div')
}

describe('cleanup', () => {
  it('calls registered cleanup handlers on cleanupNode', () => {
    const el = createElement()
    const fn = vi.fn()
    registerCleanup(el, fn)
    cleanupNode(el)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('removes all handlers after cleanup', () => {
    const el = createElement()
    const fn = vi.fn()
    registerCleanup(el, fn)
    cleanupNode(el)
    cleanupNode(el)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('handles multiple handlers', () => {
    const el = createElement()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    registerCleanup(el, fn1)
    registerCleanup(el, fn2)
    cleanupNode(el)
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
  })

  it('does nothing if no handlers registered', () => {
    const el = createElement()
    expect(() => cleanupNode(el)).not.toThrow()
  })

  it('unsubscribes from reactive children on cleanup', async () => {
    const el = createElement()
    const child = createReactive('foo')
    const spy = vi.fn()
    child.subscribe(spy)
    handleChildren(el, [child])
    cleanupNode(el)
    child.val = 'bar'
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes from reactive interpolations on cleanup', async () => {
    const t = createReactive('foo')
    const node = text`${t}`
    const spy = vi.fn()
    t.subscribe(spy)
    cleanupNode(node)
    t.val = 'bar'
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('disposes derived reactives used by text nodes on cleanup', async () => {
    const source = createReactive('foo')
    const derived = source.derive((value) => value.toUpperCase())
    const node = text`${derived}`

    cleanupNode(node)
    source.val = 'bar'
    await Promise.resolve()

    expect(derived.val).toBe('FOO')
  })

  it('cleans up descendant handlers when cleaning a subtree', async () => {
    const parent = createElement()
    const child = createElement()
    const reactive = createReactive('foo')
    const node = text`${reactive}`

    child.append(node)
    parent.append(child)
    cleanupTree(parent)

    const spy = vi.fn()
    reactive.subscribe(spy)
    reactive.val = 'bar'
    await Promise.resolve()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
