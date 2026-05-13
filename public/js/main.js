
class Main {
    async ajax(url, metodo='get') {
        const r = await fetch(url, { method: metodo })
        if (!r.ok) throw new Error(`HTTP ${r.status} cargando ${url}`)
        return r.text()
    }

    getNombreArchivo(id) {
        return 'vistas/' + id + '.html'
    }

    marcarLink(id) {
        document.querySelectorAll('header nav a').forEach(link => {
            link.classList.toggle('active', link.id === id || link.id === id + '-mob')
        })
    }

    initJS(id) {
        if (id === 'alta')     initAlta()
        else if (id === 'inicio')  { initInicio(); scrollEfect() }
        else if (id === 'nosotros') initNosotros()
        else if (id === 'contacto') initContacto()
    }

    async cargarPlantilla(id) {
        try {
            const plantilla = await this.ajax(this.getNombreArchivo(id))
            document.querySelector('main').innerHTML = plantilla
            this.initJS(id)
            if (typeof lucide !== 'undefined') lucide.createIcons()
        } catch (err) {
            console.error('[main] Error cargando vista:', id, err)
        }
    }

    async cargarPlantillas() {
        // Registrar hashchange ANTES de cualquier await
        // Los links con href="#seccion" cambian el hash de forma nativa,
        // esto dispara hashchange sin necesidad de click handlers JS.
        window.addEventListener('hashchange', () => {
            const id = location.hash.slice(1) || 'inicio'
            this.marcarLink(id)
            this.cargarPlantilla(id)
        })

        // Carga inicial según la URL actual
        const id = location.hash.slice(1) || 'inicio'
        this.marcarLink(id)
        await this.cargarPlantilla(id)
    }

    async start() {
        await this.cargarPlantillas()
    }
}

const main = new Main()
main.start()
