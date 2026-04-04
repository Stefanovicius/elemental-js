import { REACTIVE } from './core'

export const createReactivePrimitive = (initialValue, subscribe, derive, dispose, notify) => {
  let value = initialValue
  return {
    get val() {
      return value
    },
    set val(newValue) {
      if (value === newValue) return
      value = newValue
      notify()
    },
    subscribe,
    derive,
    dispose,
    valueOf() {
      return value
    },
    toString() {
      return String(value)
    },
    [Symbol.toPrimitive]() {
      return value
    },
    [REACTIVE]: true
  }
}
