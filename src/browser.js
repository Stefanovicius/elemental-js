import { def, el, txt } from './main'

const globalObject = typeof window !== 'undefined' ? window : globalThis

globalObject.def = def
globalObject.el = el
globalObject.txt = txt
