import './global'

const main = document.querySelector('main')
const gap = parseFloat(getComputedStyle(main).gap) * 2 || 0
const introHeader = document.querySelector('#intro')
const introSpan = introHeader.querySelector('span')

introSpan.addEventListener('click', () => {
  const offsetTop = introHeader.offsetTop - gap
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
})

const pres = document.querySelectorAll('pre')

pres.forEach((pre) => {
  let code = pre.querySelector('code')
  const lang = code.className
  const lines = code.textContent.split('\n')
  pre.innerHTML = `<code class="${lang}"></code><button class="btn copy-button">Copy</button>`
  code = pre.querySelector('code')
  if (lines[0].trim() === '') lines.shift()
  const minIndent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^(\s*)/)[0].length)
  )
  const trimmed = lines.map((l) => l.slice(minIndent)).join('\n')
  code.textContent = trimmed.trim()
  const finalCode = code.textContent
  const copyButton = pre.querySelector('.copy-button')
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(finalCode).then(() => {
      copyButton.textContent = 'Copied!'
      setTimeout(() => {
        copyButton.textContent = 'Copy'
      }, 1000)
    })
  })
})

const tabContainers = document.querySelectorAll('.tab-container')

tabContainers.forEach((container) => {
  const buttons = container.querySelectorAll('button[data-tab]')
  const contents = container.querySelectorAll('pre')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab
      contents.forEach((content) => {
        if (content.dataset.tab === tab) {
          content.removeAttribute('hidden')
        } else {
          content.setAttribute('hidden', true)
        }
      })
      buttons.forEach((btn) => {
        btn.classList.remove('active')
      })
      button.classList.add('active')
    })
  })
})
