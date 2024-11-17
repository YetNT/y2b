const User = require("../models/User");
const ServerCommand = require("../models/ServerCommand");
const { ChatInputCommandInteraction } = require("discord.js");

/**
 *
 * @param {*} commandObject
 * @param {ChatInputCommandInteraction} interaction
 */
function postWareTest(commandObject, interaction) {
    interaction.followUp("ur cool");
}

module.exports = [postWareTest];
