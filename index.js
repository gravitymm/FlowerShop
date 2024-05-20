import {
    Flower,
    orderManager
} from "./script.js";

function openModal(flower) {
    const modal = document.getElementById("myModal");
    const modalContent = modal.querySelector(".modal-content");
    const modalTitle = modal.querySelector(".modal-title");
    const modalDescription = modal.querySelector(".modal-description");
    const modalPrice = modal.querySelector(".modal-price");
    const addToCartButton = document.createElement('button');

    modalTitle.textContent = flower.name;
    modalDescription.textContent = flower.description;
    modalPrice.textContent = `Цена: ${flower.price} руб.`;

    addToCartButton.id = 'addToCartButton';
    addToCartButton.textContent = 'Добавить в корзину';
    addToCartButton.addEventListener('click', () => {
        orderManager.addFlowerToOrder(flower);
        modal.style.display = 'none';
        addToCartButton.remove();
    });
    modalContent.appendChild(addToCartButton);

    modalContent.querySelector(".modal-image").src = flower.image;
    modal.style.display = "block";
}
for (const button of document.getElementsByClassName("filter-button")) {
    button.addEventListener('click', (e) => {
        catalog.renderCatalog(button.textContent);
    });
}

document.getElementById("allTypesButton").addEventListener('click', (e) => {
    catalog.renderCatalog('');
});

const closeModalButton = document.querySelector(".close");
if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
        document.getElementById("addToCartButton").remove();
    });
}

window.addEventListener("click", event => {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
        document.getElementById("addToCartButton").remove();
    }
});

class Catalog {
    constructor() {
        this.flowers = [];
    }

    addFlower(flower) {
        this.flowers.push(flower);
    }

    renderCatalog(filter = '') {
        const catalogElement = document.querySelector('.catalog');
        catalogElement.innerHTML = '';

        this.flowers.forEach(flower => {
            if (filter === '' || flower.type === filter) {
                const card = document.createElement('div');
                card.classList.add('flower-card');
                card.innerHTML = `
                    <img src="${flower.image}" alt="${flower.name}">
                    <h3>${flower.name}</h3>
                    <p>Цена: ${flower.price} руб.</p>
                `;
                card.addEventListener('click', () => openModal(flower));
                catalogElement.appendChild(card);
            }
        });
    }
}

const catalog = new Catalog();

fetch('flowers.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.trim().split('\n');
        lines.forEach(line => {
            const [type, name, price, description, image] = line.split(';');
            catalog.addFlower(new Flower(name, type, parseInt(price), description, image));
        });
        catalog.renderCatalog();
    })
    .catch(error => console.error('Ошибка чтения файла:', error));

