const mongoose = require('mongoose')

module.exports = mongoose.model('sesiones', {
    username: String,
    password: String,
    name: String
})