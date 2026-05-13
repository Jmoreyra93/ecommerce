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
    var template = Handlebars.compile(plantillaHbs);
    // execute the compiled template and print the output to the console
    //let html = template({ productos: productos, validos: !algunCampoNoValido() })
    let html = template({ carrito })
    elemSectionCarrito.innerHTML = html
    elemSectionCarrito.classList.add('section-carrito--open')
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
