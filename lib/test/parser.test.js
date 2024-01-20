import { describe, it, expect } from 'vitest'
import { parse } from '../src/parser'

describe('Syntax', () => {
  it('parses a boolean attribute and content written in one line', () => {
    const result = parse`div data-attribute "Hello World!"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-attribute': [true]
      },
      content: ['Hello World!']
    })
  })

  it('parses an attribute with explicit value and content written in one line', () => {
    const result = parse`div data-attribute="value" "Hello World!"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-attribute': ['value']
      },
      content: ['Hello World!']
    })
  })

  it('parses the tag, attribute and content split to different lines', () => {
    const result = parse`div
      data-attribute
      "Hello World!"
    `
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-attribute': [true]
      },
      content: ['Hello World!']
    })
  })

  it('parses the tag, content and attribute split to different lines', () => {
    const result = parse`div
      "Hello World!"
      data-attribute
    `
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-attribute': [true]
      },
      content: ['Hello World!']
    })
  })
})

describe('Tag parsing', () => {
  it('parses basic div tag', () => {
    const result = parse`div`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: []
    })
  })

  it('parses a custom element tag', () => {
    const result = parse`custom-element`
    expect(result).toStrictEqual({
      tag: 'custom-element',
      attributes: {},
      content: []
    })
  })

  it('returns empty ast', () => {
    const result = parse``
    expect(result).toStrictEqual({
      tag: '',
      attributes: {},
      content: []
    })
  })

  it('returns only content', () => {
    const result = parse`"Hello World!"`
    expect(result).toStrictEqual({
      tag: '',
      attributes: {},
      content: ['Hello World!']
    })
  })
})

describe('Attribute parsing', () => {
  it('parses div with data attribute and explicit value', () => {
    const result = parse`div data-attribute="value"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'data-attribute': ['value'] },
      content: []
    })
  })

  it('parses div with unquoted data attribute and explicit value', () => {
    const value = 'value'
    const result = parse`div data-attribute=${value}`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'data-attribute': ['value'] },
      content: []
    })
  })

  it('parses div with boolean data attribute', () => {
    const result = parse`div data-attribute`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'data-attribute': [true] },
      content: []
    })
  })

  it('parses div with explicit boolean data attribute', () => {
    const result = parse`div data-attribute=${true}`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'data-attribute': [true] },
      content: []
    })
  })

  it('parses div with style attribute containing interpolated color value', () => {
    const red = 'red'
    const result = parse`div style="color: ${red};"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { style: ['color: ', 'red', ';'] },
      content: []
    })
  })

  it('parses div with multiple data attributes', () => {
    const result = parse`div data-first="first" data-second="second"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-first': ['first'],
        'data-second': ['second']
      },
      content: []
    })
  })

  it('parses element with mixed boolean and valued attributes', () => {
    const result = parse`input disabled type="checkbox" checked=${true}`
    expect(result).toStrictEqual({
      tag: 'input',
      attributes: {
        checked: [true],
        disabled: [true],
        type: ['checkbox']
      },
      content: []
    })
  })

  it('parses element with custom attribute containing special characters', () => {
    const result = parse`div data-value="Complex@Value#100"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-value': ['Complex@Value#100']
      },
      content: []
    })
  })

  it('parses element with data attribute containing JSON object as a string', () => {
    const json = '{"name":"John","age":30}'
    const result = parse`div data-user=${json}`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-user': ['{"name":"John","age":30}']
      },
      content: []
    })
  })

  it('parses multiple unquoted attributes with various data types', () => {
    const number = 42
    const bool = true
    const obj = { key: 'value' }
    const result = parse`div data-number=${number} data-bool=${bool} data-obj=${obj}`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {
        'data-number': [42],
        'data-bool': [true],
        'data-obj': [{ key: 'value' }]
      },
      content: []
    })
  })

  it('parses class attribute with multiple classes', () => {
    const result = parse`div class="class1 class2 class3"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { class: ['class1 class2 class3'] },
      content: []
    })
  })

  it('parses data attributes with array values', () => {
    const array = [1, 2, 3]
    const result = parse`div data-array="${array}"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'data-array': [[1, 2, 3]] },
      content: []
    })
  })

  it('parses attributes with namespace', () => {
    const result = parse`div xml:lang="en"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: { 'xml:lang': ['en'] },
      content: []
    })
  })
})

describe('Content parsing', () => {
  it('parses div with static content', () => {
    const result = parse`div "Hello World!"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: ['Hello World!']
    })
  })

  it('parses div with content containing interpolated values', () => {
    const elemental = 'Elemental'
    const result = parse`div "Hello ${elemental} World!"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: ['Hello ', 'Elemental', ' World!']
    })
  })

  it('parses elements with special characters in content', () => {
    const result = parse`div "&lt;script&gt;alert('Hello')&lt;/script&gt;"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: ["&lt;script&gt;alert('Hello')&lt;/script&gt;"]
    })
  })

  it('parses elements with numeric content', () => {
    const number = 123
    const result = parse`div "${number}"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: [123]
    })
  })

  it('parses elements with mixed content types', () => {
    const num = 42
    const result = parse`div "Text ${num} and more text"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: ['Text ', 42, ' and more text']
    })
  })

  it('parses elements with multiline content', () => {
    const result = parse`div "Line 1\nLine 2\nLine 3"`
    expect(result).toStrictEqual({
      tag: 'div',
      attributes: {},
      content: ['Line 1\nLine 2\nLine 3']
    })
  })
})
