import '@fontsource-variable/outfit'
import '@fontsource/poppins'
import './assets/prism.css'
import './global.css'
import './assets/prism.js'

import homeIcon from './assets/icons/home.svg?raw'
import flaskIcon from './assets/icons/flask.svg?raw'
import githubIcon from './assets/icons/github.svg?raw'

const icons = document.querySelectorAll('i[data-icon]')

icons.forEach((icon) => {
  const iconName = icon.dataset.icon
  switch (iconName) {
    case 'home':
      icon.outerHTML = homeIcon
      break
    case 'flask':
      icon.outerHTML = flaskIcon
      break
    case 'github':
      icon.outerHTML = githubIcon
      break
    default:
      console.warn(`Icon "${iconName}" not found`)
  }
})

window.__DEBUG_ELEMENTAL_JS = true
