export class Reactive {
  #value
  #subscribers = new Set()
  #cancellations = new Set()
  constructor(value, ...derivatives) {
    this.#value = value
    if (derivatives.length)
      return [this, ...derivatives.map((derivedConstructor) => this.derive(derivedConstructor))]
  }
  get val() {
    return this.#value
  }
  set val(value) {
    if (this.#value !== value) {
      this.#value = value
      this.#subscribers.forEach((updater) => updater(value))
    }
  }
  derive(constructor) {
    const getValue = () => constructor(this.#value)
    const derived = new Reactive(getValue())
    const unsubscribe = this.subscribe(() => (derived.val = getValue()))
    this.#cancellations.add(unsubscribe)
    return derived
  }
  subscribe(updater) {
    this.#subscribers.add(updater)
    return () => this.#subscribers.delete(updater)
  }
  clearSubscribers() {
    this.#cancellations.forEach((unsubscribe) => unsubscribe())
    this.#cancellations.clear()
  }
}

export class ReactiveArray extends Reactive {
  constructor(initialValue, ...derivatives) {
    super(initialValue, ...derivatives)
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
    this.val = [...this.val.slice(0, start), ...items, ...this.val.slice(start + deleteCount)]
  }
  filter(callback) {
    return this.val.filter(callback)
  }
}

export const arr = (value, ...derivatives) => {
  return new ReactiveArray(value, ...derivatives)
}

export const isReactive = (val) => val instanceof Reactive
