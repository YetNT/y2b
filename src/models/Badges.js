const { Schema, model } = require('mongoose')


const schemaItems = () => {
    let Badges = require('../utils/badges/badges.json');

    let r  = {
        userId: {
            type: String,
            required: true
        },
        badges : {
        }
    }

    for (let badge in Badges) {
        r.badges[Badges[badge].id] = {
            type: Boolean,
            default: false
        };
    }

    return r;
}

const badgeSchema = new Schema(schemaItems())

module.exports = model('badge', badgeSchema)