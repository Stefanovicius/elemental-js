import './index.css'

const { log } = console
const startTime = performance.now()

import { def, el } from './lib/main'

const header = document.querySelector('header')

const logo = () => {
  const colors = ['red', 'green', 'blue', 'gray']
  return el`h1 style="margin-bottom: -.2em" "${'Elemental.js'
    .split('')
    .map((char, i) => el`i style='color: ${colors[i % 4]}' '${char}'`)}"
  `
}

header.append(
  logo(),
  el`p style="margin-top: 0; margin-left: .2em; font-size: .9em" "Control the elements!"`
)

const main = document.querySelector('main')

const pre = (input) => el`pre "${el`code class="language-js" "${input}"`}"`

main.append(
  el`br`,
  el`h3 "Install and import the function"`,
  pre('npm i elemental-js'),
  pre("import { el } from 'elemental-js'"),
  el`br`
)

const section = (title, code, component = '') => {
  !Array.isArray(code) && (code = [code])
  main.append(
    el`h3 "${title}"`,
    ...code.map((code) => pre(code)),
    el`div style="display: flex; gap: 1em" "${el`h4 style="margin-block-start: 1em; margin-block-end: 1em" "Result:"`}${component}"`,
    el`br`,
    el`br`
  )
}

section('Create an input element', 'el`input`', el`input`)

section(
  'Create an input with a boolean attribute',
  'el`input disabled`',
  el`input disabled`
)

section(
  'Create an input with a non-boolean attribute',
  'el`input placeholder="Enter something..."`',
  el`input placeholder="Enter something..."`
)

section(
  'Create an input with multiple attributes',
  'el`input disabled placeholder="Sorry, not allowed..."`',
  el`input disabled placeholder="Sorry, not allowed..."`
)

section(
  'Create a paragraph',
  'el`p "Lorem ipsum dolor sit amet"`',
  el`p "Lorem ipsum dolor sit amet"`
)

section(
  'Create a crimson paragraph',
  'el`p style="color: crimson" "Lorem ipsum dolor sit amet"`',
  el`p style="color: crimson" "Lorem ipsum dolor sit amet"`
)

main.append(
  el`h3 "Add reactive variables"`,
  pre(`// import { el } from 'elemental-js'
import { def, el } from 'elemental-js'`),
  el`br`
)

const counter = () => {
  const count = def(0)
  const increment = () => ++count.value
  return el`button onclick=${increment} "Count is: ${count}"`
}

section(
  'Create a counter',
  `const counter = () => {
  const count = def(0)
  const increment = () => ++count.value
  return el\`button onclick=\${increment} "Count is: \${count}"\`
}`,
  counter()
)

const input = () => {
  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) =>
    target.value === 'disabled'
      ? (disabled.value = true)
      : (value.value = target.value)

  const input = el`input
    placeholder="Color or 'disabled'"
    onkeyup="${handleKeyup}"
    style="color: ${value}"
    disabled="${disabled}"
  `
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.value = false), input.focus())
    return el`button onclick="${handleClick}" "Enable"`
  })

  return el`div "${input}${enableButton}"`
}

section(
  'A more elaborate input',
  `const input = () => {

  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) =>
    target.value === 'disabled'
      ? (disabled.value = true)
      : (value.value = target.value)

  const input = el\`input
    placeholder="Color or 'disabled'"
    onkeyup="\${handleKeyup}"
    style="color: \${value}"
    disabled="\${disabled}"
  \`
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.value = false), input.focus())
    return el\`button onclick="\${handleClick}" "Enable"\`
  })

  return el\`div "\${input}\${enableButton}"\`
}`,
  input()
)

const thousandObjects = []

for (let i = 0; i < 10; i++) {
  const object = {
    value: `No. ${i}`,
    done: false
  }

  thousandObjects.push(object)
}

const todos = () => {
  const taskList = def(loadList())

  const taskElements = taskList.derive((list) =>
    list.map((item) => {
      if (item.hidden) return ''
      const handleChange = ({ target }) => (
        (item.done = target.checked), saveList()
      )
      const checkbox = el`input
        type="checkbox"
        style="margin-right: 1ch"
        checked="${item.done}"
        onchange="${handleChange}"
      `
      return el`li "${checkbox}${item.value}"`
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = el`input onkeyup="${handleKeyup}" placeholder="Enter a task..."`

  const addTaskButton = el`button onclick="${addItem}" "Add todo"`
  const clearDoneButton = el`button onclick="${clearDone}" "Clear Done"`

  return el`div "${[
    taskInput,
    addTaskButton,
    el`ul style="list-style: none; padding-inline-start: 0; margin-block: 0" "${taskElements}"`,
    clearDoneButton
  ]}"`

  function addItem() {
    if (taskInput.value === '') return
    taskList.push({
      value: taskInput.value,
      done: false
    })
    saveList()
    taskInput.value = ''
  }

  function clearDone() {
    taskList.value = taskList.filter(({ done }) => !done)
    saveList()
  }

  function loadList() {
    // return thousandObjects
    return JSON.parse(localStorage.getItem('todos') || '[]')
  }

  function saveList() {
    localStorage.setItem('todos', JSON.stringify(taskList.value))
  }
}

section(
  'A todo app',
  `const todos = () => {

  const taskList = def(loadList())

  const taskElements = taskList.derive(
    (list) => list.map(item => {
      if (item.hidden) return ''
      const handleChange = ({ target }) => (
        (item.done = target.checked), saveList()
      )
      const checkbox = el\`input
        type="checkbox"
        style="margin-right: 1ch"
        checked="\${item.done}"
        onchange="\${handleChange}"
      \`
      return el\`li "\${checkbox}\${item.value}"\`
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = el\`input onkeyup="\${handleKeyup}" placeholder="Enter a task..."\`

  const addTaskButton = el\`button onclick="\${addItem}" "Add todo"\`
  const clearDoneButton = el\`button onclick="\${clearDone}" "Clear Done"\`

  return el\`div "\${[
    taskInput,
    addTaskButton,
    el\`ul style="list-style: none; padding-inline-start: 0; margin-block: 0" "\${taskElements}"\`,
    clearDoneButton
  ]}"\`

  function addItem() {
    if (taskInput.value === '') return
    taskList.push({
      value: taskInput.value,
      done: false
    })
    saveList()
    taskInput.value = ''
  }

  function clearDone() {
    taskList.value = taskList.filter(({ done }) => !done)
    saveList()
  }

  function loadList() {
    return JSON.parse(localStorage.getItem('todos') || '[]')
  }
  
  function saveList() {
    localStorage.setItem('todos', JSON.stringify(taskList.value))
  }
}`,
  todos()
)

const mousePosition = () => {
  const x = def(0)
  const y = def(0)
  document.addEventListener('mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })
  return el`p "${x}:${y}"`
}

section(
  'Track mouse events',
  `const mousePosition = () => {
  const x = def(0)
  const y = def(0)
  document.addEventListener('mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })
  return el\`p "\${x}:\${y}"\`
}`,
  mousePosition()
)

const endTime = performance.now() - startTime
const averageTimeStorageName = 'average_generation_time'
const averageTime = parseFloat(localStorage.getItem(averageTimeStorageName) ?? 0)
const newAverageTime = ((averageTime + endTime) / 2).toFixed(0)
localStorage.setItem(averageTimeStorageName, newAverageTime)
log(`index.js ran in: ${endTime}ms, average time: ${newAverageTime}ms`)
