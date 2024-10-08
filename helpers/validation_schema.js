const Joi = require('@hapi/joi')

const authSchma =  Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
})

module.exports = {
    authSchma,
}