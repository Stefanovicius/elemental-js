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
  let currentAttribute = null
  let singleQuote = false
  let buffer = ''

  const result = {
    tag: '',
    attributes: {},
    content: [],
  }

  const clearBuffer = () => (buffer = '')
  const pushToBuffer = (char) => (buffer += char)

  const endQuote = (char) =>
    (singleQuote && char === "'") || (!singleQuote && char === '"')

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

      switch (currentState) {
        
        case state.TAG:
          const setTag = () => (result.tag = buffer)

          if (charIndex === endIndex) {
            setTag()
            return result
          }
          if (isWhitespace(char)) {
            setTag()
            clearBuffer()
            switchState()
            continue
          }
          pushToBuffer(char)
          break

        case state.ATTRIBUTE:
          const setAttribute = (isBoolean) => {
            currentAttribute = buffer
            result.attributes[currentAttribute] = isBoolean ? [isBoolean] : []
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
              `No opening quote, reading attribute: '${currentAttribute}'`,
            )
          }
          const theEnd = charIndex === endIndex
          if (theEnd || isWhitespace(char)) {
            setAttribute(true)
            if (theEnd) return result
            switchState()
            continue
          }
          pushToBuffer(char)
          break

        case state.ATTRIBUTE_VALUE:
          const attributeValuePush = (resetAttribute = false) => {
            if (buffer) {
              result.attributes[currentAttribute].push(buffer)
              clearBuffer()
              resetAttribute && (currentAttribute = '')
            }
          }
          if (currentAttribute && charIndex === endIndex) {
            attributeValuePush()
            result.attributes[currentAttribute].push(
              interpolations[stringIndex],
            )
            continue
          }
          if (isQuote(char) && endQuote(char)) {
            attributeValuePush(true)
            charIndex++
            switchState()
            continue
          }
          pushToBuffer(char)
          break

        case state.CONTENT:
          if (charIndex === string.length) {
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
