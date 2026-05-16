let mostrarCarrito = false

function actualizarCartBadge() {
    const badge = document.getElementById('cart-badge')
    if (!badge) return
    const total = carritoController.carrito.reduce((sum, p) => sum + Number(p.cantidad || 1), 0)
    badge.textContent = total || ''
    badge.style.display = total ? 'flex' : 'none'
}

async function renderTablaCarrito(carrito) {
    var elemSectionCarrito = document.getElementsByClassName('section-carrito')[0]

    let plantillaHbs = await fetch('plantillas/carrito.hbs').then(r => r.text())
    var template = Handlebars.compile(plantillaHbs)
    let html = template({ carrito })
    elemSectionCarrito.innerHTML = html
    elemSectionCarrito.classList.add('section-carrito--open')

    // Calcular total aquí (los <script> dentro de innerHTML no se ejecutan en el browser)
    const total = carrito.reduce((sum, p) => sum + (Number(p.precio) * Number(p.cantidad || 1)), 0)
    const elTotal = document.getElementById('cart-total')
    if (elTotal) elTotal.textContent = total.toLocaleString('es-AR')
}

function initCarrito() {
    var btnCarrito = document.getElementById('boton-carrito')
    var elemSectionCarrito = document.getElementsByClassName('section-carrito')[0]
    
    btnCarrito.addEventListener('click', async function () {
        mostrarCarrito = !mostrarCarrito
        if(mostrarCarrito) {
            await renderTablaCarrito(carritoController.carrito)
        }
        else {
            elemSectionCarrito.classList.remove('section-carrito--open')
        }
    })

}

function cerrarCarrito() {
    var elemSectionCarrito = document.getElementsByClassName('section-carrito')[0]
    elemSectionCarrito.classList.remove('section-carrito--open')
    mostrarCarrito = false
}

initCarrito()
