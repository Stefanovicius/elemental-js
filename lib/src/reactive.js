export class Reactive {
  #value
  #subscribers = new Set()
  constructor(value, ...derivatives) {
    this.#value = value
    if (derivatives.length) {
      return [
        this,
        ...derivatives.map((derivedConstructor) =>
          this.derive(derivedConstructor)
        )
      ]
    }
  }
  get value() {
    return this.#value
  }
  set value(value) {
    if (this.#value === value) return
    this.#value = value
    this.#subscribers.forEach((updater) => updater(this.#value))
  }
  derive(constructor) {
    const getValue = () => constructor(this.#value)
    const derived = new Reactive(getValue())
    const unsubscribe = this.subscription(
      () => (derived.value = getValue())
    )
    return derived
  }
  subscription(updater) {
    this.#subscribers.add(updater)
    return () => this.#subscribers.delete(updater)
  }
}

export class ReactiveArray extends Reactive {
  constructor(initialValue, ...derivatives) {
    super(initialValue, ...derivatives)
  }
  get length() {
    return this.value.length
  }
  push(...items) {
    this.value = [...this.value, ...items]
    return this.value.length
  }
  pop() {
    this.value = this.value.slice(0, -1)
    return this.value[this.value.length - 1]
  }
  shift() {
    const [first, ...rest] = this.value
    this.value = rest
    return first
  }
  unshift(...items) {
    this.value = [...items, ...this.value]
    return this.value.length
  }
  splice(start, deleteCount, ...items) {
    this.value = [
      ...this.value.slice(0, start),
      ...items,
      ...this.value.slice(start + deleteCount)
    ]
  }
  filter(callback) {
    return this.value.filter(callback)
  }
}

export const arr = (value, ...derivatives) => {
  return new ReactiveArray(value, ...derivatives)
}
