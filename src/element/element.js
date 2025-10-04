import { cleanupNode } from './cleanup'

const getElementConstructor = (tag) => document.createElement(tag).constructor || HTMLElement

export const createCustomElement = (tagName) => {
  const customTagName = `elemental-${tagName}`
  if (!customElements.get(customTagName)) {
    const ElementConstructor = getElementConstructor(tagName)
    class CustomElement extends ElementConstructor {
      constructor() {
        super()
      }
      disconnectedCallback() {
        cleanupNode(this)
      }
    }
    customElements.define(customTagName, CustomElement, { extends: tagName })
  }
  return document.createElement(tagName, { is: customTagName })
}
