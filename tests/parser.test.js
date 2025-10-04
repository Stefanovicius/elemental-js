import { describe, it, expect } from 'vitest'
import { parse } from '../src/parser'

describe('Tag parsing', () => {
  it('parses a basic HTML tag name without any attributes', () => {
    const result = parse`div`
    expect(result).toEqual({
      tag: 'div',
      props: {}
    })
  })

  it('parses tag name with numeric characters', () => {
    const result = parse`h1`
    expect(result).toEqual({
      tag: 'h1',
      props: {}
    })
  })

  it('parses a custom element name containing hyphens', () => {
    const result = parse`custom-element`
    expect(result).toEqual({
      tag: 'custom-element',
      props: {}
    })
  })

  it('preserves tag name when followed by trailing whitespace', () => {
    const result = parse`div `
    expect(result).toEqual({
      tag: 'div',
      props: {}
    })
  })

  it('throws error when tag name is preceded by whitespace', () => {
    const testParsingUndefinedTag = () => parse` div`
    expect(testParsingUndefinedTag).toThrow('Invalid tag declaration')
  })

  it('throws error when template literal contains no tag name', () => {
    const testParsingUndefinedTag = () => parse``
    expect(testParsingUndefinedTag).toThrow('Invalid tag declaration')
  })
})

describe('Attribute parsing', () => {
  it('parses boolean attributes with implicit true value', () => {
    const result = parse`div hidden`
    expect(result).toEqual({
      tag: 'div',
      props: { hidden: [true] }
    })
  })

  it('preserves boolean attribute when separated from tag by multiple spaces', () => {
    const result = parse`div  hidden`
    expect(result).toEqual({
      tag: 'div',
      props: { hidden: [true] }
    })
  })

  it('preserves boolean attribute when followed by trailing space', () => {
    const result = parse`div hidden `
    expect(result).toEqual({
      tag: 'div',
      props: { hidden: [true] }
    })
  })

  it('parses attribute values enclosed in single quotes', () => {
    const result = parse`div data-attribute='value'`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attribute': ['value'] }
    })
  })

  it('parses attribute values enclosed in double quotes', () => {
    const result = parse`div data-attribute="value"`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attribute': ['value'] }
    })
  })

  it('preserves attribute with quoted value when followed by trailing space', () => {
    const result = parse`div data-attribute="value" `
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attribute': ['value'] }
    })
  })

  it('handles dynamic values through string interpolation', () => {
    const value = 'value'
    const result = parse`div data-attribute=${value}`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attribute': ['value'] }
    })
  })

  it('handles boolean values through interpolation', () => {
    const result = parse`div data-attribute=${true}`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attribute': [true] }
    })
  })

  it('parses attribute containing multiple interpolated values', () => {
    const red = 'red'
    const result = parse`div style="color: ${red}; background: ${red};"`
    expect(result).toEqual({
      tag: 'div',
      props: { style: ['color: ', 'red', '; background: ', 'red', ';'] }
    })
  })

  it('parses multiple boolean attributes on a single element', () => {
    const result = parse`div data-first data-second`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-first': [true],
        'data-second': [true]
      }
    })
  })

  it('parses multiple attributes with quoted values', () => {
    const result = parse`div data-first="first" data-second="second"`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-first': ['first'],
        'data-second': ['second']
      }
    })
  })

  it('parses combination of boolean and valued attributes', () => {
    const result = parse`input disabled type="checkbox" checked=${true}`
    expect(result).toEqual({
      tag: 'input',
      props: {
        checked: [true],
        disabled: [true],
        type: ['checkbox']
      }
    })
  })

  it('handles attributes with single quote character in value', () => {
    const result = parse`div data-value="'"`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-value': ["'"]
      }
    })
  })

  it('handles attributes with double quote character in value', () => {
    const result = parse`div data-value='"'`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-value': ['"']
      }
    })
  })

  it('parses attribute with stringified JSON value', () => {
    const json = '{"name":"John","age":30}'
    const result = parse`div data-user=${json}`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-user': ['{"name":"John","age":30}']
      }
    })
  })

  it('handles multiple interpolated values of different types', () => {
    const number = 42
    const bool = true
    const obj = { key: 'value' }
    const result = parse`div data-number=${number} data-bool=${bool} data-obj=${obj}`
    expect(result).toEqual({
      tag: 'div',
      props: {
        'data-number': [42],
        'data-bool': [true],
        'data-obj': [{ key: 'value' }]
      }
    })
  })

  it('parses space-separated class names in class attribute', () => {
    const result = parse`div class="class1 class2 class3"`
    expect(result).toEqual({
      tag: 'div',
      props: { class: ['class1 class2 class3'] }
    })
  })

  it('handles array values in attributes', () => {
    const array = [1, 2, 3]
    const result = parse`div data-array="${array}"`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-array': [[1, 2, 3]] }
    })
  })

  it('handles function values in event handler attributes', () => {
    const noop = () => {}
    const result = parse`button onclick=${noop}`
    expect(result).toEqual({
      tag: 'button',
      props: { onclick: [noop] }
    })
  })

  it('handles nested template literals in interpolated values', () => {
    const nested = `nested-${42}`
    const result = parse`div data-nested=${nested}`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-nested': ['nested-42'] }
    })
  })

  it('handles undefined interpolated values', () => {
    const value = undefined
    const result = parse`div data-attr=${value}`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attr': [undefined] }
    })
  })

  it('handles null interpolated values', () => {
    const value = null
    const result = parse`div data-attr=${value}`
    expect(result).toEqual({
      tag: 'div',
      props: { 'data-attr': [null] }
    })
  })
})
