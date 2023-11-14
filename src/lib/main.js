import { parse } from './parser'

class Variable {
  #value
  #subscribers = new Set()
  constructor(initialValue) {
    this.#value = initialValue
  }
  get val() {
    return this.#value
  }
  set val(newValue) {
    this.#value = newValue
    this.#subscribers.forEach((updater) => updater(this.#value))
  }
  subscription(updater) {
    this.#subscribers.add(updater)
  }
}

export function def(value) {
  return new Variable(value)
}

export function el(strings, ...interpolations) {
  const ast = parse(strings, interpolations)
  return createElement(ast)
}

function createElement({ tag, attributes, content }) {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([attribute, value]) => {
    if (attribute.startsWith('on'))
      element.addEventListener(attribute.slice(2), value[0])
    else element.setAttribute(attribute, value.join(''))
  })
  content.forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (typeof value === 'string') item = document.createTextNode(item)
        element.append(item)
      })
      return
    }
    if (value instanceof Variable) {
      value.subscription(() => {
        element.replaceChildren()
        content.forEach((value) => {
          if (value instanceof Variable)
            value = document.createTextNode(value.val)
          else if (typeof value === 'string')
            value = document.createTextNode(value)
          element.append(value)
        })
      })
      value = document.createTextNode(value.val)
    }
    if (typeof value === 'string') value = document.createTextNode(value)
    element.append(value)
  })
  return element
}
