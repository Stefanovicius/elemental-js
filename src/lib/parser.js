import { isQuote, isWhitespace, findClosestNonWhitespace } from './utilities'

const state = {
  TAG: 0,
  ATTRIBUTE: 1,
  ATTRIBUTE_VALUE: 2,
  CONTENT: 3,
}

export function parse(strings, interpolations) {
  const tagIndex = findClosestNonWhitespace(strings[0], 0)
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

    for (; charIndex <= endIndex; charIndex++) {
      const char = string.charAt(charIndex)

      switch (currentState) {
        case state.TAG:
          if (charIndex === endIndex) {
            result.tag = parsedText
            return result
          }
          if (isWhitespace(char)) {
            result.tag = parsedText
            parsedText = ''
            charIndex = findClosestNonWhitespace(string, charIndex)
            if (charIndex === -1) return result
            const nextChar = string.charAt(charIndex)
            if (isQuote(nextChar)) {
              singleQuote = nextChar === "'"
              currentState = state.CONTENT
            } else {
              currentState = state.ATTRIBUTE
              parsedText += nextChar
            }
            continue
          }
          parsedText += char
          break

        case state.ATTRIBUTE:
          if (char === '=') {
            currentAttribute = parsedText
            result.attributes[currentAttribute] = []
            parsedText = ''
            const nextChar = string.charAt(++charIndex)
            if (nextChar && isQuote(nextChar)) {
              singleQuote = nextChar === "'"
              currentState = state.ATTRIBUTE_VALUE
              continue
            }
            throw Error(
              `No opening quote, reading attribute: '${currentAttribute}'`,
            )
          }
          if (isWhitespace(char) || charIndex === endIndex) {
            currentAttribute = parsedText
            result.attributes[currentAttribute] = [true]
            parsedText = ''
            if (charIndex === endIndex) return result
            charIndex = findClosestNonWhitespace(string, charIndex)
            if (charIndex === -1) return result
            const nextChar = string.charAt(charIndex)
            if (isQuote(nextChar)) {
              singleQuote = nextChar === "'"
              currentState = state.CONTENT
            } else {
              currentState = state.ATTRIBUTE
              parsedText += nextChar
            }
            continue
          }
          parsedText += char
          break

        case state.ATTRIBUTE_VALUE:
          if (charIndex === endIndex) {
            if (parsedText) {
              result.attributes[currentAttribute].push(parsedText)
              parsedText = ''
            }
            result.attributes[currentAttribute].push(
              interpolations[stringIndex],
            )
            continue
          }
          if (isQuote(char) && endQuote(char)) {
            if (parsedText) {
              result.attributes[currentAttribute].push(parsedText)
              currentAttribute = ''
              parsedText = ''
            }
            charIndex = findClosestNonWhitespace(string, ++charIndex)
            if (charIndex === -1) return result
            const nextChar = string.charAt(charIndex)
            if (isQuote(nextChar)) {
              singleQuote = nextChar === "'"
              currentState = state.CONTENT
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
