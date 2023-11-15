import './index.css'

console.time('index.js ran in')

import { def, el } from './lib/main'

const header = document.querySelector('header')

const logo = () => {
  const colors = ['red', 'green', 'blue', 'gray']
  return el`h1
    style="margin-bottom: -.2em"
    "${'Elemental.js'
      .split('')
      .map((char, i) => el`i style='color: ${colors[i % 4]}' '${char}'`)}"
  `
}

header.append(
  logo(),
  el`p style="margin-top: 0; margin-left: .2em; font-size: .9em" "Control the elements!"`,
)

const main = document.querySelector('main')

const code = (input) => el`code class="language-js" "${input}"`
const pre = (input) => el`pre "${code(input)}"`
const result = () =>
  el`h4 style="display: inline; padding-right: 1em" "Result:"`

main.append(
  el`h3 "Install and import the function"`,
  pre('npm i elemental-js'),
  pre("import { el } from 'elemental-js'"),
  el`br`,
)

main.append(
  el`h3 "Create an input element"`,
  pre('el`input`'),
  result(),
  el`input`,
  el`br`,
  el`br`,
)

main.append(
  el`h3 "Create an input with a boolean attribute"`,
  pre('el`input disabled`'),
  result(),
  el`input disabled`,
  el`br`,
  el`br`,
)

main.append(
  el`h3 "Create an input with a non-boolean attribute"`,
  pre('el`input placeholder="Enter something..."`'),
  result(),
  el`input placeholder="Enter something..."`,
  el`br`,
  el`br`,
)

main.append(
  el`h3 "Create an input with multiple attributes"`,
  pre('el`input disabled placeholder="Sorry, not allowed..."`'),
  result(),
  el`input disabled placeholder="Sorry, not allowed..."`,
  el`br`,
  el`br`,
)

main.append(
  el`h3 "Create a paragraph"`,
  pre('el`p "Lorem ipsum dolor sit amet"`'),
  result(),
  el`p "Lorem ipsum dolor sit amet"`,
  el`br`,
)

main.append(
  el`h3 "Create a crimson paragraph"`,
  pre('el`p style="color: crimson" "Lorem ipsum dolor sit amet"`'),
  result(),
  el`p style="color: crimson" "Lorem ipsum dolor sit amet"`,
  el`br`,
)

main.append(
  el`h3 "Add reactive variables"`,
  pre(`// import { el } from 'elemental-js'
import { def, el } from 'elemental-js'`),
  el`br`,
)

main.append(
  el`h3 "Create a counter"`,
  pre(`const counter = () => {
  const count = def(0)
  const increment = () => ++count.val
  return el\`button onclick="\${increment}" "Count is: \${count}"\`
}`),
  result(),
  counter(),
  el`br`,
  el`br`,
)

function counter() {
  const count = def(0)
  const increment = () => ++count.val
  return el`button onclick="${increment}" "Count is: ${count}"`
}

main.append(el`h3 "Try it"`, pre(el`textarea rows="10"`), el`br`)

console.timeEnd('index.js ran in')
