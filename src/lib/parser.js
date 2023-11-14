export function parse(strings, interpolations) {
  const tagIndex = findClosestNonWhitespace(strings[0], 0)
  if (tagIndex === -1) throw Error('Tag is not defined')

  let parsing = 'tag'
  let currentAttribute = ''
  let parsedText = ''
  let singleQuote = false
  const endingQuote = (char) =>
    (singleQuote && char === "'") || (!singleQuote && char === '"')

  const result = {
    tag: '',
    attributes: {},
    content: [],
  }

  strings.forEach((string, stringIndex) => {
    let charIndex = stringIndex === 0 ? tagIndex : 0
    for (; charIndex <= string.length; charIndex++) {
      const char = string.charAt(charIndex)
      if (parsing === 'tag') {
        if (charIndex === string.length) {
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
            parsing = 'content'
          } else {
            parsing = 'attribute'
            parsedText += nextChar
          }
          continue
        }
        parsedText += char
      }
      if (parsing === 'content') {
        if (charIndex === string.length) {
          if (parsedText) {
            result.content.push(parsedText)
            parsedText = ''
          }
          result.content.push(interpolations[stringIndex])
          continue
        }
        if (isQuote(char) && endingQuote(char)) {
          if (parsedText) result.content.push(parsedText)
          return result
        }
        parsedText += char
      }
      if (parsing === 'attribute') {
        if (currentAttribute) {
          if (charIndex === string.length) {
            if (parsedText) {
              result.attributes[currentAttribute].push(parsedText)
              parsedText = ''
            }
            result.attributes[currentAttribute].push(
              interpolations[stringIndex],
            )
            continue
          }
          if (isQuote(char)) {
            if (endingQuote(char)) {
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
                parsing = 'content'
              } else {
                parsedText += nextChar
              }
            } else {
              parsedText += char
            }
            continue
          }
        } // TODO: This check is to allow boolean attributes: " || char === ' ' || (charIndex === string.length && strings.length === 1)"
        else if (char === '=' || char === ' ' || (charIndex === string.length && strings.length === 1)) {
          currentAttribute = parsedText
          result.attributes[currentAttribute] = []
          parsedText = ''
          // TODO: Same, It'll need a refactor
          if (char === ' ' || (charIndex === string.length && strings.length === 1)) return
          const nextChar = string.charAt(++charIndex)
          if (nextChar && isQuote(nextChar)) {
            singleQuote = nextChar === "'"
          } else {
            throw Error(
              `Invalid char: '${char}' in string: '${string}', at position: ${charIndex}\n${' '.repeat(charIndex + 46) + '^'}`,
            )
          }
          continue
        }
        parsedText += char
      }
    }
  })

  return result
}

function isQuote(char) {
  return char === '"' || char === "'"
}

function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

function findClosestNonWhitespace(str, index) {
  while (index < str.length) {
    if (
      str[index] !== ' ' &&
      str[index] !== '\t' &&
      str[index] !== '\n' &&
      str[index] !== '\r'
    )
      return index
    index++
  }
  return -1
}
