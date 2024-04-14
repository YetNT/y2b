// This file checks if it's the beta version of the bot. Basically if the file exists, it's the beta version, if it doesnt its the production
// nothing needs to be put here, it's just a check
const { Client } = require("discord.js");

module.exports = {
    /**
     *
     * @param {Client|string} client
     * @returns boolean
     */
    isMain: (client = undefined) => {
        if (
            (client instanceof Client &&
                client.token === process.env.MAINBOT) ||
            client == process.env.MAINBOT
        ) {
            return true;
        } else {
            return false;
        }
    },
};
