import { parse } from '../parser'
import { createCustomElement } from './element'
import { handleProps } from './props'
import { handleChildren } from './children'
import { isArray } from '../utilities'

export const handleTemplate = (input, ...interpolations) => {
  const createMode = isArray(input) && 'raw' in input
  if (createMode) {
    return (...children) => {
      const { tag, props } = parse(input, ...interpolations)
      const element = createCustomElement(tag)
      handleProps(element, props)
      handleChildren(element, children)
      return element
    }
  }
  const elements = [...document.querySelectorAll(input)]
  if (!elements.length) throw Error(`Selector not found: ${input}`)
  return elements
}
