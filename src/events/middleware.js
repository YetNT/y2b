/* eslint-disable no-undef */
const User = require("../models/User");
const ServerCommand = require("../models/ServerCommand");

async function canBeServerDisabled(commandObject, interaction) {
    if (commandObject.canBeServerDisabled) {
        let query = {
            guildId: interaction.guild.id,
        };
        let serverCommand = await ServerCommand.findOne(query);
        if (serverCommand) {
            if (serverCommand[interaction.commandName] == true) {
                interaction.reply({
                    ephemerel: true,
                    content:
                        "This command has been disabled in this server. Ask a mod to enable it or run another comamnd.",
                });
                return 1;
            }
        }
    }
    return 0;
}
async function blacklist(commandObject, interaction) {
    if (commandObject.blacklist) {
        let query = {
            userId: interaction.user.id,
        };
        let user = await User.findOne(query);
        let blacklist = user.blacklist;

        if (blacklist) {
            if (blacklist.ed === true) {
                interaction.reply(
                    "You've been blacklisted. Reason = " + `${blacklist.reason}`
                );
                return 1;
            }
        }
    }
    return 0;
}
async function testOnly(commandObject, interaction) {
    if (commandObject.testOnly) {
        if (interaction.guild.id != testServer) {
            interaction.reply({
                content: "This command cannot be ran here.",
                ephemeral: true,
            });
            return 1;
        }
    }
    return 0;
}

module.exports = [blacklist, canBeServerDisabled, testOnly];
