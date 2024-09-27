import { Reactive } from './reactive'
import { isBool } from './utilities'

const isReactive = (val) => val instanceof Reactive
const getComputedValue = (val) => (isReactive(val) ? val.val : val)

const handleEventListeners = (element, event, listeners) => {
  listeners.forEach((callback) => element.addEventListener(event, callback))
}

const computeAttributeValue = (valueArr) => {
  const firstValue = getComputedValue(valueArr[0])
  return isBool(firstValue) ? firstValue : valueArr.map(getComputedValue).join('')
}

const handleAttribute = (element, attribute, valueArr) => {
  const updateAttribute = () => {
    const value = computeAttributeValue(valueArr)
    isBool(value)
      ? value
        ? element.setAttribute(attribute, '')
        : element.removeAttribute(attribute)
      : element.setAttribute(attribute, value)
  }
  updateAttribute()
  valueArr.forEach((value) => isReactive(value) && value.subscribe(updateAttribute))
}

const handleAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([attribute, value]) => {
    attribute.startsWith('on')
      ? handleEventListeners(element, attribute.slice(2), value)
      : handleAttribute(element, attribute, value)
  })
}

const processChildren = (content) => {
  if (isReactive(content)) return processChildren(content.val)
  if (Array.isArray(content)) return content.flatMap(processChildren)
  return content instanceof Node ? content : document.createTextNode(content)
}

const elementsEqual = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') return a === b
  if (a instanceof HTMLElement && b instanceof HTMLElement) return a.isEqualNode(b)
  return false
}

const updateChildren = (element, contentArr) => {
  const newContent = contentArr.flatMap(processChildren)
  newContent.forEach((newChild, index) => {
    const existingChild = element.childNodes[index]
    if (!existingChild) {
      element.appendChild(newChild)
    } else if (!elementsEqual(newChild, existingChild)) {
      element.replaceChild(newChild, existingChild)
    }
  })
  while (element.childNodes.length > newContent.length) element.removeChild(element.lastChild)
}

const handleChildren = (element, contentArr) => {
  updateChildren(element, contentArr)
  contentArr.forEach(
    (content) => isReactive(content) && content.subscribe(() => updateChildren(element, contentArr))
  )
}

export const createElement = ({ tag, attributes, content }) => {
  const element = document.createElement(tag)
  handleAttributes(element, attributes)
  handleChildren(element, content)
  return element
}
