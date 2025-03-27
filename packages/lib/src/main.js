import { def } from './reactive'
import { parse } from './parser'
import { handleProps } from './props'
import { handleChildren } from './children'
import { text } from './text'

/**
 * Creates DOM elements:
 * ```
 * el`div class="main"`(
 *   el`p`('Hello World!')
 * )
 * ```
 * @param {TemplateStringsArray} strings - An array of strings representing the literal portions of the template.
 * @param {...(Reactive|Function|boolean|string)} interpolations - Values to be interpolated into the template.
 * @returns {function(...(HTMLElement|string)): HTMLElement} A function that takes strings and Elements as arguments and returns the parent DOM element.
 */
function el(strings, ...interpolations) {
  return (...children) => {
    const { tag, props } = parse(strings, ...interpolations)
    const element = document.createElement(tag)
    handleProps(element, props)
    handleChildren(element, children)
    return element
  }
}

/**
 * Returns the first element that is a descendant of node that matches selectors. An alias of `document.querySelector`
 * @param {keyof HTMLElementTagNameMap} selectors
 * @returns {HTMLElement | null}
 */
const sel = (selectors) => document.querySelector(selectors)

export { def, el, text, sel }
