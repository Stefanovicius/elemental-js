import { createReactivePrimitive } from './primitive'
import { createReactiveProxy } from './proxy'

export const REACTIVE = Symbol('reactive')

const createDerived = (source, constructor) => {
  const getValue = () => constructor(source.val)
  const derived = def(getValue())
  source.subscribe(() => (derived.val = getValue()))
  return derived
}

export const def = (initialValue, ...derivedConstructors) => {
  let reactive

  const subscribers = new Set()

  const subscribe = (callback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }
  const notify = () => subscribers.forEach((fn) => fn())

  const derive = (constructor, ...constructors) => {
    if (constructor === undefined)
      throw new Error('At least one constructor function must be passed to `derive`')
    const derived = createDerived(reactive, constructor)
    if (constructors.length === 0) return derived
    return [derived, ...constructors.map((constructor) => createDerived(reactive, constructor))]
  }

  reactive =
    typeof initialValue === 'object' && initialValue !== null
      ? createReactiveProxy(initialValue, subscribe, derive, notify)
      : createReactivePrimitive(initialValue, subscribe, derive, notify)

  if (derivedConstructors.length === 0) return reactive
  return [
    reactive,
    ...derivedConstructors.map((constructor) => createDerived(reactive, constructor))
  ]
}

export const isReactive = (value) => value && value[REACTIVE]
