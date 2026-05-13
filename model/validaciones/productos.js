import Joi from "joi";
//https://joi.dev/api/?v=17.6.0

class ProductosValidation {
    static validar(producto) {

        const productoSchema = Joi.object({
            nombre: Joi.string().min(3).max(80).required(),
            precio: Joi.number().required(),
            stock: Joi.number().required(),
            marca: Joi.string().required(),
            categoria: Joi.string().required(),
            detalles: Joi.string().required(),
            foto: Joi.string().empty(''),
            envio: Joi.boolean().required()
        })

        //const error = productoSchema.validate(producto).error
        const { error } = productoSchema.validate(producto)

        return error
    }
}

export default ProductosValidation