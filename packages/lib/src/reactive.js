const REACTIVE = Symbol('reactive')

export function def(initialValue, ...derivedConstructors) {
  const subscribers = new Set()

  const subscribe = (callback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }
  const notify = () => subscribers.forEach((fn) => fn())

  const type = Array.isArray(initialValue) ? 'array' : typeof initialValue

  let reactive

  const derive = (constructor, ...constructors) => {
    if (constructor === undefined)
      throw new Error('At least one constructor function must be passed to `derive`')
    const derived = createDerived(reactive, constructor)
    if (constructors.length === 0) return derived
    return [derived, ...constructors.map((constructor) => createDerived(reactive, constructor))]
  }

  if (typeof initialValue === 'object' && initialValue !== null) {
    reactive = new Proxy(initialValue, {
      get(target, prop) {
        if (prop === REACTIVE) return type
        if (prop === 'value' && type === 'array') return target
        if (prop === 'subscribe') return subscribe
        if (prop === 'derive') return derive
        return Reflect.get(target, prop)
      },
      set(target, prop, value) {
        if (target[prop] === value) return true
        if (prop === 'value' && type === 'array') {
          target.length = 0
          target.push(...value)
          notify()
          return true
        }
        Reflect.set(target, prop, value)
        notify()
        return true
      },
      deleteProperty(target, prop) {
        const result = Reflect.deleteProperty(target, prop)
        notify()
        return result
      }
    })
  } else {
    let value = initialValue

    reactive = {
      get value() {
        return value
      },
      set value(newValue) {
        if (value === newValue) return
        value = newValue
        notify()
      },
      [REACTIVE]: type,
      subscribe,
      derive,
      valueOf() {
        return value
      },
      toString() {
        return String(value)
      },
      [Symbol.toPrimitive]() {
        return value
      }
    }
  }

  function createDerived(source, constructor) {
    const sourceValue = source.value !== undefined ? source.value : source
    const derived = def(constructor(sourceValue))

    source.subscribe(() => {
      const newSourceValue = source.value !== undefined ? source.value : source
      derived.value = constructor(newSourceValue)
    })

    return derived
  }

  if (derivedConstructors.length === 0) return reactive
  return [
    reactive,
    ...derivedConstructors.map((constructor) => createDerived(reactive, constructor))
  ]
}

export const reactiveType = (value) => (value && value[REACTIVE]) || false
