import { isReactive } from '../reactive/core'
import { attachOwner, detachOwner } from '../reactive/lifecycle'
import { isArray } from '../utilities'
import { cleanupTree, registerCleanup } from './cleanup'

const processChildren = (child) => {
  if (isReactive(child)) {
    const value = child.val
    return value === child ? document.createTextNode(child) : processChildren(value)
  }
  if (isArray(child)) return child.flatMap(processChildren)
  return child instanceof Node ? child : document.createTextNode(child)
}

const collectReactiveChildren = (child, collected = new Set()) => {
  if (isReactive(child)) {
    if (collected.has(child)) return collected
    collected.add(child)
    const value = child.val
    return value === child ? collected : collectReactiveChildren(value, collected)
  }
  if (isArray(child)) child.forEach((item) => collectReactiveChildren(item, collected))
  return collected
}

const elementsEqual = (a, b) => {
  return a instanceof Node && b instanceof Node && a.isEqualNode(b)
}

const updateChildren = (element, children) => {
  const newContent = children.flatMap(processChildren)
  newContent.forEach((newChild, index) => {
    const existingChild = element.childNodes[index]
    if (!existingChild) {
      element.appendChild(newChild)
    } else if (!elementsEqual(newChild, existingChild)) {
      cleanupTree(existingChild)
      element.replaceChild(newChild, existingChild)
    }
  })
  while (element.childNodes.length > newContent.length) {
    cleanupTree(element.lastChild)
    element.removeChild(element.lastChild)
  }
}

export const handleChildren = (element, children) => {
  let dependencies = []
  let unsubscribers = []

  const clearSubscriptions = () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
    unsubscribers = []
  }

  const updateSubscriptions = () => {
    const nextDependencies = [...collectReactiveChildren(children)]
    if (
      nextDependencies.length === dependencies.length &&
      nextDependencies.every((dependency, index) => dependency === dependencies[index])
    ) {
      return
    }
    dependencies.forEach(detachOwner)
    clearSubscriptions()
    nextDependencies.forEach(attachOwner)
    unsubscribers = nextDependencies.map((dependency) => dependency.subscribe(render))
    dependencies = nextDependencies
  }

  const render = () => {
    updateChildren(element, children)
    updateSubscriptions()
  }

  render()
  registerCleanup(element, () => {
    dependencies.forEach(detachOwner)
    clearSubscriptions()
  })
}
