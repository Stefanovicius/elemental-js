import { isReactive } from '../reactive/core'
import { registerCleanup } from './cleanup'
import { isBool } from '../utilities'

const getComputedValue = (value) => (isReactive(value) ? value.val : value)

const handleEventListeners = (element, event, listeners) =>
  listeners.forEach((callback) => {
    element.addEventListener(event, callback)
    registerCleanup(element, () => element.removeEventListener(event, callback))
  })

const computePropValue = (valueArr) => {
  const firstValue = getComputedValue(valueArr[0])
  return isBool(firstValue) ? firstValue : valueArr.map(getComputedValue).join('')
}

const handleProp = (element, attribute, valueArr) => {
  let previousValue = undefined
  const updateProp = () => {
    const value = computePropValue(valueArr)
    if (value === previousValue) return
    isBool(value)
      ? value
        ? element.setAttribute(attribute, '')
        : element.removeAttribute(attribute)
      : element.setAttribute(attribute, value) || (attribute === 'value' && (element.value = value))
    previousValue = value
  }
  updateProp()
  valueArr.forEach((value) => {
    if (isReactive(value)) {
      const unsubscribe = value.subscribe(updateProp)
      registerCleanup(element, unsubscribe)
    }
  })
}

export const handleProps = (element, props) => {
  Object.entries(props).forEach(([prop, value]) =>
    prop.startsWith('on')
      ? handleEventListeners(element, prop.slice(2), value)
      : handleProp(element, prop, value)
  )
}
