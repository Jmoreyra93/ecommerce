import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT || 8080,
    TIPO_DE_PERSISTENCIA: process.env.TIPO || 'MONGODB',
    STR_CNX: process.env.MONGODB_URI || null,
    MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN || null,
    CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:8080/api/carrito/feedback',
}
