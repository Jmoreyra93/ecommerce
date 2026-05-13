// Callback que llama Mercado Pago después del pago
// Recibe payment_id, status, merchant_order_id como query params
const feedback = (req, res) => {
    const info = {
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id,
    }
    console.log("MP Feedback:", info)

    // Redirige a la vista de resultado con el estado del pago
    res.redirect(`/vistas/pago.html?status=${info.Status}`)
}

export default {
    feedback,
}
