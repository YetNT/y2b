const errorHandler = require("../../utils/handlers/errorHandler");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { SlashCommandObject, SlashCommandManager } = require("ic4d");

const subcommands = require("./reportSubcommands/index");

function arrToObj(originalArray) {
    const transformedObject = {};

    originalArray.forEach((item) => {
        transformedObject[item.name] = {
            id: item.id,
            name: item.name,
            moderated: item.moderated,
            emoji: {
                id: item.emoji.id,
                name: item.emoji.name,
            },
        };
    });

    return transformedObject;
}

const report = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report stuff (Contains subcommands)")
        .addSubcommand(subcommands.bug.data)
        .addSubcommand(subcommands.user.data)
        .addSubcommand(subcommands.server.data),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const forum = client.channels.cache.get("1172574488362242098");
            const tagsObj = arrToObj(forum.availableTags);

            const tags = {
                bug: tagsObj.Bug.id,
                server: tagsObj.server.id,
                user: tagsObj.user.id,
            };

            let subcommand = interaction.options.getSubcommand();
            switch (subcommand) {
                case "bug":
                    await subcommands.bug.callback(
                        interaction,
                        client,
                        forum,
                        tags
                    );
                    break;
                case "user":
                    await subcommands.user.callback(
                        interaction,
                        client,
                        forum,
                        tags
                    );
                    break;
                case "server":
                    await subcommands.server.callback(
                        interaction,
                        client,
                        forum,
                        tags
                    );
                    break;
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

report.blacklist = true;
report.category = "misc";

module.exports = report;
