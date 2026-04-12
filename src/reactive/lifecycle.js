const lifecycleMap = new WeakMap()

const getLifecycle = reactive => lifecycleMap.get(reactive)

export const initReactiveLifecycle = (reactive, registerDisposer, setSubscribersChangeHandler) => {
  lifecycleMap.set(reactive, {
    registerDisposer,
    setSubscribersChangeHandler,
    attachOwner() {},
    detachOwner() {}
  })
}

export const registerReactiveDisposer = (reactive, callback) =>
  getLifecycle(reactive)?.registerDisposer(callback)

export const setReactiveSubscribersChangeHandler = (reactive, callback) => {
  const lifecycle = getLifecycle(reactive)
  if (lifecycle) lifecycle.setSubscribersChangeHandler(callback)
}

export const setReactiveOwnerHandlers = (reactive, attach, detach) => {
  const lifecycle = getLifecycle(reactive)
  if (!lifecycle) return
  lifecycle.attachOwner = attach
  lifecycle.detachOwner = detach
}

export const attachOwner = reactive => getLifecycle(reactive)?.attachOwner()
export const detachOwner = reactive => getLifecycle(reactive)?.detachOwner()
