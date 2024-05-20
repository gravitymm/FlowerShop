import {
    orderManager
} from "./script.js";

window.addEventListener('load', () => {
    orderManager.renderOrder();
    document.getElementById("totalPrice").textContent = orderManager.totalPrice.toString();
});

document.getElementById("order-button").addEventListener('click', (e) => {
    alert('Заказ сделан.');
});

document.getElementById("dell").addEventListener('click', (e) => {
    alert('Заказ сделан.');
});