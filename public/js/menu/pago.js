// PUBLIC KEY de Mercado Pago (NO es el access token — esta clave es pública y va en el cliente)
// ⚠️  REEMPLAZÁ este valor con tu PUBLIC KEY de producción desde:
//     https://www.mercadopago.com.ar/developers/panel/credentials
const mercadopago = new MercadoPago("APP_USR-34a75f43-e42c-427d-bd71-276eaac84d93", {
    locale: "es-AR",
});

console.warn('--- Sistema de pago MP iniciado ---')

function volverAlInicio() {
    const secPago = document.querySelector('.section-pago')
    secPago.innerHTML = ''
    secPago.classList.remove('active')
    document.querySelector('main').style.display = ''
    document.querySelector('footer').style.display = ''
}

async function renderPago(preference) {
    // Validar que la preferencia es válida antes de continuar
    if (!preference || !preference.id || !preference.items) {
        console.error('[pago] Preferencia inválida:', preference)
        return
    }

    let html = await fetch('vistas/pago.html').then(r => r.text())

    const secPago = document.querySelector('.section-pago')
    document.querySelector('.section-carrito').classList.remove('section-carrito--open')
    document.querySelector('main').style.display = 'none'
    document.querySelector('footer').style.display = 'none'
    secPago.innerHTML = html
    secPago.classList.add('active')   // hace visible la sección de pago

    // Adjuntar listener del botón volver (el HTML ya fue inyectado)
    const btnVolver = document.getElementById('go-back')
    if (btnVolver) btnVolver.addEventListener('click', volverAlInicio)

    createCheckoutButton(preference.id)

    const refItems = document.querySelector('.item')
    const refTotal = document.querySelector('#summary-total')
    const items = preference.items
    let total = 0

    for (let i = 0; i < items.length; i++) {
        const price    = items[i].unit_price
        const quantity = items[i].quantity
        const title    = items[i].title
        const subtotal = price * quantity
        total += subtotal

        refItems.innerHTML += `
            <span class="price summary-price">$ ${subtotal.toLocaleString('es-AR')}</span>
            <p class="item-name">${title} <span class="summary-quantity">×${quantity}</span></p>
        `
    }

    refTotal.textContent = total.toLocaleString('es-AR')
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