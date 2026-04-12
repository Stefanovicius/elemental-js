import { createReactive } from './core'
import {
  registerReactiveDisposer,
  setReactiveSubscribersChangeHandler,
  setReactiveOwnerHandlers
} from './lifecycle'

export const derive = (dependencies, handler) => {
  const calculate = () => handler(...dependencies.map(dependency => dependency.val))
  const result = createReactive(calculate())
  let owners = 0
  let subscriberCount = 0

  const unsubscribers = dependencies.map(dependency => dependency.subscribe(() => (result.val = calculate())))

  const disposeIfUnused = () => owners === 0 && subscriberCount === 0 && result.dispose()

  unsubscribers.forEach(unsubscribe => registerReactiveDisposer(result, unsubscribe))
  setReactiveSubscribersChangeHandler(result, count => {
    subscriberCount = count
    disposeIfUnused()
  })
  setReactiveOwnerHandlers(
    result,
    () => (owners += 1),
    () => {
      if (owners > 0) owners -= 1
      disposeIfUnused()
    }
  )
  return result
}
