import { Reactive, ReactiveArray, arr } from './reactive'
import { createElement } from './element'
import { parse } from './parser'

const elementalTypes = [{
    typeCheck: (value) => Array.isArray(value),
    extendedReactive: ReactiveArray,
}]

const extendDef = (typeCheck, reactiveClass) =>
  elementalTypes.push({ typeCheck, extendedReactive: reactiveClass })

/**
 * Creates an instance of a Reactive class to be used in an `el` template
 * @param {Function} renderMethod
 * @returns {Reactive}
 */
function def(initialValue, renderMethod) {
  const ReactiveClass =
    elementalTypes.find(({ typeCheck }) => typeCheck(initialValue))
      ?.extendedReactive || Reactive
  return new ReactiveClass(initialValue, renderMethod)
}

/**
 * Creates an instance of the element for the specified tag, attributes, and text inside the template:
 * ``` el`div id="main" "Hello World!"` ```
 * @param {string[]} strings
 * @returns {HTMLElement}
 */
function el(strings, ...interpolations) {
  const ast = parse(strings, interpolations)
  return createElement(ast)
}

export { extendDef, def, arr, el }
