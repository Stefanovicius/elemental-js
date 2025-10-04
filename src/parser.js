import { isQuote, isWhitespace } from './utilities'

const TAG = 0
const WHITESPACE = 1
const PROP_KEY = 2
const PROP_VALUE = 3

export function parse(strings, ...interpolations) {
  let state = TAG
  let buffer = ''
  let propKey = null
  let quote = null

  const result = Object.create(null)
  result.props = Object.create(null)
  result.tag = null

  strings.forEach((string, stringIndex) => {
    const endIndex = string.length

    for (let charIndex = 0; charIndex <= endIndex; charIndex++) {
      const endOfString = charIndex === endIndex
      let char = string.charAt(charIndex)

      switch (state) {
        case TAG:
          if (isWhitespace(char) || endOfString) {
            if (!buffer) throw Error('Invalid tag declaration')
            result.tag = buffer
            buffer = ''
            state = WHITESPACE
            break
          }
          buffer += char
          break

        case WHITESPACE:
          if (endOfString) return result
          if (isWhitespace(char)) break
          buffer += char
          state = PROP_KEY
          break

        case PROP_KEY:
          if (endOfString) {
            propKey = buffer
            buffer = ''
            break
          }
          if (isWhitespace(char)) {
            result.props[buffer] = [true]
            buffer = ''
            state = WHITESPACE
            break
          }
          if (char === '=') {
            propKey = buffer
            buffer = ''
            state = PROP_VALUE
            result.props[propKey] = []
            if (endOfString) break
            char = string[++charIndex]
            if (isQuote(char)) {
              quote = char
              break
            }
            if (!char) break
          }
          buffer += char
          break

        case PROP_VALUE:
          if (endOfString) {
            if (buffer) {
              result.props[propKey].push(buffer)
              buffer = ''
            }
            break
          }
          if (isQuote(char) && char === quote) {
            if (buffer) {
              result.props[propKey].push(buffer)
              buffer = ''
            }
            propKey = null
            quote = null
            state = WHITESPACE
            break
          }
          buffer += char
          break
      }
    }

    if (interpolations.length > stringIndex) {
      if (state !== PROP_VALUE) throw Error('Invalid interpolation')
      result.props[propKey].push(interpolations[stringIndex])
      if (!quote) state = WHITESPACE
    } else if (propKey) {
      result.props[propKey] = [true]
    }
  })

  return result
}
