import { Reactive, ReactiveArray, arr } from './reactive'
import { createElement } from './element'
import { parse } from './parser'

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
 * Creates an instance of the element for the specified tag, attributes, and text inside the template:
 * ```
 * el`div id="main" "Hello World!"`
 * ```
 * @param {string[]} strings
 * @param {unknown[]} interpolations
 * @returns {HTMLElement}
 */
function el(strings, ...interpolations) {
  const ast = parse(strings, ...interpolations)
  return createElement(ast)
}

/**
 * Returns the first element that is a descendant of node that matches selectors. An alias of `document.querySelector`
 * @param {keyof HTMLElementTagNameMap} selectors
 * @returns {HTMLElement | null}
 */
const sel = (selectors) => document.querySelector(selectors)

export { extendDef, def, arr, el, sel }
