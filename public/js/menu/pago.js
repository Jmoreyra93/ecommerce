// PUBLIC KEY de Mercado Pago (NO es el access token — esta clave es pública y va en el cliente)
// ⚠️  REEMPLAZÁ este valor con tu PUBLIC KEY de producción desde:
//     https://www.mercadopago.com.ar/developers/panel/credentials
const mercadopago = new MercadoPago("APP_USR-34a75f43-e42c-427d-bd71-276eaac84d93", {
    locale: "es-AR",
});

console.warn('--- Sistema de pago MP iniciado ---')

async function renderPago(preference) {
    let html = await fetch('vistas/pago.html').then(r => r.text())

    document.querySelector('.section-carrito').classList.remove('section-carrito--open')
    document.querySelector('main').style.display = 'none'
    document.querySelector('footer').style.display = 'none'
    document.querySelector('.section-pago').innerHTML = html

    createCheckoutButton(preference.id)

    const refItems = document.querySelector('.item')
    const refTotal = document.querySelector('#summary-total')
    const items = preference.items
    let total = 0

    for(let i=0; i<items.length; i++) {
        let price = items[i].unit_price
        let quantity = items[i].quantity
        let title = items[i].title

        let subtotal = price * quantity
        total += subtotal

        refItems.innerHTML += `
            <span class="price summary-price">$ ${subtotal}</span>
            <p class="item-name">${title} x unidad/es <span class="summary-quantity">$ ${quantity}</span></p>
        `
    }

    refTotal.innerHTML = total

    // Go back
    document.getElementById("go-back").addEventListener("click", function () {
        document.querySelector('main').style.display = 'block'
        document.querySelector('footer').style.display = ''
        document.querySelector('.section-pago').innerHTML = ''
    });
}


// Create preference when click on checkout button
function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    mercadopago.checkout({
        preference: {
            id: preferenceId
        },
        render: {
            container: '#button-checkout', // Class name where the payment button will be displayed
            label: 'Pagar', // Change the payment button text (optional)
        }
    });
}