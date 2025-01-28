import './index.css'
import './prism.css'

const start = performance.now()

import { def, el, text } from 'elemental-js'

const header = document.querySelector('header')

const logo = () => {
  const colors = ['red', 'green', 'blue', 'gray']
  return el`h1 style="margin-bottom: -.2em"`(
    'Elemental.js'.split('').map((char, i) => el`i style='color: ${colors[i % 4]}'`(char))
  )
}

header.append(
  logo(),
  el`p style="margin-top: 0; margin-left: .2em; font-size: .9em"`('Control the elements!')
)

const main = document.querySelector('main')

const pre = (input) => el`pre`(el`code class="language-js"`(input))
const br = el`br`()

main.append(
  br,
  el`h3`('Install and import the function'),
  pre('npm i elemental-js'),
  pre("import { el } from 'elemental-js'"),
  br
)

const section = (title, code, component = '') => {
  !Array.isArray(code) && (code = [code])
  main.append(
    el`h3`(title),
    ...code.map((code) => pre(code)),
    el`div style="display: flex; gap: 1em"`(
      el`h4 style="margin-block-start: 1em; margin-block-end: 1em"`('Result:'),
      component
    ),
    br,
    br
  )
}

section('Create an input element', 'el`input`()', el`input`())

section('Create an input with a boolean attribute', 'el`input disabled`()', el`input disabled`())

section(
  'Create an input with a non-boolean attribute',
  'el`input placeholder="Enter something..."`()',
  el`input placeholder="Enter something..."`()
)

section(
  'Create an input with multiple attributes',
  'el`input disabled placeholder="Sorry, not allowed..."`()',
  el`input disabled placeholder="Sorry, not allowed..."`()
)

section(
  'Create a paragraph',
  'el`p`("Lorem ipsum dolor sit amet")',
  el`p`('Lorem ipsum dolor sit amet')
)

section(
  'Create a crimson paragraph',
  'el`p style="color: crimson"`("Lorem ipsum dolor sit amet")',
  el`p style="color: crimson"`('Lorem ipsum dolor sit amet')
)

main.append(
  el`h3`('Add reactive variables'),
  pre(`// import { el } from 'elemental-js'
import { def, el } from 'elemental-js'`),
  br
)

const counter = () => {
  const count = def(0)
  const increment = () => ++count.val
  return el`button onclick=${increment}`('Count is: ', count)
}

section(
  'Create a counter',
  `const counter = () => {
  const count = def(0)
  const increment = () => ++count.val
  return el\`button onclick=\${increment}\`('Count is: ', count)
}`,
  counter()
)

section(
  'A more elaborate input',
  `const input = () => {

  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) =>
    target.val === 'disabled'
      ? (disabled.val = true)
      : (value.val = target.val)

  const input = el\`input
    placeholder="Color or 'disabled'"
    onkeyup="\${handleKeyup}"
    style="color: \${value}"
    disabled="\${disabled}"
  \`()
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.val = false), input.focus())
    return el\`button onclick="\${handleClick}"\`('Enable')
  })

  return el\`div\`(input, enableButton)
}`,
  input()
)

function input() {
  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) => {
    target.value === 'disabled' ? (disabled.val = true) : (value.val = target.value)
  }
  const input = el`input
    placeholder="Color or 'disabled'"
    onkeyup=${handleKeyup}
    style="color: ${value}"
    disabled=${disabled}
  `()
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.val = false), input.focus())
    return el`button onclick="${handleClick}"`('Enable')
  })

  return el`div`(input, enableButton)
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
      \`()
      return el\`li\`(checkbox, item.val)
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = el\`input onkeyup="\${handleKeyup}" placeholder="Enter a task..."\`()

  const addTaskButton = el\`button onclick="\${addItem}"\`("Add todo")
  const clearDoneButton = el\`button onclick="\${clearDone}"\`("Clear Done")

  const taskListElement = el\`ul
    style="list-style: none;
    padding-inline-start: 0;
    margin-block: 0"
  \`(taskElements)

  return el\`div\`(taskInput, addTaskButton, taskListElement, clearDoneButton)

  function addItem() {
    if (taskInput.val === '') return
    taskList.push({
      value: taskInput.val,
      done: false
    })
    saveList()
    taskInput.val = ''
  }

  function clearDone() {
    taskList.val = taskList.filter(({ done }) => !done)
    saveList()
  }

  function loadList() {
    return JSON.parse(localStorage.getItem('todos') || '[]')
  }
  
  function saveList() {
    localStorage.setItem('todos', JSON.stringify(taskList.val))
  }
}`,
  toDos()
)

function toDos() {
  const taskList = def(loadList())

  const taskElements = taskList.derive((list) =>
    list.map((item) => {
      if (item.hidden) return ''
      const handleChange = ({ target }) => ((item.done = target.checked), saveList())
      const checkbox = el`input
        type="checkbox"
        style="margin-right: 1ch"
        checked="${item.done}"
        onchange="${handleChange}"
      `()
      return el`li`(checkbox, item.value)
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = el`input onkeyup="${handleKeyup}" placeholder="Enter a task..."`()

  const addTaskButton = el`button onclick="${addItem}"`('Add todo')
  const clearDoneButton = el`button onclick="${clearDone}"`('Clear Done')

  const taskListElement = el`ul style="
    list-style: none;
    padding-inline-start: 0;
    margin-block: 0
  "`(taskElements)

  return el`div`(taskInput, addTaskButton, taskListElement, clearDoneButton)

  function addItem() {
    if (taskInput.value === '') return alert('Please enter a task')
    taskList.push({
      value: taskInput.value,
      done: false
    })
    saveList()
    taskInput.value = ''
  }

  function clearDone() {
    taskList.val = taskList.filter(({ done }) => !done)
    saveList()
  }

  function loadList() {
    return JSON.parse(localStorage.getItem('todos') || '[]')
  }

  function saveList() {
    localStorage.setItem('todos', JSON.stringify(taskList.val))
  }
}

section(
  'Track mouse events',
  `const mousePosition = () => {
  const x = def(0)
  const y = def(0)
  document.addEventListener('mousemove', (e) => {
    x.val = e.clientX
    y.val = e.clientY
  })
  return el\`p\`(x, ':', y)
}`,
  mousePosition()
)

function mousePosition() {
  const x = def(0)
  const y = def(0)
  document.addEventListener('mousemove', (e) => {
    x.val = e.clientX
    y.val = e.clientY
  })
  return el`p`(x, ':', y)
}

section(
  'Switch disabled',
  `function disableInputSwitch() {
  const disabled = def(false)
  const handleClick = () => disabled.val = !disabled.val
  return el\`div\`(
    el\`input disabled=\${disabled}\`(),
    el\`button onclick=\${handleClick}\`('Click to switch')
  )
}`,
  disableInputSwitch()
)

function disableInputSwitch() {
  const disabled = def(false)
  const handleClick = () => (disabled.val = !disabled.val)
  return el`div`(
    el`input disabled=${disabled}  `(),
    el`button onclick=${handleClick}`('Click to switch')
  )
}

const end = performance.now()
console.log(`- RENDER TIME: ${end - start}ms -`)

import './prism.js'
