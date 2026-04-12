import { createReactivePrimitive } from './primitive'
import { createReactiveProxy } from './proxy'
import {
  initReactiveLifecycle,
  registerReactiveDisposer,
  setReactiveSubscribersChangeHandler,
  setReactiveOwnerHandlers
} from './lifecycle'

export const REACTIVE = Symbol('reactive')

export const createReactive = (initialValue, ...derivedConstructors) => {
  const subscribers = new Set()
  const disposers = new Set()
  let onSubscribersChange = null
  let batchScheduled = false

  const notifySubscribers = () => {
    if (!batchScheduled) {
      batchScheduled = true
      Promise.resolve().then(() => {
        batchScheduled = false
        subscribers.forEach(callback => callback())
      })
    }
  }

  const subscribe = callback => {
    subscribers.add(callback)
    onSubscribersChange?.(subscribers.size)
    return () => unsubscribe(callback)
  }

  const unsubscribe = callback => {
    const deleted = subscribers.delete(callback)
    if (deleted) onSubscribersChange?.(subscribers.size)
    return deleted
  }

  const registerDisposer = callback => {
    disposers.add(callback)
    return () => disposers.delete(callback)
  }

  const dispose = () => {
    disposers.forEach(callback => callback())
    disposers.clear()
    subscribers.clear()
  }

  const setSubscribersChangeHandler = callback => {
    onSubscribersChange = callback
  }

  const reactive =
    typeof initialValue === 'object' && initialValue !== null
      ? createReactiveProxy(initialValue, subscribe, derive, dispose, notifySubscribers)
      : createReactivePrimitive(initialValue, subscribe, derive, dispose, notifySubscribers)

  initReactiveLifecycle(reactive, registerDisposer, setSubscribersChangeHandler)

  function derive(constructor, ...constructors) {
    const getDerivedValue = () => constructor(reactive.val)
    const derived = createReactive(getDerivedValue())
    let owners = 0
    let subscriberCount = 0
    const unsubscribeFromSource = subscribe(() => (derived.val = getDerivedValue()))

    const disposeIfUnused = () => {
      if (owners === 0 && subscriberCount === 0) derived.dispose()
    }

    registerReactiveDisposer(derived, unsubscribeFromSource)
    setReactiveSubscribersChangeHandler(derived, count => {
      subscriberCount = count
      disposeIfUnused()
    })
    setReactiveOwnerHandlers(
      derived,
      () => {
        owners += 1
      },
      () => {
        if (owners > 0) owners -= 1
        disposeIfUnused()
      }
    )

    return constructors.length ? [derived, ...constructors.map(fn => derive(fn))] : derived
  }

  if (!derivedConstructors.length) return reactive
  return [reactive, ...derivedConstructors.map(constructor => derive(constructor))]
}

export const isReactive = value => value && value[REACTIVE]
