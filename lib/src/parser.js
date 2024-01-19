import { isQuote, isSingleQuote, isWhitespace, isAlphabetic } from './utilities'

const ParserState = {
  TAG: 0,
  WHITESPACE: 1,
  ATTRIBUTE: 2,
  ATTRIBUTE_VALUE: 3,
  CONTENT: 4
}

export function parse(strings, ...interpolations) {
  let currentState = ParserState.TAG
  let isSingleQuoted = false
  let attributeNameBuffer = ''
  let globalBuffer = ''

  const result = {
    tag: '',
    attributes: {},
    content: []
  }

  const setState = (newState) => {
    currentState = newState
  }
  const setSingleQuoted = (char) => {
    return (isSingleQuoted = isSingleQuote(char))
  }
  const isEndQuote = (char) => {
    return isSingleQuoted ? isSingleQuote(char) : char === '"'
  }
  const pushToBuffer = (char) => {
    globalBuffer += char
  }
  const clearBuffer = () => {
    globalBuffer = ''
  }
  const isBufferEmpty = () => {
    return globalBuffer === ''
  }
  const setTag = () => {
    result.tag = globalBuffer
    clearBuffer()
  }
  const addAttribute = () => {
    result.attributes[globalBuffer] = []
    attributeNameBuffer = globalBuffer
    clearBuffer()
  }
  const pushToAttributeValue = (value) => {
    result.attributes[attributeNameBuffer].push(value)
  }
  const pushToContent = (value) => {
    result.content.push(value)
  }

  strings.forEach((string, stringIndex) => {
    const endIndex = string.length

    for (let charIndex = 0; charIndex <= endIndex; charIndex++) {
      const endOfString = charIndex === endIndex
      const char = string.charAt(charIndex)

      switch (currentState) {
        case ParserState.TAG:
          if (isWhitespace(char)) {
            if (isBufferEmpty()) break
            setTag()
            setState(ParserState.WHITESPACE)
            break
          }
          if (endOfString) {
            if (isBufferEmpty()) throw Error('Tag is not defined')
            setTag()
            return result
          }
          pushToBuffer(char)
          break

        case ParserState.WHITESPACE:
          if (isAlphabetic(char)) {
            pushToBuffer(char)
            setState(ParserState.ATTRIBUTE)
          } else if (isQuote(char)) {
            setSingleQuoted(char)
            setState(ParserState.CONTENT)
          }
          break

        case ParserState.ATTRIBUTE:
          if (endOfString || isWhitespace(char)) {
            addAttribute()
            pushToAttributeValue(true)
            if (endOfString) return result
            setState(ParserState.WHITESPACE)
            break
          }
          if (char === '=') {
            addAttribute()
            const nextCharIndex = charIndex + 1
            const nextChar = string.charAt(nextCharIndex)
            if (isQuote(nextChar)) {
              charIndex = nextCharIndex
              setSingleQuoted(nextChar)
              setState(ParserState.ATTRIBUTE_VALUE)
            } else {
              pushToAttributeValue(interpolations[stringIndex])
              setState(ParserState.WHITESPACE)
            }
            break
          }
          pushToBuffer(char)
          break

        case ParserState.ATTRIBUTE_VALUE:
          if (endOfString || isEndQuote(char)) {
            if (globalBuffer) {
              pushToAttributeValue(globalBuffer)
              clearBuffer()
            }
            if (endOfString)
              pushToAttributeValue(interpolations[stringIndex])
            else setState(ParserState.WHITESPACE)
            break
          }
          pushToBuffer(char)
          break

        case ParserState.CONTENT:
          if (endOfString || isEndQuote(char)) {
            if (globalBuffer) {
              pushToContent(globalBuffer)
              clearBuffer()
            }
            if (endOfString) pushToContent(interpolations[stringIndex])
            else setState(ParserState.WHITESPACE)
            break
          }
          pushToBuffer(char)
          break
      }
    }
  })

  return result
}
