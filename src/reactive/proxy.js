import { REACTIVE } from './core'
import { isArray } from '../utilities'

export const createReactiveProxy = (value, subscribe, derive, notify) =>
  new Proxy(value, {
    get(target, prop) {
      if (prop === REACTIVE) return true
      if (prop === 'val' && isArray(target)) return target
      if (prop === 'subscribe') return subscribe
      if (prop === 'derive') return derive
      return Reflect.get(target, prop)
    },
    set(target, prop, value) {
      if (target[prop] === value) return true
      if (prop === 'val' && isArray(target)) {
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
