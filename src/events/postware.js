const User = require("../models/User");
const ServerCommand = require("../models/ServerCommand");
const { ChatInputCommandInteraction } = require("discord.js");

/**
 *
 * @param {*} commandObject
 * @param {ChatInputCommandInteraction} interaction
 */
function postWareTest(commandObject, interaction) {
    console.log(commandObject.name);
}

module.exports = [postWareTest];
