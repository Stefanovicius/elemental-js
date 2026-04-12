import { isReactive } from '../reactive/core'
import { bindReactive, registerCleanup } from './cleanup'
import { isBool, isObject, toKebabCase } from '../utilities'

const getComputedValue = value => (isReactive(value) ? value.val : value)

const isClassMap = object =>
  isObject(object) && Object.values(object).every(value => isBool(getComputedValue(value)))

const isStyleMap = object =>
  isObject(object) &&
  Object.values(object).every(value => {
    const v = getComputedValue(value)
    return typeof v === 'string' || typeof v === 'number'
  })

const objectToClass = object =>
  Object.entries(object)
    .filter(([, value]) => getComputedValue(value))
    .map(([key]) => key)
    .join(' ')

const objectToStyle = object =>
  Object.entries(object)
    .map(([key, value]) => `${toKebabCase(key)}: ${getComputedValue(value)}`)
    .join('; ')

const handleEventListeners = (element, event, listeners) =>
  listeners.forEach(callback => {
    element.addEventListener(event, callback)
    registerCleanup(element, () => element.removeEventListener(event, callback))
  })

const computePropValue = (valueArr, attribute) => {
  const firstValue = getComputedValue(valueArr[0])
  if (isBool(firstValue)) return firstValue
  const values = valueArr.map(getComputedValue)
  if (values.length === 1) {
    if (attribute === 'class' && isClassMap(values[0])) return objectToClass(values[0])
    if (attribute === 'style' && isStyleMap(values[0])) return objectToStyle(values[0])
  }
  return values.join('')
}

const handleProp = (element, attribute, valueArr) => {
  let previousValue = undefined
  const updateProp = () => {
    const value = computePropValue(valueArr, attribute)
    if (value === previousValue) return
    isBool(value)
      ? value
        ? element.setAttribute(attribute, '')
        : element.removeAttribute(attribute)
      : element.setAttribute(attribute, value) || (attribute === 'value' && (element.value = value))
    previousValue = value
  }
  updateProp()
  valueArr.forEach(value => {
    if (isReactive(value)) {
      bindReactive(element, value, updateProp)
    } else if (isObject(value)) {
      Object.values(value).forEach(v => {
        if (isReactive(v)) bindReactive(element, v, updateProp)
      })
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
