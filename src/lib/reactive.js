export class Reactive {
  #value
  #subscribers = new Set()
  constructor(initialValue, renderMethod = () => {}) {
    this.#value = initialValue
  }
  get val() {
    return this.#value
  }
  set val(newValue) {
    this.#value = newValue
    this.#subscribers.forEach((updater) => updater(this.#value))
  }
  subscription(updater) {
    this.#subscribers.add(updater)
  }
}

export function def(value, renderMethod) {
  return new Reactive(value)
}
