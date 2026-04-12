import { REACTIVE } from './core'
import { isArray } from '../utilities'

export const createReactiveProxy = (value, subscribe, derive, dispose, notify) =>
  new Proxy(value, {
    get(target, prop, receiver) {
      if (prop === REACTIVE) return true
      if (prop === 'val') return isArray(target) ? target : receiver
      if (prop === 'subscribe') return subscribe
      if (prop === 'derive') return derive
      if (prop === 'dispose') return dispose
      return Reflect.get(target, prop)
    },
    set(target, prop, value) {
      if (prop === 'val' && isArray(target)) {
        if (target === value) return true
        target.length = 0
        target.push(...value)
        notify()
        return true
      }
      if (prop === 'val') {
        if (typeof value !== 'object' || value === null || isArray(value)) {
          throw new TypeError('Reactive object value must be a non-null plain object')
        }
        const targetKeys = Object.keys(target)
        const valueKeys = Object.keys(value)
        if (targetKeys.length === valueKeys.length && targetKeys.every(key => target[key] === value[key])) {
          return true
        }
        targetKeys.forEach(key => {
          if (!(key in value)) Reflect.deleteProperty(target, key)
        })
        Reflect.ownKeys(value).forEach(key => Reflect.set(target, key, value[key]))
        notify()
        return true
      }
      if (target[prop] === value) return true
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
