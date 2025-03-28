import { describe, it, expect } from 'vitest'
import { handleChildren } from '../src/children'
import { el, def } from '../src/main'

describe('Handling children', () => {
  it('should append text nodes correctly', () => {
    const element = document.createElement('div')
    const children = ['Hello', ' ', 'World']

    handleChildren(element, children)

    expect(element.childNodes.length).toBe(3)
    expect(element.childNodes[0].nodeValue).toBe('Hello')
    expect(element.childNodes[1].nodeValue).toBe(' ')
    expect(element.childNodes[2].nodeValue).toBe('World')
  })

  it('should handle reactive children', () => {
    const element = document.createElement('div')
    const reactive = def('Initial')
    const children = [reactive]

    handleChildren(element, children)
    expect(element.childNodes[0].nodeValue).toBe('Initial')

    reactive.val = 'Updated'
    expect(element.childNodes[0].nodeValue).toBe('Updated')
  })

  it('should handle mixed children types', () => {
    const element = document.createElement('div')
    const child1 = document.createElement('span')
    const reactive = def('Reactive')
    const children = [child1, reactive, 'Static']

    handleChildren(element, children)
    expect(element.childNodes.length).toBe(3)
    expect(element.childNodes[0]).toBe(child1)
    expect(element.childNodes[1].nodeValue).toBe('Reactive')
    expect(element.childNodes[2].nodeValue).toBe('Static')
  })

  it('should remove extra children when updating', () => {
    const element = document.createElement('div')

    const [reactive, children] = def(['One', 'Two', 'Three'], (value) =>
      value.map((text) => el`span`(text))
    )

    handleChildren(element, [children])

    expect(element.childNodes.length).toBe(3)

    reactive.val = ['One']

    expect(element.childNodes.length).toBe(1)
    expect(element.childNodes[0].textContent).toBe('One')
  })

  it('should handle nested arrays of children', () => {
    const element = document.createElement('div')
    const children = [
      ['Hello', ' ', 'World'],
      ['!', '!']
    ]

    handleChildren(element, children)

    expect(element.childNodes.length).toBe(5)
    expect(element.textContent).toBe('Hello World!!')
  })
})
