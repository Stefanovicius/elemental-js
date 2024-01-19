import { describe, it, expect } from 'vitest'
import { createElement } from '../src/element'

describe('Element creation', () => {
  it('creates a div element', () => {
    const element = createElement({
      tag: 'div',
      attributes: {},
      content: []
    })
    expect(element.outerHTML).toBe('<div></div>')
  })

  it('creates a div element with content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {},
      content: ['Hello World!']
    })
    expect(element.outerHTML).toBe('<div>Hello World!</div>')
  })

  it('creates a div element with a boolean attribute', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': [true]
      },
      content: []
    })
    expect(element.outerHTML).toBe('<div data-attribute=""></div>')
  })

  it('creates a div element with a false boolean attribute', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': [false]
      },
      content: []
    })
    expect(element.outerHTML).toBe('<div></div>')
  })

  it('creates a div element with an explicit attribute', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value']
      },
      content: []
    })
    expect(element.outerHTML).toBe('<div data-attribute="value"></div>')
  })

  it('creates a div element with a boolean attribute and content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': [true]
      },
      content: ['Hello World!']
    })
    expect(element.outerHTML).toBe('<div data-attribute="">Hello World!</div>')
  })

  it('creates a div element with an explicit attribute and content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value']
      },
      content: ['Hello World!']
    })
    expect(element.outerHTML).toBe('<div data-attribute="value">Hello World!</div>')
  })

  it('creates a div element with multiple attributes', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value'],
        'data-attribute-2': [true]
      },
      content: []
    })
    expect(element.outerHTML).toBe('<div data-attribute="value" data-attribute-2=""></div>')
  })

  it('creates a div element with multiple attributes and content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value'],
        'data-attribute-2': [true]
      },
      content: ['Hello World!']
    })
    expect(element.outerHTML).toBe(
      '<div data-attribute="value" data-attribute-2="">Hello World!</div>'
    )
  })

  it('creates a div element with multiple content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {},
      content: ['Hello', 'World!']
    })
    expect(element.outerHTML).toBe('<div>HelloWorld!</div>')
  })

  it('creates a div element with multiple content and attributes', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value'],
        'data-attribute-2': [true]
      },
      content: ['Hello', 'World!']
    })
    expect(element.outerHTML).toBe(
      '<div data-attribute="value" data-attribute-2="">HelloWorld!</div>'
    )
  })

  it('creates a div element with multiple attributes and content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value', ' ', 'value2'],
      },
      content: []
    })
    expect(element.outerHTML).toBe(
      '<div data-attribute="value value2"></div>'
    )
  })

  it('creates a div element with multiple attributes and content', () => {
    const element = createElement({
      tag: 'div',
      attributes: {
        'data-attribute': ['value', ' ', 'value2'],
      },
      content: ['Hello', 'World!']
    })
    expect(element.outerHTML).toBe(
      '<div data-attribute="value value2">HelloWorld!</div>'
    )
  })

  it('creates a div element with multiple element children', () => {
    const element = createElement({
      tag: 'div',
      attributes: {},
      content: [createElement({
        tag: 'span',
        attributes: {},
        content: ['Hello']
      }), createElement({
        tag: 'span',
        attributes: {},
        content: ['World!']
      })]
    })
    expect(element.outerHTML).toBe(
      '<div><span>Hello</span><span>World!</span></div>'
    )
  })

  it('creates a div element with multiple element children and attributes', () => {
    const span = createElement({
      tag: 'span',
      attributes: {},
      content: ['Hello World!']
    })
    const p = createElement({
      tag: 'p',
      attributes: {},
      content: [span]
    })
    const div = createElement({
      tag: 'div',
      attributes: {},
      content: [p]
    })
    expect(div.outerHTML).toBe(
      '<div><p><span>Hello World!</span></p></div>'
    )
  })
})
