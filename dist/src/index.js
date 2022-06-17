"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
  We fetch our users and return the response.
  Example usage: const users = await fetchUsers();
  Make sure the function you call it in is an async function.
*/
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users = yield response.json();
        return users;
    });
}
/*
  We fetch our todos and return the response.
  Example usage: const todos = await fetchTodos();
  Make sure the function you call it in is an async function.
*/
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = yield response.json();
        return todos;
    });
}
/*
  The goal here is to get our todos from fetchTodos() and generate the object to parse through
  and attach to the modal elements. todoModalData iterates through all todos and organizes
  each todo into an object with a key value that is the userId the todo corresponds to.
  Once that is finished, we create our modal divs, attach relevant classes, create
  the todoList unordered list element, put each todo "title" string into the text node
  of a list element. Although we have nested for loops, each string needed is only accessed once.
  In this case, 200 elements divided into 10 buckets of 20 elements before being iterated over.
*/
function createTodoModals() {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield fetchTodos();
        let userId = 0;
        let todoModalData = {};
        for (let todo in todos) {
            if (todos[todo].userId !== userId) {
                userId = todos[todo].userId;
                todoModalData[`${userId}`] = [];
            }
            const modalData = todos[todo].title;
            todoModalData[`${userId}`].push(modalData);
        }
        const todoModals = document.getElementById('todo-modals');
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
    });
}
/*
  The goal here is to create the user list using the data gathered from fetchUsers().
  We wait for that data, then create a string array that formats the data needed from the
  data provided in the API call. Once finished, we create divs containing the info
  and append to the user list. We also call attachModal before appending to the user list
  to bind click events to open modals on click.

  It's recommended to have this called after the modals are created in createTodoModals().
  That way we won't have any issues concerning click events being bound to nothing,
  binding to null, or undefined errors.
*/
function createUserList() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield fetchUsers();
        for (let user in users) {
            let userEl = document.createElement('li');
            const userAddress = users[user].address.street + ', ' +
                users[user].address.city + ' ' +
                users[user].address.zipcode;
            const userInfo = [
                users[user].name,
                users[user].website,
                users[user].email,
                userAddress,
            ];
            const userList = document.getElementById('user-list');
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
    });
}
/*
  Bind the user list element to a click event that toggles the display value of the
  corresponding modal div element. Since modal in its current state covers the entire screen,
  you could probably change toggle to add to ensure that state doesn't flip flop like
  dual light switches to the same light in the house.
*/
function attachModal(userEl, userId) {
    userEl.onclick = function (mouseEvent) {
        document.getElementsByClassName(`user-${userId}`)[0].classList.toggle('active');
    };
}
/*
  I really found my TypeScript skills lacking when it came down to trying
  to work quickly and effectively. A lot of this code is just avoiding typescript
  errors while trying to muddle through with regular JS. Definitely something I want to
  improve upon. Initial submission did not have any comments.

  TODO:
  I also am mixing async and await with promises and I need to convert those to all async await.

  This is the execution code that runs once called on index.html.
*/
createTodoModals().then(() => { createUserList(); }).then(() => {
    window.onclick = function (event) {
        if (event.target === document.getElementsByClassName('active')[0]) {
            document.getElementsByClassName('active')[0].classList.toggle('active');
        }
    };
});
