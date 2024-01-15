import { isQuote, isWhitespace, isAlphabetic } from './utilities'

const State = {
  TAG: 0,
  WHITESPACE: 1,
  ATTRIBUTE: 2,
  ATTRIBUTE_VALUE: 3,
  CONTENT: 4
}

export function parse(strings, interpolations) {
  let state = State.TAG
  let singleQuote = false
  let attribute = ''
  let buffer = ''

  const result = {
    tag: '',
    attributes: {},
    content: []
  }

  const setTag = () => {
    result.tag = buffer
    buffer = ''
  }
  const addAttribute = () => {
    result.attributes[buffer] = []
    attribute = buffer
    buffer = ''
  }
  const attributePushValue = (value) => {
    result.attributes[attribute].push(value)
  }
  const isEndQuote = (char) => {
    return singleQuote ? char === "'" : char === '"'
  }

  strings.forEach((string, stringIndex) => {
    const endIndex = string.length

    for (let charIndex = 0; charIndex <= endIndex; charIndex++) {
      const endOfString = charIndex === endIndex
      const char = string.charAt(charIndex)

      switch (state) {
        case State.TAG:
          if (isWhitespace(char)) {
            if (buffer === '') continue
            setTag()
            state = State.WHITESPACE
            continue
          }
          if (endOfString) {
            if (buffer === '') throw Error(`Tag is not defined`)
            setTag()
            return result
          }
          buffer += char
          continue

        case State.WHITESPACE:
          if (isAlphabetic(char)) {
            buffer += char
            state = State.ATTRIBUTE
          } else if (isQuote(char)) {
            singleQuote = char === "'"
            state = State.CONTENT
          }
          continue

        case State.ATTRIBUTE:
          if (endOfString || isWhitespace(char)) {
            addAttribute()
            attributePushValue(true)
            if (endOfString) return result
            state = State.WHITESPACE
            continue
          }
          if (char === '=') {
            addAttribute()
            const nextIndex = charIndex + 1
            const nextChar = string.charAt(nextIndex)
            if (isQuote(nextChar)) {
              charIndex = nextIndex
              singleQuote = nextChar === "'"
              state = State.ATTRIBUTE_VALUE
            } else {
              attributePushValue(interpolations[stringIndex])
              state = State.WHITESPACE
            }
            continue
          }
          buffer += char
          continue

        case State.ATTRIBUTE_VALUE:
          if (endOfString || isEndQuote(char)) {
            if (buffer) {
              attributePushValue(buffer)
              buffer = ''
            }
            if (endOfString) attributePushValue(interpolations[stringIndex])
            else state = State.WHITESPACE
            continue
          }
          buffer += char
          continue

        case State.CONTENT:
          if (endOfString || isEndQuote(char)) {
            if (buffer) {
              result.content.push(buffer)
              buffer = ''
            }
            if (endOfString) result.content.push(interpolations[stringIndex])
            else state = State.WHITESPACE
            continue
          }
          buffer += char
          continue
      }
    }
  })

  return result
}
