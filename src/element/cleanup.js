const cleanupMap = new WeakMap()

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
    handlers.forEach((fn) => fn())
    cleanupMap.delete(element)
  }
}
