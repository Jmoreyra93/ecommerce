class FavoritosController {
    constructor() {
        try {
            this.favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
        } catch {
            this.favoritos = []
        }
    }

    esFavorito(id) {
        return this.favoritos.includes(String(id))
    }

    toggle(id) {
        const sid = String(id)
        if (this.esFavorito(sid)) {
            this.favoritos = this.favoritos.filter(f => f !== sid)
        } else {
            this.favoritos.push(sid)
        }
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos))
        this.actualizarBadge()
    }

    actualizarBadge() {
        const badge = document.getElementById('fav-badge')
        if (!badge) return
        const n = this.favoritos.length
        badge.textContent = n || ''
        badge.style.display = n ? 'flex' : 'none'
    }
}

const favoritosController = new FavoritosController()

function toggleFavorito(e, id) {
    e.stopPropagation()
    e.preventDefault()
    favoritosController.toggle(id)
    e.currentTarget.classList.toggle('fav-active', favoritosController.esFavorito(id))
}

function marcarFavoritos() {
    document.querySelectorAll('.btn-favorito[data-id]').forEach(btn => {
        btn.classList.toggle('fav-active', favoritosController.esFavorito(btn.dataset.id))
    })
    favoritosController.actualizarBadge()
}

let _filtroActivo = 'todos'

function setFiltroProductos(tipo) {
    _filtroActivo = tipo

    const btnTodos = document.getElementById('btn-filter-todos')
    const btnFavs  = document.getElementById('btn-filter-favoritos')
    if (btnTodos) btnTodos.classList.toggle('filter-active', tipo === 'todos')
    if (btnFavs)  btnFavs.classList.toggle('filter-active',  tipo === 'favoritos')

    const cards = document.querySelectorAll('.cards-container > a[data-product-id]')
    let visibles = 0
    cards.forEach(card => {
        const mostrar = tipo === 'todos' || favoritosController.esFavorito(card.dataset.productId)
        card.style.display = mostrar ? '' : 'none'
        if (mostrar) visibles++
    })

    const conteo = document.querySelector('.section-cards__header p')
    if (conteo) {
        conteo.textContent = tipo === 'favoritos'
            ? `${visibles} favorito${visibles !== 1 ? 's' : ''} guardado${visibles !== 1 ? 's' : ''}`
            : `Se encontraron ${visibles} productos`
    }
}
