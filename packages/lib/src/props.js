import { isReactive } from './reactive/core'
import { isBool } from './utilities'

const getComputedValue = (value) => (isReactive(value) ? value.val : value)

const handleEventListeners = (element, event, listeners) =>
  listeners.forEach((callback) => element.addEventListener(event, callback))

const computePropValue = (valueArr) => {
  const firstValue = getComputedValue(valueArr[0])
  return isBool(firstValue) ? firstValue : valueArr.map(getComputedValue).join('')
}

const handleProp = (element, attribute, valueArr) => {
  const updateProp = () => {
    const value = computePropValue(valueArr)
    isBool(value)
      ? value
        ? element.setAttribute(attribute, '')
        : element.removeAttribute(attribute)
      : element.setAttribute(attribute, value)
  }
  updateProp()
  valueArr.forEach((value) => isReactive(value) && value.subscribe(updateProp))
}

export const handleProps = (element, props) => {
  Object.entries(props).forEach(([prop, value]) =>
    prop.startsWith('on')
      ? handleEventListeners(element, prop.slice(2), value)
      : handleProp(element, prop, value)
  )
}
