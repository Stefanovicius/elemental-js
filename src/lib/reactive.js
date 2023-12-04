export class Reactive {
  #value
  #render
  #subscribers = new Set()
  constructor(initialValue, renderMethod) {
    this.#value = initialValue
    this.#render = renderMethod || ((value) => value)
  }
  get val() {
    return this.#value
  }
  set val(value) {
    if (this.#value === value) return
    this.#value = value
    this.#subscribers.forEach((updater) => updater(this.val))
  }
  subscription(updater) {
    this.#subscribers.add(updater)
  }
  render() {
    if (Array.isArray(this.val)) return this.val.reduce((rendered, item, index) => {
      const value = this.#render(item, index)
      if (value) rendered.push(value)
      return rendered
    }, [])
    return this.#render(this.val) ?? ''
  }
}

export class ReactiveArray extends Reactive {
  constructor(initialValue, renderMethod) {
    super(initialValue, renderMethod)
  }
  get length() {
    return this.val.length
  }
  push(...items) {
    this.val = [...this.val, ...items]
    return this.val.length
  }
  pop() {
    this.val = this.val.slice(0, -1)
    return this.val[this.val.length - 1]
  }
  shift() {
    const [first, ...rest] = this.val
    this.val = rest
    return first
  }
  unshift(...items) {
    this.val = [...items, ...this.val]
    return this.val.length
  }
  splice(start, deleteCount, ...items) {
    this.val = [
      ...this.val.slice(0, start),
      ...items,
      ...this.val.slice(start + deleteCount),
    ]
  }
  filter(callback) {
    return this.val.filter(callback)
  }
}

export const arr = (value, renderMethod) => {
  return new ReactiveArray(value, renderMethod)
}
