/* eslint-disable no-undef */
const path = require("path");
const { devs, testServer } = require(path.join(
    __dirname,
    "..",
    "..",
    "..",
    "config.json"
));
const getLocalCommands = require(path.join(
    __dirname,
    "..",
    "..",
    "utils",
    "getLocalCommands"
));
const Blacklist = require("../../models/Blacklist");
const ServerCommand = require("../../models/ServerCommand");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.user.id)) {
                interaction.reply({
                    content: "Only developers are allowed to run this command.",
                    ephemeral: true,
                });
                return;
            }
        }

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
                    return;
                }
            }
        }

        if (commandObject.blacklist) {
            let query = {
                userId: interaction.user.id,
            };
            let blacklist = await Blacklist.findOne(query);

            if (blacklist) {
                if (blacklist.blacklisted === true) {
                    interaction.reply(
                        "You've been blacklisted. Reason = " +
                            `${blacklist.reason}`
                    );
                    return;
                }
            }
        }

        if (commandObject.testOnly) {
            if (interaction.guild.id != testServer) {
                interaction.reply({
                    content: "This command cannot be ran here.",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running the command: `);
        console.log(error);
    }
};
