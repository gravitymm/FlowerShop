import {
    orderManager
} from "./script.js";

window.addEventListener('load', () => {
    orderManager.renderOrder();
    document.getElementById("totalPrice").textContent = orderManager.totalPrice.toString();
});


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.createElement('div');
    modal.id = 'orderModal';
    modal.classList.add('modal');
    modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="closeOrder">&times;</span>
                <h2>Оформление</h2>
                <form id="orderForm">
                    <label for="orderName" id="sum"></label>
                    <label for="orderName">Имя покупателя:</label>
                    <input type="text" id="orderName" name="name" required>
                    <label for="orderAddress">Адрес доставки</label>
                    <input type="text" id="orderAddress" name="name" required>
                    <button type="submit">Оформить</button>
                </form>
            </div>
        `;
    document.body.appendChild(modal);

    const orderModal = document.getElementById("orderModal");
    const closeOrderModalBtn = document.getElementById("closeOrder");
    const sumLabel = document.getElementById("sum");

    document.getElementById('orderForm').addEventListener('submit', async (event) => {
        window.alert("заказ оформлен, уходите")
        orderModal.style.display = "none";
    });

    document.getElementById("order-button").addEventListener('click', (e) => {
        sumLabel.textContent = `Ваш заказ на сумму ${orderManager.totalPrice} руб`;
        orderModal.style.display = "block";
    });

    closeOrderModalBtn.onclick = function () {
        orderModal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === orderModal) {
            orderModal.style.display = "none";
        }
    }
});