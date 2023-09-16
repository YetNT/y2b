const { Schema, model } = require("mongoose");

const promocodeSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    promocodeName: {
        type: Boolean,
        default: false,
    },
    bruh: {
        type: Boolean,
        default: false,
    },
    newMember: {
        type: Boolean,
        default: false,
    },
    beta: {
        type: Boolean,
        default: false,
    },
    website: {
        type: Boolean,
        default: false,
    },
});

module.exports = model("promocodes", promocodeSchema);
