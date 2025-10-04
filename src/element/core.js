import { parse } from '../parser'
import { createCustomElement } from './element'
import { handleProps } from './props'
import { handleChildren } from './children'
import { isArray } from '../utilities'

/**
 * Selects, or creates DOM elements:
 * ```
 * l('body').append(
 *   l`div class="main"`(
 *     l`p`('Hello World!')
 *   )
 * )
 * ```
 * @param {TemplateStringsArray} input - An array of strings representing the literal portions of the template, or a HTML element's selector.
 * @param {...(Reactive|Function|boolean|string)} interpolations - Values to be interpolated into the template.
 * @returns {function(...(HTMLElement|string)): HTMLElement} A function that takes strings and Elements as arguments and returns the parent DOM element.
 */
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
  const elements = document.querySelectorAll(input)
  return elements.length > 1 ? elements : elements[0]
}
