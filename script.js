import {
    login,
    register
} from "./API.js";

export class Flower {
    constructor(name, type, price, description, image) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.description = description;
        this.image = image;
    }
}

class OrderManager {
    constructor() {
        this.totalPrice = 0;
        this.orderItems = [];
        for (const orderItem of Object.values(localStorage)) {
            try {
                let orI = JSON.parse(orderItem);
                this.orderItems.push(new Flower(orI.name, orI.type, orI.price, orI.description, orI.image));
                this.totalPrice += orI.price;
            } catch (error) {}
        }
    }

    addFlowerToOrder(flower) {
        this.orderItems.push(flower);
        this.totalPrice += flower.price;

        localStorage.setItem(flower.name, JSON.stringify(flower));
    }

    removeFlowerFromOrder(flower) {
        const index = this.orderItems.indexOf(flower);
        if (index !== -1) {
            this.orderItems.splice(index, 1);
            this.totalPrice -= flower.price;
            localStorage.removeItem(flower.name);
            this.renderOrder();
        }
    }

    renderOrder() {
        const orderElement = document.querySelector('.order-list');
        orderElement.innerHTML = '';

        this.orderItems.forEach(flower => {
            const card = document.createElement('div');
            card.classList.add("order-card");
            card.innerHTML = `
                <img src="${flower.image}" alt="${flower.name}">
                <h3>${flower.name}</h3>
                <p>Цена: ${flower.price} руб.</p>
                <button class="dell-btn" data-name="${flower.name}">Удалить</button>
            `;
            orderElement.appendChild(card);
        });

        const deleteButtons = orderElement.querySelectorAll('.dell-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const flowerName = event.target.getAttribute('data-name');
                const flower = this.orderItems.find(f => f.name === flowerName);
                if (flower) {
                    this.removeFlowerFromOrder(flower);
                }
            });
        });
    }
}

export const orderManager = new OrderManager();

const loginLink = document.getElementById('openLoginModalLi');
const registerLink = document.getElementById('openRegisterModalLi');
const userElement = document.getElementById('username');
const exitButton = document.getElementById('exit-button-li');


document.addEventListener('DOMContentLoaded', () => {
    // Функция для создания модального окна
    function createModal(id, title, formContent) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="close${id}">&times;</span>
                <h2>${title}</h2>
                <form id="${id}Form">
                    <label for="${id}Username">Имя пользователя:</label>
                    <input type="text" id="${id}Username" name="username" required>
                    ${formContent}
                    <label id="${id}Error"></label>
                    <button type="submit">${title}</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Создание модального окна для входа
    createModal('loginModal', 'Вход', `
        <label for="loginPassword">Пароль:</label>
        <input type="password" id="loginPassword" name="password" required>
    `);

    // Создание модального окна для регистрации
    createModal('registerModal', 'Регистрация', `
        <label for="registerEmail">Email:</label>
        <input type="email" id="registerEmail" name="email" required>
        <label for="registerPassword">Пароль:</label>
        <input type="password" id="registerPassword" name="password" required>
        <label for="registerConfirmPassword">Подтвердите Пароль:</label>
        <input type="password" id="registerConfirmPassword" name="confirmPassword" required>
    `);

    // Получаем модальные окна
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    // Получаем кнопки для открытия модальных окон
    const openLoginModalBtn = document.getElementById('openLoginModal');

    const openRegisterModalBtn = document.getElementById('openRegisterModal');

    // Получаем кнопки для закрытия модальных окон
    const closeLoginModalBtn = document.getElementById("closeloginModal");
    const closeRegisterModalBtn = document.getElementById("closeregisterModal");

    // Обработчик отправки формы для входа
    document.getElementById('loginModalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginModalUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            const success = await login(username, password);
            if (success) {
                console.log("Вход успешен");
                loginModal.style.display = "none";
                localStorage.setItem("username", username);
                location.reload();
            } else {
                console.log("Неверно")
            }

        } catch (error) {
            console.error('Ошибка при входе:', error);
            // Здесь может быть логика для обработки ошибки входа
        }
    });

    // Обработчик отправки формы для регистрации
    document.getElementById('registerModalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerModalUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const password2 = document.getElementById('registerConfirmPassword').value;
        if (password === password2) {
            try {
                const success = await register(username, email, password);
                if (success) {
                    console.log("Регистрация успешена");
                    registerModal.style.display = "none";
                    localStorage.setItem("username", username);
                    location.reload();
                } else {
                    console.log("Пользователь с таким именем или почтой уже есть")
                }
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
            }
        }
    });

    // Открываем модальное окно для входа
    openLoginModalBtn.onclick = function () {
        loginModal.style.display = "block";
    }

    // Открываем модальное окно для регистрации
    openRegisterModalBtn.onclick = function () {
        registerModal.style.display = "block";
    }

    // Закрываем модальное окно для входа
    closeLoginModalBtn.onclick = function () {
        loginModal.style.display = "none";
    }

    // Закрываем модальное окно для регистрации
    closeRegisterModalBtn.onclick = function () {
        registerModal.style.display = "none";
    }

    // Закрываем модальные окна при клике вне их
    window.onclick = function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    }
});

window.addEventListener('load', () => {
    let username = localStorage.getItem("username");
    if (username) {
        loginLink.classList.add('hidden');
        registerLink.classList.add('hidden');

        userElement.classList.remove('hidden');
        exitButton.classList.remove('hidden')
        userElement.textContent = username;
    }
});

exitButton.addEventListener("click", (e) => {
    localStorage.removeItem("username");
    location.reload();
});