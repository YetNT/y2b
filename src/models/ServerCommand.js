const { Schema, model } = require('mongoose')

const serverCommandSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    rob : {
        type: Boolean,
        default: false
    }
})

module.exports = model('serverCommand', serverCommandSchema)