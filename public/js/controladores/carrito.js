class CarritoController extends CarritoModel {

    constructor() {
        super()
        try {
            this.carrito = JSON.parse(localStorage.getItem('carrito')) || []
        }
        catch {
            this.carrito = []
            localStorage.setItem('carrito',this.carrito)
        }
    }

    elProductoEstaEnElCarrito(producto) {
        return this.carrito.filter(prod => prod.id == producto.id).length
    }
    
    obtenerProductoDeCarrito(producto) {
        return this.carrito.find(prod => prod.id == producto.id)
    }
    
    agregarAlCarrito(producto) {
        //console.log(producto)
        if(!this.elProductoEstaEnElCarrito(producto)) {
            producto.cantidad = 1
            this.carrito.push(producto)
        }
        else {
            let productoDeCarrito = this.obtenerProductoDeCarrito(producto)
            productoDeCarrito.cantidad++
        }   
    
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
    }
    
    async borrarProductoCarrito(id) {
        let index = this.carrito.findIndex(producto => producto.id == id)
        this.carrito.splice(index,1)
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
    
        await renderTablaCarrito(this.carrito)
    }
    
    async enviarCarrito() {
        var elemSectionCarrito = document.getElementsByClassName('section-carrito')[0]

        // Mostrar estado de carga
        elemSectionCarrito.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 gap-4 px-8 text-center">
                <div class="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-gray-600 text-sm font-medium">Procesando pago...</p>
            </div>`

        try {
            let preference = await carritoService.guardarCarritoService(this.carrito)

            // Verificar que la respuesta es válida antes de limpiar el carrito
            if (!preference || !preference.id) {
                throw new Error('Preferencia de pago inválida')
            }

            this.carrito = []
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            actualizarCartBadge()

            elemSectionCarrito.classList.remove('section-carrito--open')
            await renderPago(preference)

        } catch (err) {
            console.error('[carrito] Error al enviar carrito:', err)
            // Restaurar el carrito en pantalla si falló
            await renderTablaCarrito(this.carrito)
            alert('Hubo un error al procesar el pago. Por favor intentá de nuevo.')
        }
    }
}

const carritoController = new CarritoController()