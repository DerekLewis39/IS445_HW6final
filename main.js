//Set variables for form elements
/*const todoForm = document.getElementById('todoForm')
const todoInput = document.getElementById('todoInput')
const todoList = document.getElementById('todoList')

// Actions on form submission
todoForm.onsubmit = function() {

    const inputText = todoInput.value //capture input text

    if (inputText.replace(/ /g, '') !== '') {
        //define createTodo
        createTodo(inputText, function(todo) {
            refreshTodos()
        })
    }




}*/
import { openDb, fetchTodos, createTodo, deleteTodo } from './db.js'

// Get references to the form elements.
const newTodoForm = document.getElementById('new-todo-form')
const newTodoInput = document.getElementById('new-todo')
const todoList = document.getElementById('todo-items')

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)

  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    const text = newTodoInput.value

    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g, '') !== '') {
      // Create the todo item.
      createTodo(text, function(todo) {
        refreshTodos()
      })
    }

    // Reset the input field.
    newTodoInput.value = ''

    // Don't send the form.
    return false
  }
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    todoList.innerHTML = ''

    for (let index = 0; index < todos.length; index++) {
      // Read the todo items backwards (most recent first).
      const todo = todos[todos.length - 1 - index]

      addTodo(todo)
    }
  })
}

function addTodo(todo) {
  const li = document.createElement('li')
  li.id = 'todo-' + todo.timestamp
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-checkbox'
  checkbox.setAttribute('data-id', todo.timestamp)
  //create edit button
  const editbutton = document.createElement('input')
  editbutton.type = 'button'
  editbutton.className = 'editbutton'
  editbutton.value = 'Edit'
  editbutton.setAttribute('edit-id', todo.timestamp)
  //create save button
  const savebutton = document.createElement('input')
  savebutton.type='button'
  savebutton.classname = 'savebutton'
  savebutton.value = 'Save'
  savebutton.setAttribute('save-id', todo.timestamp)

  li.appendChild(checkbox)

  const span = document.createElement('span')
  span.innerHTML = todo.text

  li.appendChild(span)

  todoList.appendChild(li)

  //append edit button
  li.appendChild(editbutton)

  // Setup an event listener for the checkbox.
  checkbox.addEventListener('click', function(e) {
    const id = parseInt(e.target.getAttribute('edit-id'))

    deleteTodo(id, refreshTodos)
  })
    //setup event listener for editbutton
    editbutton.addEventListener('click', function(e){
        const editid = parseInt(e.target.getAttribute('edit-id'))
        const editor = document.createElement('input')
        editor.value = todo.text

        li.replaceChild(editor, span)
        li.replaceChild(savebutton, editbutton)
        
        //setup event listener for savebutton
        savebutton.addEventListener('click', function(e){
            const newtext = editor.value
            if (newtext.replace(/ /g, "") !==""){

                createTodo(newtext, function(todo){
                    deleteTodo(editid, refreshTodos)
                })
            } else {
                deleteTodo(editid, refreshTodos)
            }
        })
    }
    )
}

