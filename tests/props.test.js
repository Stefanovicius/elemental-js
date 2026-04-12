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

  it('should handle object reactives in attributes', async () => {
    const element = document.createElement('div')
    const reactive = createReactive({
      value: 'initial',
      toString() {
        return this.value
      }
    })

    handleProps(element, { class: [reactive] })
    expect(element.getAttribute('class')).toBe('initial')

    reactive.value = 'updated'
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('updated')
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

  it('should handle class as an object with truthy/falsy values', () => {
    const element = document.createElement('div')
    handleProps(element, { class: [{ card: true, active: true, hidden: false }] })
    expect(element.getAttribute('class')).toBe('card active')
  })

  it('should handle reactive class object', async () => {
    const element = document.createElement('div')
    const cls = createReactive({ card: true, active: false })
    handleProps(element, { class: [cls] })
    expect(element.getAttribute('class')).toBe('card')

    cls.active = true
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('card active')
  })

  it('should handle style as an object with camelCase keys', () => {
    const element = document.createElement('div')
    handleProps(element, { style: [{ color: 'red', fontSize: '14px' }] })
    expect(element.getAttribute('style')).toBe('color: red; font-size: 14px')
  })

  it('should handle style object with camelCase to kebab-case conversion', () => {
    const element = document.createElement('div')
    handleProps(element, { style: [{ backgroundColor: '#fff', marginTop: '8px' }] })
    expect(element.getAttribute('style')).toBe('background-color: #fff; margin-top: 8px')
  })

  it('should handle reactive style object', async () => {
    const element = document.createElement('div')
    const styles = createReactive({ color: 'red' })
    handleProps(element, { style: [styles] })
    expect(element.getAttribute('style')).toBe('color: red')

    styles.color = 'blue'
    await Promise.resolve()
    expect(element.getAttribute('style')).toBe('color: blue')
  })

  it('should handle class map with reactive boolean values', async () => {
    const element = document.createElement('div')
    const isActive = createReactive(false)
    const isHidden = createReactive(false)
    handleProps(element, { class: [{ card: true, active: isActive, hidden: isHidden }] })
    expect(element.getAttribute('class')).toBe('card')

    isActive.val = true
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('card active')

    isHidden.val = true
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('card active hidden')

    isActive.val = false
    await Promise.resolve()
    expect(element.getAttribute('class')).toBe('card hidden')
  })

  it('should handle style map with reactive string values', async () => {
    const element = document.createElement('div')
    const color = createReactive('red')
    const fontSize = createReactive('14px')
    handleProps(element, { style: [{ color, fontSize }] })
    expect(element.getAttribute('style')).toBe('color: red; font-size: 14px')

    color.val = 'blue'
    await Promise.resolve()
    expect(element.getAttribute('style')).toBe('color: blue; font-size: 14px')

    fontSize.val = '16px'
    await Promise.resolve()
    expect(element.getAttribute('style')).toBe('color: blue; font-size: 16px')
  })
})
