const { Schema, model } = require("mongoose");

const userSchema = new Schema({
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
});

module.exports = model("user", userSchema);
