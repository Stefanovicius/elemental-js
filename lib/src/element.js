import { Reactive } from './reactive'
import { isBool } from './utilities'

const isReactive = (val) => val instanceof Reactive
const getComputedValue = (val) => (isReactive(val) ? val.value : val)

const handleEventListeners = (element, event, listeners) => {
  listeners.forEach((callback) => element.addEventListener(event, callback))
}

const handleAttribute = (element, attribute, valueArr) => {
  const computeAttributeValue = () => {
    const firstValue = getComputedValue(valueArr[0])
    return isBool(firstValue)
      ? firstValue
      : valueArr.map((value) => getComputedValue(value)).join('')
  }
  const updateAttribute = () => {
    const value = computeAttributeValue()
    if (isBool(value)) {
      if (value) return element.setAttribute(attribute, '')
      element.removeAttribute(attribute)
    } else element.setAttribute(attribute, value)
  }
  updateAttribute()
  valueArr.forEach((value) => {
    if (isReactive(value)) {
      value.subscription(updateAttribute)
    }
  })
}

const handleAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([attribute, value]) => {
    if (attribute.startsWith('on'))
      handleEventListeners(element, attribute.slice(2), value)
    else handleAttribute(element, attribute, value)
  })
}

const processContent = (content) => {
  if (isReactive(content)) return processContent(content.value)
  if (Array.isArray(content)) return content.flatMap(processContent)
  if (content instanceof Node) return content
  return document.createTextNode(content)
}

const elementsEqual = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') return a === b
  if (a instanceof HTMLElement && b instanceof HTMLElement)
    return a.outerHTML === b.outerHTML
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
  while (element.childNodes.length > newContent.length) {
    element.removeChild(element.lastChild)
  }
}

const handleContent = (element, contentArr) => {
  updateContent(element, contentArr)
  contentArr.forEach((content) => {
    if (isReactive(content)) {
      content.subscription(() => updateContent(element, contentArr))
    }
  })
}

export const createElement = ({ tag, attributes, content }) => {
  const element = document.createElement(tag)
  handleAttributes(element, attributes)
  handleContent(element, content)
  return element
}
