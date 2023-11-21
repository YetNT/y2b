const { EmbedBuilder } = require("discord.js");

class EmbedError {
    constructor(text) {
        this.output = {
            embeds: [new EmbedBuilder().setDescription(text)],
        };
    }
}

module.exports = { EmbedError };
