export function isQuote(char) {
  return char === '"' || char === "'"
}

export function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

export function isBool(value) {
  return typeof value === 'boolean'
}

export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toKebabCase(string) {
  return string.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

export const isArray = Array.isArray
