import { isReactive } from '../reactive/core'
import { bindReactive } from './cleanup'

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
    if (isReactive(interpolation)) bindReactive(textNode, interpolation, updateTextNode)
  })
  return textNode
}
