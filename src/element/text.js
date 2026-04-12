import { isReactive } from '../reactive/core'
import { attachOwner, detachOwner } from '../reactive/lifecycle'
import { registerCleanup } from './cleanup'

export const text = (strings, ...interpolations) => {
  const textNode = document.createTextNode('')

  const updateTextNode = () => {
    const fullText = strings.reduce((acc, str, i) => {
      const interpolation = interpolations[i]
      return acc + str + (isReactive(interpolation) ? interpolation.val : (interpolation ?? ''))
    }, '')
    textNode.nodeValue = fullText
  }
  updateTextNode()

  interpolations.forEach(interpolation => {
    if (isReactive(interpolation)) {
      attachOwner(interpolation)
      const unsubscribe = interpolation.subscribe(updateTextNode)
      registerCleanup(textNode, unsubscribe)
      registerCleanup(textNode, () => detachOwner(interpolation))
    }
  })
  return textNode
}
