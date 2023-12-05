import { isQuote, isWhitespace, getNonWhitespaceIndex } from './utilities'

const state = {
  TAG: 0,
  ATTRIBUTE: 1,
  ATTRIBUTE_VALUE: 2,
  CONTENT: 3,
}

export function parse(strings, interpolations) {
  const tagIndex = getNonWhitespaceIndex(strings[0], 0)
  if (tagIndex === -1) throw Error('Tag is not defined')

  let currentState = state.TAG
  let currentAttributeKey = ''
  let singleQuote = false
  let buffer = ''

  const result = {
    tag: '',
    attributes: {},
    content: [],
  }

  const clearBuffer = () => (buffer = '')
  const pushToBuffer = (char) => (buffer += char)
  const clearCurrentAttributeKey = () => (currentAttributeKey = '')

  const endQuote = (char) =>
    singleQuote ? char === "'" : char === '"'

  strings.forEach((string, stringIndex) => {
    let charIndex = stringIndex === 0 ? tagIndex : 0
    const endIndex = string.length

    const switchState = () => {
      const newIndex = getNonWhitespaceIndex(string, charIndex)
      if (newIndex === -1) return result
      const nextChar = string.charAt(newIndex)
      if (isQuote(nextChar)) {
        currentState = state.CONTENT
        singleQuote = nextChar === "'"
      } else {
        currentState = state.ATTRIBUTE
        pushToBuffer(nextChar)
      }
      charIndex = newIndex
    }

    for (; charIndex <= endIndex; charIndex++) {
      const char = string.charAt(charIndex)
      const theEnd = charIndex === endIndex

      switch (currentState) {
        
        case state.TAG:
          const setTag = () => {
            result.tag = buffer
            clearBuffer()
          }
          if (theEnd || isWhitespace(char)) {
            setTag()
            if (theEnd) return result
            switchState()
            continue
          }
          pushToBuffer(char)
          break

        case state.ATTRIBUTE:
          const setAttribute = (isBoolean) => {
            currentAttributeKey = buffer
            result.attributes[currentAttributeKey] = isBoolean ? [isBoolean] : []
            clearBuffer()
          }
          if (char === '=') {
            setAttribute()
            const nextChar = string.charAt(++charIndex)
            if (isQuote(nextChar)) {
              singleQuote = nextChar === "'"
              currentState = state.ATTRIBUTE_VALUE
              continue
            }
            throw Error(
              `No opening quote, reading attribute: '${currentAttributeKey}'`,
            )
          }
          if (theEnd || isWhitespace(char)) {
            setAttribute(true)
            if (theEnd) return result
            switchState()
            continue
          }
          pushToBuffer(char)
          break

        case state.ATTRIBUTE_VALUE:
          const attributeValuePush = () => {
            if (buffer) {
              result.attributes[currentAttributeKey].push(buffer)
              clearBuffer()
            }
          }
          if (isQuote(char) && endQuote(char)) {
            attributeValuePush()
            clearCurrentAttributeKey()
            charIndex++
            switchState()
            continue
          }
          if (theEnd && currentAttributeKey) {
            attributeValuePush()
            result.attributes[currentAttributeKey].push(
              interpolations[stringIndex],
            )
            continue
          }
          pushToBuffer(char)
          break

        case state.CONTENT:
          if (theEnd) {
            if (buffer) {
              result.content.push(buffer)
              clearBuffer()
            }
            result.content.push(interpolations[stringIndex])
            continue
          }
          if (isQuote(char) && endQuote(char)) {
            if (buffer) result.content.push(buffer)
            return result
          }
          pushToBuffer(char)
          break
      }
    }
  })

  return result
}
