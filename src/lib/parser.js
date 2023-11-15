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
  let parsedText = ''
  let singleQuote = false

  const endQuote = (char) =>
    (singleQuote && char === "'") || (!singleQuote && char === '"')

  const result = {
    tag: '',
    attributes: {},
    content: [],
  }

  strings.forEach((string, stringIndex) => {

    let charIndex = stringIndex === 0 ? tagIndex : 0
    const endIndex = string.length

    const switchState = () => {
      charIndex = getNonWhitespaceIndex(string, charIndex)
      if (charIndex === -1) return result
      const nextChar = string.charAt(charIndex)
      if (isQuote(nextChar)) {
        currentState = state.CONTENT
        singleQuote = nextChar === "'"
      } else {
        currentState = state.ATTRIBUTE
        parsedText += nextChar
      }
    }

    for (; charIndex <= endIndex; charIndex++) {
      const char = string.charAt(charIndex)

      switch (currentState) {
        case state.TAG:
          const setTag = () => result.tag = parsedText
          if (charIndex === endIndex) {
            setTag()
            return result
          }
          if (isWhitespace(char)) {
            setTag()
            parsedText = ''
            switchState()
            continue
          }
          parsedText += char
          break

        case state.ATTRIBUTE:
          const setAttribute = (isBoolean) => {
            currentAttribute = parsedText
            result.attributes[currentAttribute] = isBoolean ? [isBoolean] : []
            parsedText = ''
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
          parsedText += char
          break

        case state.ATTRIBUTE_VALUE:
          const attributeValuePush = (resetAttribute = false) => {
            if (parsedText) {
              result.attributes[currentAttribute].push(parsedText)
              parsedText = ''
              resetAttribute && (currentAttribute = '')
            }
          }
          if (charIndex === endIndex) {
            attributeValuePush()
            result.attributes[currentAttribute].push(
              interpolations[stringIndex],
            )
            continue
          }
          if (isQuote(char) && endQuote(char)) {
            attributeValuePush(true)
            charIndex = getNonWhitespaceIndex(string, ++charIndex)
            if (charIndex === -1) return result
            const nextChar = string.charAt(charIndex)
            if (isQuote(nextChar)) {
              currentState = state.CONTENT
              singleQuote = nextChar === "'"
            } else {
              currentState = state.ATTRIBUTE
              parsedText += nextChar
            }
            continue
          }
          parsedText += char
          break

        case state.CONTENT:
          if (charIndex === string.length) {
            if (parsedText) {
              result.content.push(parsedText)
              parsedText = ''
            }
            result.content.push(interpolations[stringIndex])
            continue
          }
          if (isQuote(char) && endQuote(char)) {
            if (parsedText) result.content.push(parsedText)
            return result
          }
          parsedText += char
          break
      }
    }
  })

  return result
}
