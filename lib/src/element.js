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

const processContent = (content) => {
  if (isReactive(content)) return processContent(content.val)
  if (Array.isArray(content)) return content.flatMap(processContent)
  return content instanceof Node ? content : document.createTextNode(content)
}

const elementsEqual = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') return a === b
  if (a instanceof HTMLElement && b instanceof HTMLElement) return a.isEqualNode(b)
  return false
}

const updateContent = (element, contentArr) => {
  const newContent = contentArr.flatMap(processContent)
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

const handleContent = (element, contentArr) => {
  updateContent(element, contentArr)
  contentArr.forEach(
    (content) => isReactive(content) && content.subscribe(() => updateContent(element, contentArr))
  )
}

export const createElement = ({ tag, attributes, content }) => {
  const element = document.createElement(tag)
  handleAttributes(element, attributes)
  handleContent(element, content)
  return element
}
