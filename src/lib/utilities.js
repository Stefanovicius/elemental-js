export function isQuote(char) {
  return char === '"' || char === "'"
}

export function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

export function getNonWhitespaceIndex(str, i) {
  while (i < str.length) {
    if (str[i] !== ' ' && str[i] !== '\t' && str[i] !== '\n' && str[i] !== '\r')
      return i
    i++
  }
  return -1
}

export function isBool(value) {
  return typeof value === 'boolean'
}
