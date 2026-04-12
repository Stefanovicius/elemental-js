import { def, derive, el, txt } from './main'

const globalObject = typeof window !== 'undefined' ? window : globalThis

globalObject.def = def
globalObject.derive = derive
globalObject.el = el
globalObject.txt = txt
