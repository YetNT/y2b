const { Schema, model } = require("mongoose");
let Badges = require("../utils/misc/badges/badges.json");

/**
 * @typedef {Object} user
 * @property {string} userId
 * @property {number} balance
 * @property {number} bank
 * @property {Object} blacklist
 * @property {Object} badges
 * @property {Object} cooldown
 */
let scheme = {
    userId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    bank: {
        type: Number,
        default: 0,
    },
    badges: {},
    blacklist: {
        ed: {
            // blacklisted
            type: Boolean,
            default: false,
        },
        reason: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true,
        },
    },
    cooldown: {
        rob: {
            type: Date,
            default: new Date(0),
        },
        work: {
            type: Date,
            default: new Date(0),
        },
        daily: {
            type: Date,
            default: new Date(0),
        },
        crystalize: {
            type: Date,
            default: new Date(0),
        },
        challenge: {
            buttons: {
                type: Date,
                default: new Date(0),
            },
        },
    },
};

for (let badge in Badges) {
    scheme.badges[Badges[badge].id] = {
        type: Boolean,
        default: false,
    };
}

const userSchema = new Schema(scheme);

module.exports = model("user", userSchema);
