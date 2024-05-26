import {
    login,
    register
} from "./API.js";

export class Flower {
    constructor(name, type, price, description, image, count) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.description = description;
        this.image = image;
        this.count = count;
    }
}

class OrderManager {
    constructor() {
        this.totalPrice = 0;
        this.orderItems = [];
        for (const orderItem of Object.values(localStorage)) {
            try {
                let orI = JSON.parse(orderItem);
                this.orderItems.push(new Flower(orI.name, orI.type, orI.price, orI.description, orI.image, orI.count));
                this.totalPrice += orI.price * orI.count;
            } catch (error) {}
        }
    }

    addFlowerToOrder(flower) {
        this.orderItems.push(flower);
        this.totalPrice += flower.price;
        flower.count += 1;

        localStorage.setItem(flower.name, JSON.stringify(flower));
    }

    removeFlowerFromOrder(flower) {
        const index = this.orderItems.indexOf(flower);
        flower.count = 0;
        if (index !== -1) {
            this.orderItems.splice(index, 1);
            this.totalPrice -= flower.price;
            localStorage.removeItem(flower.name);
            this.renderOrder();
            document.getElementById("totalPrice").textContent = this.totalPrice.toString();
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
                <div class="buttonPanel">
                    <button class="dell-btn" data-name="${flower.name}">Удалить</button>
                    <button class="minus-btn" data-name="${flower.name}">-</button>
                    <label for="flowerCount" data-name="${flower.name}">${flower.count}</label>
                    <button class="plus-btn" data-name="${flower.name}">+</button>
                </div>
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

        const minusButtons = orderElement.querySelectorAll('.minus-btn');
        minusButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const flowerName = event.target.getAttribute('data-name');
                const flower = this.orderItems.find(f => f.name === flowerName);
                if (flower) {
                    flower.count -= 1;
                    if (flower.count === 0) {
                        this.removeFlowerFromOrder(flower);
                    }
                    else {
                        this.totalPrice -= flower.price;
                        localStorage.setItem(flower.name, JSON.stringify(flower));
                        orderManager.renderOrder();
                        document.getElementById("totalPrice").textContent = this.totalPrice.toString();
                    }
                }
            });
        });

        const plusButtons = orderElement.querySelectorAll('.plus-btn');
        plusButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const flowerName = event.target.getAttribute('data-name');
                const flower = this.orderItems.find(f => f.name === flowerName);
                if (flower) {
                    flower.count += 1;
                    if (flower.count === 0) {
                        this.removeFlowerFromOrder(flower);
                    }
                    else {
                        this.totalPrice += flower.price;
                        localStorage.setItem(flower.name, JSON.stringify(flower));
                        orderManager.renderOrder();
                        document.getElementById("totalPrice").textContent = this.totalPrice.toString();
                    }
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

    createModal('loginModal', 'Вход', `
        <label for="loginPassword">Пароль:</label>
        <input type="password" id="loginPassword" name="password" required>
    `);

    createModal('registerModal', 'Регистрация', `
        <label for="registerEmail">Email:</label>
        <input type="email" id="registerEmail" name="email" required>
        <label for="registerPassword">Пароль:</label>
        <input type="password" id="registerPassword" name="password" required>
        <label for="registerConfirmPassword">Подтвердите Пароль:</label>
        <input type="password" id="registerConfirmPassword" name="confirmPassword" required>
    `);

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const openLoginModalBtn = document.getElementById('openLoginModal');
    const openRegisterModalBtn = document.getElementById('openRegisterModal');

    const closeLoginModalBtn = document.getElementById("closeloginModal");
    const closeRegisterModalBtn = document.getElementById("closeregisterModal");

    document.getElementById('loginModalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginModalUsername').value;
        const password = document.getElementById('loginPassword').value;
        const errorLabel = document.getElementById('loginModalError');
        try {
            const success = await login(username, password);
            if (success) {
                console.log("Вход успешен");
                loginModal.style.display = "none";
                localStorage.setItem("username", username);
                localStorage.setItem("email", success);
                location.reload();
            } else {
                errorLabel.textContent = "Неверное имя пользователя или пароль";
            }

        } catch (error) {
            console.error('Ошибка при входе:', error);
        }
    });

    document.getElementById('registerModalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerModalUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const password2 = document.getElementById('registerConfirmPassword').value;
        const errorLabel = document.getElementById('registerModalError');
        if (password === password2) {
            try {
                const success = await register(username, email, password);
                if (success) {
                    console.log("Регистрация успешена");
                    registerModal.style.display = "none";
                    localStorage.setItem("username", username);
                    location.reload();
                } else {
                    errorLabel.textContent = "Пользователь с таким именем или почтой уже есть";
                }
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
            }
        }
    });

    openLoginModalBtn.onclick = function () {
        loginModal.style.display = "block";
    }

    openRegisterModalBtn.onclick = function () {
        registerModal.style.display = "block";
    }

    closeLoginModalBtn.onclick = function () {
        loginModal.style.display = "none";
    }

    closeRegisterModalBtn.onclick = function () {
        registerModal.style.display = "none";
    }

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