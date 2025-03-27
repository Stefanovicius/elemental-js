import { reactiveType } from './reactive'

export function text(strings, ...interpolations) {
  const textNode = document.createTextNode('')

  const updateTextNode = () => {
    const fullText = strings.reduce((acc, str, i) => {
      const interpolation = interpolations[i]
      return acc + str + (reactiveType(interpolation) ? interpolation.value : (interpolation ?? ''))
    }, '')
    textNode.nodeValue = fullText
  }

  updateTextNode()

  interpolations.forEach(
    (interpolation) => reactiveType(interpolation) && interpolation.subscribe(updateTextNode)
  )

  return textNode
}
