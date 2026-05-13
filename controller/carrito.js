// SDK Mercado Pago v2
import { MercadoPagoConfig, Preference } from "mercadopago"
import api from "../api/carrito.js"
import config from "../config.js"

// Iniciamos el cliente MP con el token del .env (MP_ACCESS_TOKEN)
const mpClient = new MercadoPagoConfig({
    accessToken: config.MP_ACCESS_TOKEN,
})

const preference = new Preference(mpClient)

/* Controller POST — guarda carrito y crea preferencia de pago en MP */
const postCarrito = async (req, res) => {
    try {
        const carrito = req.body
        const carritoAgregado = await api.guardarCarrito(carrito)

        const items = carritoAgregado.map(item => ({
            title: item.nombre,
            unit_price: Number(item.precio),
            quantity: Number(item.cantidad),
            currency_id: "ARS",
        }))

        // auto_return requiere URLs HTTPS públicas — se activa en producción vía CALLBACK_URL
        const preferenceBody = {
            items,
            back_urls: {
                success: config.CALLBACK_URL,
                failure: config.CALLBACK_URL,
                pending: config.CALLBACK_URL,
            },
        }

        // Solo activar auto_return si la URL es HTTPS (producción)
        if (config.CALLBACK_URL && config.CALLBACK_URL.startsWith('https://')) {
            preferenceBody.auto_return = "approved"
        }

        const response = await preference.create({ body: preferenceBody })

        res.json({ id: response.id, items })
    } catch (error) {
        console.error("Error al crear preferencia MP:", error)
        res.status(500).json({ error: "Error al procesar el carrito" })
    }
}

export default {
    postCarrito,
}
