export const examples = [
  {
    title: 'A Counter Component',
    code: `function Counter() {
  const count = def(0)
  const increment = () => ++count.val
  return el\`button onclick=\${increment}\`('Count is: ', count)
}

demoContainer.append(Counter())`
  },
  {
    title: 'A Todo List',
    code: `function TodoList() {
  const todos = def(['Learn Elemental JS', 'Build a Todo List'])
  const newTodo = def('')

  const addTodo = () => {
    if (newTodo.val) {
      todos.push(newTodo.val)
      newTodo.val = ''
    }
  }
  const removeTodo = (index) => {
    todos.splice(index, 1)
  }

  const createListItem = (value, index) =>
    el\`li\`(
      el\`span\`(value),
      el\`button onclick=\${() => removeTodo(index)}\`('Delete')
    )
  const todoElements = todos.derive(val => val.map((todo, i) => createListItem(todo, i)))

  return el\`div\`(
    el\`input type="text" placeholder="New Todo" value=\${newTodo} oninput=\${(e) => newTodo.val = e.target.value}\`(),
    el\`button onclick=\${addTodo}\`('Add Todo'),
    el\`uel\`(todoElements)
  )
}
  
demoContainer.append(TodoList())`
  }
]
