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
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users = yield response.json();
        return users;
    });
}
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = yield response.json();
        return todos;
    });
}
function createTodoModals() {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield fetchTodos();
        let userId = '0';
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
function attachModal(userEl, userId) {
    userEl.onclick = function (mouseEvent) {
        document.getElementsByClassName(`user-${userId}`)[0].classList.toggle('active');
    };
}
createTodoModals().then(() => { createUserList(); }).then(() => {
    window.onclick = function (event) {
        if (event.target === document.getElementsByClassName('active')[0]) {
            document.getElementsByClassName('active')[0].classList.toggle('active');
        }
    };
});
