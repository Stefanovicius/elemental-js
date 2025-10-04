import { createReactivePrimitive } from './primitive'
import { createReactiveProxy } from './proxy'

export const REACTIVE = Symbol('reactive')

export const createReactive = (initialValue, ...derivedConstructors) => {
  let batchScheduled = false
  const subscribers = new Set()

  const notifySubscribers = () => {
    if (!batchScheduled) {
      batchScheduled = true
      Promise.resolve().then(() => {
        batchScheduled = false
        subscribers.forEach((callback) => callback())
      })
    }
  }

  const subscribe = (callback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }

  const reactive =
    typeof initialValue === 'object' && initialValue !== null
      ? createReactiveProxy(initialValue, subscribe, derive, notifySubscribers)
      : createReactivePrimitive(initialValue, subscribe, derive, notifySubscribers)

  function derive(constructor, ...constructors) {
    const getDerivedValue = () => constructor(reactive.val)
    const derived = createReactive(getDerivedValue())
    subscribe(() => (derived.val = getDerivedValue()))
    return constructors.length ? [derived, ...constructors.map((fn) => derive(fn))] : derived
  }

  if (!derivedConstructors.length) return reactive
  return [reactive, ...derivedConstructors.map((constructor) => derive(constructor))]
}

export const isReactive = (value) => value && value[REACTIVE]
