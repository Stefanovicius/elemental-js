import { Reactive } from './reactive'
import { isBool } from './utilities'

const handleEventListeners = (element, event, listeners) => {
  listeners.forEach((callback) => element.addEventListener(event, callback))
}

const handleAttribute = (element, attribute, valueArr) => {
  const computeAttributeValue = () => {
    const firstValue = valueArr[0]
    const firstValueIsReactive = firstValue instanceof Reactive
    if (isBool(firstValue) || (firstValueIsReactive && isBool(firstValue.val)))
      return firstValueIsReactive ? firstValue.val : firstValue
    else
      return valueArr.map((v) => (v instanceof Reactive ? v.val : v)).join('')
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
    if (value instanceof Reactive) {
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

const handleContent = (element, contentArr) => {
  const updateContent = () => {
    element.replaceChildren()
    contentArr.forEach((content) => {
      const isReactive = content instanceof Reactive
      const value = isReactive ? content.render() : content
      if (Array.isArray(content) || (isReactive && Array.isArray(content.val)))
        element.append(...value)
      else element.append(value)
    })
  }
  updateContent()
  contentArr.forEach((content) => {
    if (content instanceof Reactive) {
      content.subscription(updateContent)
    }
  })
}

export const createElement = ({ tag, attributes, content }) => {
  const element = document.createElement(tag)
  handleAttributes(element, attributes)
  handleContent(element, content)
  return element
}
