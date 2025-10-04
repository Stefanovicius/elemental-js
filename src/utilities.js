export function isQuote(char) {
  return char === '"' || char === "'"
}

export function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

export function isBool(value) {
  return typeof value === 'boolean'
}

export const isArray = Array.isArray
