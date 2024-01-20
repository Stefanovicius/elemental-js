const SELF_CLOSING_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

const createAttributes = (attributes) => {
  return Object.entries(attributes)
    .map(([attribute, value]) => {
      if (value === true) return ` ${attribute}`
      if (value === false) return ''
      return ` ${attribute}="${value}"`
    })
    .join('')
}

const createContent = (content) => {
  if (Array.isArray(content)) return content.map(createContent).join('')
  return content
}

export function createHtml({ tag, attributes, content }) {
  if (SELF_CLOSING_TAGS.includes(tag)) return `<${tag}${createAttributes(attributes)}>`
  return `<${tag}${createAttributes(attributes)}>${createContent(content)}</${tag}>`
}
