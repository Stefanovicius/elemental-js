import { attachOwner, detachOwner } from '../reactive/lifecycle'

const cleanupMap = new WeakMap()

export function bindReactive(node, reactive, callback) {
  attachOwner(reactive)
  const unsubscribe = reactive.subscribe(callback)
  registerCleanup(node, unsubscribe)
  registerCleanup(node, () => detachOwner(reactive))
}

export function registerCleanup(element, callback) {
  let handlers = cleanupMap.get(element)
  if (!handlers) {
    handlers = []
    cleanupMap.set(element, handlers)
  }
  handlers.push(callback)
}

export function cleanupNode(element) {
  const handlers = cleanupMap.get(element)
  if (handlers) {
    handlers.forEach(handler => handler())
    cleanupMap.delete(element)
  }
}

export function cleanupTree(node) {
  cleanupNode(node)
  node.childNodes.forEach(cleanupTree)
}
