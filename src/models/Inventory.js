const { Schema, model } = require('mongoose')

const inventorySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    inv : {
        shield :{
            amt: {
                type: Number,
                default: 0
            },
            hp: {
                type: Number,
                default: 0
            }
        },
        rock : {
            type: Number,
            default: 0
        },
        stick : {
            type: Number,
            default: 0
        }
    }
})

module.exports = model('inventory', inventorySchema)