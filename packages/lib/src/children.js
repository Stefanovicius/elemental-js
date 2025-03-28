import { isReactive } from './reactive/core'

const processChildren = (child) => {
  if (isReactive(child)) return processChildren(child.val)
  if (Array.isArray(child)) return child.flatMap(processChildren)
  return child instanceof Node ? child : document.createTextNode(child)
}

const elementsEqual = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') return a === b
  if (a instanceof HTMLElement && b instanceof HTMLElement) return a.isEqualNode(b)
  return false
}

const updateChildren = (element, children) => {
  const newContent = children.flatMap(processChildren)
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

export const handleChildren = (element, children) => {
  updateChildren(element, children)
  children.forEach(
    (content) => isReactive(content) && content.subscribe(() => updateChildren(element, children))
  )
}
