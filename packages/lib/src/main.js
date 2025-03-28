import { def } from './reactive/core'
import { parse } from './parser'
import { handleProps } from './props'
import { handleChildren } from './children'
import { text } from './text'
import { isArray } from './utilities'

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
function l(input, ...interpolations) {
  const createMode = isArray(input) && 'raw' in input
  if (createMode) {
    return (...children) => {
      const { tag, props } = parse(input, ...interpolations)
      const element = document.createElement(tag)
      handleProps(element, props)
      handleChildren(element, children)
      return element
    }
  }
  const elements = document.querySelectorAll(input)
  return elements.length > 1 ? elements : elements[0]
}

export { def, l, text }
