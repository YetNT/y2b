const { CachedSchema } = require("./cache.js");

const serverCommandSchema = {
    guildId: {
        type: String,
        required: true,
    },
    rob: {
        type: Boolean,
        default: false,
    },
    steal: {
        type: Boolean,
        default: false,
    },
};

module.exports = new CachedSchema("serverCommand", serverCommandSchema);
