import { describe, it, expect } from 'vitest'
import { el, def } from '../src/main'

describe('el', () => {
  it('should create elements with correct tag', () => {
    const div = el`div`()
    expect(div.tagName).toBe('DIV')
  })

  it('should handle nested elements', () => {
    const parent = el`div`(el`p`('Hello'), el`span`('World'))

    expect(parent.children.length).toBe(2)
    expect(parent.children[0].tagName).toBe('P')
    expect(parent.children[1].tagName).toBe('SPAN')
    expect(parent.textContent).toBe('HelloWorld')
  })

  it('should handle props and children together', () => {
    const element = el`div class="container" id="main"`(el`p class="text"`('Content'))

    expect(element.getAttribute('class')).toBe('container')
    expect(element.getAttribute('id')).toBe('main')
    expect(element.children[0].getAttribute('class')).toBe('text')
    expect(element.textContent).toBe('Content')
  })

  it('should handle reactive props and children', () => {
    const className = def('initial')
    const content = def('Initial Content')
    const element = el`div class=${className}`(content)

    expect(element.getAttribute('class')).toBe('initial')
    expect(element.textContent).toBe('Initial Content')

    className.val = 'updated'
    content.val = 'Updated Content'

    expect(element.getAttribute('class')).toBe('updated')
    expect(element.textContent).toBe('Updated Content')
  })
})
