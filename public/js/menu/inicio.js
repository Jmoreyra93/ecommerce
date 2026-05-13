


async function renderPlantillaListado(listado) {
    
    let plantillaHbs = await fetch('plantillas/inicio.hbs').then(r => r.text())
    var template = Handlebars.compile(plantillaHbs);
    
    // execute the compiled template and print the output to the console
    //let html = template({ productos: productos, validos: !algunCampoNoValido() })
    let html = template({ listado })
    document.getElementsByClassName('cards-container')[0].innerHTML = html  


}

function agregarCarrito(e,id,ref) {
    e.preventDefault()

    let producto = productoController.productos.find( producto => producto.id == id )
    carritoController.agregarAlCarrito(producto)
    actualizarCartBadge()

    let botonAgregar = document.getElementById('contenedorMensaje')
    botonAgregar.style.visibility = 'visible'
    document.getElementById('mensaje-producto-agregado').innerHTML = `<p> Se agregó a carrito: <strong>${producto.nombre}</strong></p>`
    setTimeout(function(){
        botonAgregar.style.visibility = 'hidden'
    }, 2000);
}




async function initInicio() {
    console.warn('initInicio()')

    var productos = await productoController.obtenerProductos()
    await renderPlantillaListado(productos)

    document.querySelector('.section-cards__header p').innerHTML = `Se encontraron ${productos.length} productos`
    marcarFavoritos()
}



function scrollEfect() {
    window.addEventListener('scroll', function(){
        var header = document.querySelector('header')
        header.classList.toggle('scrollfix', window.scrollY > 0)
    })
}

function ventanaSuscripcion() {
    var overlay = document.getElementById('overlay')
    if (overlay) overlay.classList.add('active')
}


