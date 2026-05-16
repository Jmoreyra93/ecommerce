/**
 * seed.js — limpia la base de datos y carga 10 productos de ejemplo.
 * Requiere que el servidor esté corriendo.
 *
 * Uso:
 *   node seed.js                          (apunta a localhost:9000)
 *   BASE_URL=https://tienda-connecticus.com node seed.js   (apunta a producción)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:9000'

const productos = [
    {
        nombre: 'iPhone 15 Pro',
        precio: 1299999,
        stock: 15,
        marca: 'Apple',
        categoria: 'Smartphones',
        detalles: 'Chip A17 Pro, cámara 48MP, titanio, 6.1"',
        foto: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
        envio: true
    },
    {
        nombre: 'Samsung Galaxy S24 Ultra',
        precio: 1199999,
        stock: 12,
        marca: 'Samsung',
        categoria: 'Smartphones',
        detalles: 'Snapdragon 8 Gen 3, S Pen, 200MP, 6.8"',
        foto: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
        envio: true
    },
    {
        nombre: 'MacBook Air M3',
        precio: 2199999,
        stock: 8,
        marca: 'Apple',
        categoria: 'Notebooks',
        detalles: 'Chip M3, 8GB RAM, 256GB SSD, pantalla Liquid Retina 13"',
        foto: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        envio: true
    },
    {
        nombre: 'Sony WH-1000XM5',
        precio: 349999,
        stock: 20,
        marca: 'Sony',
        categoria: 'Auriculares',
        detalles: 'Cancelación de ruido líder, 30hs batería, Bluetooth 5.2',
        foto: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
        envio: true
    },
    {
        nombre: 'PlayStation 5 Slim',
        precio: 899999,
        stock: 5,
        marca: 'Sony',
        categoria: 'Consolas',
        detalles: 'SSD 1TB, ray tracing, 4K 120fps, DualSense incluido',
        foto: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
        envio: false
    },
    {
        nombre: 'iPad Pro 12.9" M4',
        precio: 1599999,
        stock: 10,
        marca: 'Apple',
        categoria: 'Tablets',
        detalles: 'Chip M4, pantalla OLED 12.9", 256GB, compatible con Apple Pencil Pro',
        foto: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        envio: true
    },
    {
        nombre: 'Samsung 65" QLED 4K',
        precio: 1099999,
        stock: 4,
        marca: 'Samsung',
        categoria: 'Televisores',
        detalles: 'Neo QLED 4K, 120Hz, HDR10+, Tizen Smart TV',
        foto: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
        envio: false
    },
    {
        nombre: 'Apple Watch Series 9',
        precio: 549999,
        stock: 18,
        marca: 'Apple',
        categoria: 'Smartwatches',
        detalles: 'Chip S9, Always-On Display, detección de caídas, GPS',
        foto: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
        envio: true
    },
    {
        nombre: 'Logitech MX Master 3S',
        precio: 89999,
        stock: 30,
        marca: 'Logitech',
        categoria: 'Periféricos',
        detalles: 'Mouse inalámbrico 8000 DPI, scroll magnético, silencioso',
        foto: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
        envio: true
    },
    {
        nombre: 'Dell XPS 15',
        precio: 2499999,
        stock: 6,
        marca: 'Dell',
        categoria: 'Notebooks',
        detalles: 'Intel Core i7-13700H, 32GB RAM, 1TB SSD, OLED 3.5K 15.6"',
        foto: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        envio: true
    }
]

async function clearAll() {
    console.log('Eliminando productos existentes...')
    const res = await fetch(`${BASE_URL}/api/productos`)
    const existentes = await res.json()
    for (const p of existentes) {
        const id = p.id || p._id
        await fetch(`${BASE_URL}/api/productos/${id}`, { method: 'DELETE' })
        process.stdout.write('.')
    }
    console.log(`\nEliminados: ${existentes.length} productos\n`)
}

async function seed() {
    await clearAll()
    console.log(`Insertando ${productos.length} productos en ${BASE_URL}...\n`)
    let ok = 0
    let fail = 0

    for (const p of productos) {
        try {
            const res = await fetch(`${BASE_URL}/api/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p)
            })
            if (res.ok) {
                const data = await res.json()
                console.log(`✓  ${p.nombre}  →  id: ${data.id || data._id || JSON.stringify(data).slice(0,40)}`)
                ok++
            } else {
                const text = await res.text()
                console.error(`✗  ${p.nombre}  →  HTTP ${res.status}: ${text}`)
                fail++
            }
        } catch (err) {
            console.error(`✗  ${p.nombre}  →  Error: ${err.message}`)
            fail++
        }
    }

    console.log(`\nResultado: ${ok} insertados, ${fail} fallidos.`)
    if (fail > 0) process.exit(1)
}

seed()
