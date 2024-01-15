export function isQuote(char) {
  return char === '"' || char === "'"
}

export function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

export function isAlphabetic(char) {
  const charCode = char.charCodeAt(0)
  return (
    (charCode >= 65 && charCode <= 90) || // Uppercase letters
    (charCode >= 97 && charCode <= 122) // Lowercase letters
  )
}

export function isBool(value) {
  return typeof value === 'boolean'
}
