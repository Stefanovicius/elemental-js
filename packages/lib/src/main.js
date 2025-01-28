import { Reactive, ReactiveArray, arr } from './reactive'
import { parse } from './parser'
import { handleProps } from './props'
import { handleChildren } from './children'
import { text } from './text'

const elementalTypes = [
  {
    typeCheck: (value) => Array.isArray(value),
    extendedReactive: ReactiveArray
  }
]

/**
 * Example:
 * ```
 * extendDef((Reactive) => [
 *   (initialValue) => typeof initialValue === 'string',
 *   class ReactiveString extends Reactive {
 *     constructor(initialValue, ...derivatives) {
 *       super(initialValue, ...derivatives)
 *     }
 *   }
 * ])`
 * ```
 * @param {(Reactive: Reactive) => [(initialValue: unknown) => boolean, Reactive]} factoryFunction
 */
const extendDef = (factoryFunction) => {
  const [typeCheck, extendedReactive] = factoryFunction(Reactive)
  elementalTypes.push({ typeCheck, extendedReactive })
}

/**
 * Creates an instance of a Reactive class to be used in an `el` template
 * @param {unknown} initialValue
 * @param {((initialValue: unknown) => Reactive)[]} derivatives
 * @returns
 */
function def(initialValue, ...derivatives) {
  const ReactiveClass =
    elementalTypes.find(({ typeCheck }) => typeCheck(initialValue))?.extendedReactive || Reactive
  return new ReactiveClass(initialValue, ...derivatives)
}

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

export { extendDef, def, arr, el, text, sel }
