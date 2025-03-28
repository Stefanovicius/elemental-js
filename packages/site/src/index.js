import './index.css'
import './prism.css'

const start = performance.now()

import { def, l } from 'elemental-js'

const header = l('header')

const logo = () => {
  const colors = ['red', 'green', 'blue', 'gray']
  return l`h1 style="margin-bottom: -.2em"`(
    'Elemental.js'.split('').map((char, i) => l`i style='color: ${colors[i % 4]}'`(char))
  )
}

header.append(
  logo(),
  l`p style="margin-top: 0; margin-left: .2em; font-size: .9em"`('Control the elements!')
)

const main = l('main')

const pre = (input) => l`pre`(l`code class="language-js"`(input))
const br = l`br`()

main.append(
  br,
  l`h3`('Install and import the function'),
  pre('npm i elemental-js'),
  pre("import { l } from 'elemental-js'"),
  br
)

const section = (title, code, component = '') => {
  !Array.isArray(code) && (code = [code])
  main.append(
    l`h3`(title),
    ...code.map((code) => pre(code)),
    l`div style="display: flex; gap: 1em"`(
      l`h4 style="margin-block-start: 1em; margin-block-end: 1em"`('Result:'),
      component
    ),
    br,
    br
  )
}

section('Create an input element', 'l`input`()', l`input`())

section('Create an input with a boolean attribute', 'l`input disabled`()', l`input disabled`())

section(
  'Create an input with a non-boolean attribute',
  'l`input placeholder="Enter something..."`()',
  l`input placeholder="Enter something..."`()
)

section(
  'Create an input with multiple attributes',
  'l`input disabled placeholder="Sorry, not allowed..."`()',
  l`input disabled placeholder="Sorry, not allowed..."`()
)

section(
  'Create a paragraph',
  'l`p`("Lorem ipsum dolor sit amet")',
  l`p`('Lorem ipsum dolor sit amet')
)

section(
  'Create a crimson paragraph',
  'l`p style="color: crimson"`("Lorem ipsum dolor sit amet")',
  l`p style="color: crimson"`('Lorem ipsum dolor sit amet')
)

main.append(
  l`h3`('Add reactive variables'),
  pre(`// import { l } from 'elemental-js'
import { def, l } from 'elemental-js'`),
  br
)

const counter = () => {
  const count = def(0)
  const increment = () => ++count.val
  return l`button onclick=${increment}`('Count is: ', count)
}

section(
  'Create a counter',
  `const counter = () => {
  const count = def(0)
  const increment = () => ++count.val
  return l\`button onclick=\${increment}\`('Count is: ', count)
}`,
  counter()
)

section(
  'A more elaborate input',
  `const input = () => {

  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) =>
    target.value === 'disabled'
      ? (disabled.val = true)
      : (value.val = target.value)

  const input = l\`input
    placeholder="Color or 'disabled'"
    onkeyup="\${handleKeyup}"
    style="color: \${value}"
    disabled="\${disabled}"
  \`()
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.val = false), input.focus())
    return l\`button onclick="\${handleClick}"\`('Enable')
  })

  return l\`div\`(input, enableButton)
}`,
  input()
)

function input() {
  const value = def('')
  const disabled = def(false)

  const handleKeyup = ({ target }) => {
    target.value === 'disabled' ? (disabled.val = true) : (value.val = target.value)
  }
  const input = l`input
    placeholder="Color or 'disabled'"
    onkeyup=${handleKeyup}
    style="color: ${value}"
    disabled=${disabled}
  `()
  const enableButton = disabled.derive((val) => {
    if (!val) return ''
    const handleClick = () => ((disabled.val = false), input.focus())
    return l`button onclick="${handleClick}"`('Enable')
  })

  return l`div`(input, enableButton)
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
      const checkbox = l\`input
        type="checkbox"
        style="margin-right: 1ch"
        checked="\${item.done}"
        onchange="\${handleChange}"
      \`()
      return l\`li\`(checkbox, item.value)
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = l\`input onkeyup="\${handleKeyup}" placeholder="Enter a task..."\`()

  const addTaskButton = l\`button onclick="\${addItem}"\`("Add todo")
  const clearDoneButton = l\`button onclick="\${clearDone}"\`("Clear Done")

  const taskListElement = l\`ul
    style="list-style: none;
    padding-inline-start: 0;
    margin-block: 0"
  \`(taskElements)

  return l\`div\`(taskInput, addTaskButton, taskListElement, clearDoneButton)

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
      const handleChange = ({ target }) => ((item.done = target.checked), saveList())
      const checkbox = l`input
        type="checkbox"
        style="margin-right: 1ch"
        checked="${item.done}"
        onchange="${handleChange}"
      `()
      return l`li`(checkbox, item.value)
    })
  )

  const handleKeyup = (e) => e.key === 'Enter' && addItem()
  const taskInput = l`input onkeyup="${handleKeyup}" placeholder="Enter a task..."`()

  const addTaskButton = l`button onclick="${addItem}"`('Add todo')
  const clearDoneButton = l`button onclick="${clearDone}"`('Clear Done')

  const taskListElement = l`ul style="list-style: none; padding-inline-start: 0; margin-block: 0"`(
    taskElements
  )

  return l`div`(taskInput, addTaskButton, taskListElement, clearDoneButton)

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
    x.value = e.clientX
    y.value = e.clientY
  })
  return l\`p\`(x, ':', y)
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
  return l`p`(x, ':', y)
}

section(
  'Switch disabled',
  `function disableInputSwitch() {
  const disabled = def(false)
  const handleClick = () => disabled.value = !disabled.value
  return l\`div\`(
    l\`input disabled=\${disabled}\`(),
    l\`button onclick=\${handleClick}\`('Click to switch')
  )
}`,
  disableInputSwitch()
)

function disableInputSwitch() {
  const disabled = def(false)
  const handleClick = () => (disabled.val = !disabled.val)
  return l`div`(
    l`input disabled=${disabled}  `(),
    l`button onclick=${handleClick}`('Click to switch')
  )
}

const end = performance.now()
console.log(`- RENDER TIME: ${end - start}ms -`)

import './prism.js'
