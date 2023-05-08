const { Schema, model } = require('mongoose')


const schemaItems = () => {
    let { shield, shieldhp, ...newInv } = require('../utils/items/items.json');

    let r  = {
        userId: {
            type: String,
            required: true
        },
        inv : {
            shield: {
                amt: {
                    type: Number,
                    default: 0
                },
                hp: {
                    type: Number,
                    default: 0
                }
            }
        }
    }

    for (let item in newInv) {
        r.inv[newInv[item].id] = {
            type: Number,
            default: 0
        };
    }

    return r;
}

const inventorySchema = new Schema(schemaItems())

module.exports = model('inventory', inventorySchema)