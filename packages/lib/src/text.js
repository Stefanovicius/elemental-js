import { isReactive } from './reactive/core'

export function text(strings, ...interpolations) {
  const textNode = document.createTextNode('')

  const updateTextNode = () => {
    const fullText = strings.reduce((acc, str, i) => {
      const interpolation = interpolations[i]
      return acc + str + (isReactive(interpolation) ? interpolation.val : (interpolation ?? ''))
    }, '')
    textNode.nodeValue = fullText
  }
  updateTextNode()

  interpolations.forEach(
    (interpolation) => isReactive(interpolation) && interpolation.subscribe(updateTextNode)
  )
  return textNode
}
