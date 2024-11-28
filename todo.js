const endpoint = 'https://js1-todo-api.vercel.app/api/todos';
const apiKey = '?apikey=686806bc-8264-4c3f-9078-ed721e930980';
const submitBtn = document.querySelector('#addBtn');
const input = document.querySelector('#todoInput');
const form = document.querySelector('#form');
const todoList = document.querySelector('#todoList');
const message = document.querySelector('.message');
const popup = document.querySelector('.popup');

const newTodos = document.querySelector('#new-todos');
const completedTodos = document.querySelector('#completed-todos');

// Create the new elements
const createElements = () => {
    const todo = document.createElement('div');
    const todoText = document.createElement('p');
    const btnContainer = document.createElement('div');
    const completeBtn = document.createElement('input');
    const deleteBtn = document.createElement('button');
    completeBtn.type = 'checkbox';
    deleteBtn.textContent = 'X';
    newTodos.append(todo);
    btnContainer.append(completeBtn, deleteBtn);
    todo.append(todoText, btnContainer);
    btnContainer.classList.add('btn-container');
    todo.classList.add('todo');

    todo.style.backgroundColor = randomBackground();

    return {
        todo,
        todoText,
        completeBtn,
        deleteBtn,
    }
}

// Get todos from API
const getTodods = async () => {
    const res = await fetch(`${endpoint}${apiKey}`);
    const todos = await res.json();
    todos.forEach(todo => createAllTodos(todo));
}
getTodods();

// Post todos to API
const postTodos = async (title) => {
    const res = await fetch(`${endpoint}${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title
        })
    });
    const todo = await res.json();
    return todo._id;
}

// Adding todos to the page
const addTodo = async (todoText) => {
    const todoId = await postTodos(input.value);
    todoText.textContent = input.value;
    input.value = '';

    return todoId;
}

// Creating the todos from the API
const createAllTodos = async (todoObj) => {
    const { todo, todoText, completeBtn, deleteBtn } = createElements();
    todo.addEventListener('click', () => completeTodo(todoObj._id, todo, completeBtn));
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(completeBtn, todoObj._id, todo);
    })
    todoText.textContent = todoObj.title;
    if (todoObj.completed) {
        todo.style.backgroundColor = 'grey';
        todo.classList.add('completed');
        completeBtn.checked = true;
        completedTodos.append(todo);
    }
    input.value = '';
}

// Complete todos
const completeTodo = async (id, todo, completeBtn) => {
    todo.classList.toggle('completed');
    completeBtn.checked = todo.classList.contains("completed") ? true : false;
    if (completeBtn.checked) {
        popup.style.display = 'none';
        completedTodos.append(todo);
        todo.style.animation = 'left-to-right .5s ease-in';
        todo.style.backgroundColor = 'grey';
    } else {
        newTodos.append(todo);
        todo.style.animation = 'right-to-left .5s ease-in';
        todo.style.backgroundColor = randomBackground();
    }
    await fetch(`${endpoint}/${id}${apiKey}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "completed": completeBtn.checked
        })
    });
}

// Delete Todos
const deleteTodo = async (completBtn, id, todo, deleteBtn) => {
    if (!completBtn.checked) {
        todo.appendChild(popup);
        popup.style.display = 'block';
        return
    }
    popup.style.display = 'none'
    const res = await fetch(`${endpoint}/${id}${apiKey}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    todo.remove();
}

// Generate random colors for todos background
const randomBackground = () => {
    const red = Math.floor(Math.random() * 128) + 127;
    const green = Math.floor(Math.random() * 128) + 127;
    const blue = Math.floor(Math.random() * 128) + 127;

    return `rgb(${red}, ${green}, ${blue})`;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.value) {
        console.log(message)
        message.style.display = 'block';
        return
    } else {

        message.style.display = 'none';
    }
    const { todo, todoText, completeBtn, deleteBtn } = createElements()
    const id = await addTodo(todoText);
    todo.addEventListener('click', () => completeTodo(id, todo, completeBtn))
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(completeBtn, id, todo, deleteBtn);
    })
})

// Custom cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.circle-cursor');

    cursor.style.left = `${e.pageX}px`;
    cursor.style.top = `${e.pageY}px`;
});