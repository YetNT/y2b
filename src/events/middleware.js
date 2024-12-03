/* eslint-disable no-undef */
const User = require("../models/User");
const ServerCommand = require("../models/ServerCommand");
const { ChatInputCommandInteraction } = require("discord.js");

/**
 *
 * @param {*} commandObject
 * @param {ChatInputCommandInteraction} interaction
 */
async function noDm(commandObject, interaction) {
    if (!interaction.inGuild()) {
        await interaction.reply({
            ephemeral: true,
            content:
                "Commands cannot be used in DMs. Try run this command again in a server.\n(I'm too lazy to make this work in dm. If you really want it, **[pls make a pr :pray:](https://github.com/YetNT/y2b)**)",
        });
        return 1;
    }
    return 0;
}

async function canBeServerDisabled(commandObject, interaction) {
    if (commandObject.canBeServerDisabled) {
        let query = {
            guildId: interaction.guild.id,
        };
        let serverCommand = await ServerCommand.findOne(query);
        if (serverCommand) {
            if (serverCommand[interaction.commandName] == true) {
                await interaction.reply({
                    ephemeral: true,
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
        if (!user) return 0;
        let blacklist = user.blacklist;

        if (blacklist) {
            if (blacklist.ed === true) {
                await interaction.reply({
                    ephemeral: true,
                    content:
                        "You've been blacklisted. Reason = " +
                        `${blacklist.reason}`,
                });
                return 1;
            }
        }
    }
    return 0;
}

async function testOnly(commandObject, interaction) {
    if (commandObject.testOnly) {
        if (interaction.guild.id != testServer) {
            await interaction.reply({
                content: "This command cannot be ran here.",
                ephemeral: true,
            });
            return 1;
        }
    }
    return 0;
}

/**
 *
 * @param {*} commandObject
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
async function noSelfAt(commandObject, interaction) {
    if (commandObject.noSelfAt) {
        if (interaction.options.get("user").value == interaction.user.id) {
            await interaction.reply({
                content: "You cannot choose yourself bru.",
                ephemeral: true,
            });
            return 1;
        }
    }
    return 0;
}

/**
 *
 * @param {*} commandObject
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
async function noBotAt(commandObject, interaction) {
    if (commandObject.noBotAt) {
        if (interaction.options.getUser("user").bot) {
            await interaction.reply({
                content: "You cannot pick a bot bruh.",
                ephemeral: true,
            });
            return 1;
        }
    }
    return 0;
}

async function checkEffects(commandObject, interaction) {
    if (commandObject.category !== "economy") return 0;
    let query = {
        userId: interaction.user.id,
    };
    let user = await User.findOne(query);
    if (!user) return 0;
    let effects = user.effects || [];
    if (!effects || effects.length === 0) return 0;

    effects = effects.filter((effect) => effect.endTime.getTime() < Date.now());

    user.effects = effects;
    await User.save(user);
}

module.exports = [
    noDm,
    blacklist,
    canBeServerDisabled,
    testOnly,
    noSelfAt,
    noBotAt,
    // below functions are probbbly economy stuff
    checkEffects,
];
