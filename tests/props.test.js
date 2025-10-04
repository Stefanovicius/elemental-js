import { describe, it, expect } from 'vitest'
import { handleProps } from '../src/element/props'
import { createReactive } from '../src/reactive/core'

describe('Props handling', () => {
  it('should set static attributes', () => {
    const element = document.createElement('div')
    const props = {
      class: ['my-class'],
      id: ['unique-id']
    }

    handleProps(element, props)

    expect(element.getAttribute('class')).toBe('my-class')
    expect(element.getAttribute('id')).toBe('unique-id')
  })

  it('should handle boolean attributes', () => {
    const element = document.createElement('div')
    const props = {
      disabled: [true],
      hidden: [false]
    }

    handleProps(element, props)

    expect(element.hasAttribute('disabled')).toBe(true)
    expect(element.hasAttribute('hidden')).toBe(false)
  })

  it('should handle reactive attributes', async () => {
    const element = document.createElement('div')
    const reactive = createReactive('initial-class')
    const props = {
      class: [reactive]
    }

    handleProps(element, props)
    expect(element.getAttribute('class')).toBe('initial-class')

    reactive.val = 'updated-class'
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('updated-class')
  })

  it('should handle multiple values in attribute', async () => {
    const element = document.createElement('div')
    const firstName = createReactive('John')
    const lastName = createReactive('Doe')
    const props = {
      'data-name': [firstName, ' ', lastName]
    }

    handleProps(element, props)
    expect(element.getAttribute('data-name')).toBe('John Doe')

    firstName.val = 'Jane'
    await Promise.resolve()
    expect(element.getAttribute('data-name')).toBe('Jane Doe')
  })

  it('should handle event listeners', () => {
    const element = document.createElement('button')
    const clickHandler = vi.fn()
    const props = {
      onclick: [clickHandler]
    }

    handleProps(element, props)
    element.click()

    expect(clickHandler).toHaveBeenCalled()
  })

  it('should handle multiple event listeners for same event', () => {
    const element = document.createElement('button')
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const props = {
      onclick: [handler1, handler2]
    }

    handleProps(element, props)
    element.click()

    expect(handler1).toHaveBeenCalled()
    expect(handler2).toHaveBeenCalled()
  })
})
