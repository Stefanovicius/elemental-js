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

  const setState = (newState) => (currentState = newState)
  const setQuoteType = (char) => (isSingleQuoted = isSingleQuote(char))
  const isEndQuote = (char) => (isSingleQuoted ? isSingleQuote(char) : char === '"')
  const pushToBuffer = (char) => (globalBuffer += char)
  const isBufferEmpty = () => globalBuffer === ''
  const clearBuffer = () => (globalBuffer = '')
  const pushToAttributeValue = (value) => result.attributes[attributeNameBuffer].push(value)
  const parsingAttributeValue = () => currentState === ParserState.ATTRIBUTE_VALUE
  const pushToContent = (value) => result.content.push(value)

  const setTag = () => {
    result.tag = globalBuffer
    clearBuffer()
  }
  const addAttribute = () => {
    result.attributes[globalBuffer] = []
    attributeNameBuffer = globalBuffer
    clearBuffer()
  }

  strings.forEach((string, stringIndex) => {
    const endIndex = string.length

    for (let charIndex = 0; charIndex <= endIndex; charIndex++) {
      const endOfString = charIndex === endIndex
      const char = string.charAt(charIndex)

      switch (currentState) {
        case ParserState.TAG:
          if (isWhitespace(char)) {
            if (!isBufferEmpty()) {
              setTag()
              setState(ParserState.WHITESPACE)
            }
            break
          }
          if (isQuote(char)) {
            setQuoteType(char)
            setState(ParserState.CONTENT)
            break
          }
          if (endOfString) {
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
            setQuoteType(char)
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
              setQuoteType(nextChar)
              setState(ParserState.ATTRIBUTE_VALUE)
            } else {
              pushToAttributeValue(interpolations[stringIndex])
              setState(ParserState.WHITESPACE)
            }
            break
          }
          pushToBuffer(char)
          break

        default:
          if (endOfString || isEndQuote(char)) {
            if (globalBuffer) {
              parsingAttributeValue()
                ? pushToAttributeValue(globalBuffer)
                : pushToContent(globalBuffer)
              clearBuffer()
            }
            if (endOfString) {
              parsingAttributeValue()
                ? pushToAttributeValue(interpolations[stringIndex])
                : pushToContent(interpolations[stringIndex])
            } else setState(ParserState.WHITESPACE)
          } else pushToBuffer(char)
      }
    }
  })

  return result
}
