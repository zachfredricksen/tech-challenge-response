async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  return users;
}

async function fetchTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await response.json();
  return todos;
}

async function createTodoModals(): Promise<void> {
  const todos = await fetchTodos();
  let userId = '0';
  type modalOptions = {
    [key: string]: string[]
  }
  let todoModalData: modalOptions = {};
  for (let todo in todos) {
    if (todos[todo].userId !== userId) {
      userId = todos[todo].userId;
      todoModalData[`${userId}`] = [];
    }
    const modalData: string = todos[todo].title;
    todoModalData[`${userId}`].push(modalData);
  }

  const todoModals = document.getElementById('todo-modals')!;
  for (const userId in todoModalData) {
    const modalData = todoModalData[userId];
    let todoModal = document.createElement('div');
    todoModal.classList.add(`user-${userId}`, 'modal');
    let todoList = document.createElement('ul');
    for (const todoId in modalData) {
      let todo = document.createElement('li');
      let todoData = document.createTextNode(modalData[todoId].toString());
      todo.appendChild(todoData);
      todoList.appendChild(todo);
    }
    todoModal.appendChild(todoList);
    todoModals.appendChild(todoModal);
  }
}

async function createUserList(): Promise<void> {
  const users = await fetchUsers();
  for (let user in users) {
    let userEl = document.createElement('li');
    const userAddress = 
      users[user].address.street + ', ' + 
      users[user].address.city + ' ' + 
      users[user].address.zipcode;
    const userInfo = [
      users[user].name, 
      users[user].website, 
      users[user].email, 
      userAddress, 
    ];
    const userList = document.getElementById('user-list')!;
    for (let info in userInfo) {
      const infoEl = document.createElement('div');
      const text = document.createTextNode(userInfo[info].toString());
      infoEl.appendChild(text);
      userEl.appendChild(infoEl);
    }
    const userId = users[user].id;
    attachModal(userEl, userId);
    userList.appendChild(userEl);
  }
}

function attachModal(userEl: HTMLElement, userId: number) {
  userEl.onclick = function (mouseEvent: MouseEvent) {
    document.getElementsByClassName(`user-${userId}`)[0].classList.toggle('active');
  }
}

createTodoModals().then(() => { createUserList(); }).then(() => {
  window.onclick = function(event) {
    if (event.target === document.getElementsByClassName('active')[0]) {
      document.getElementsByClassName('active')[0].classList.toggle('active');
    }
  }
});