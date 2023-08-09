const { EmbedBuilder } = require("discord.js");
const errorHandler = require("../../utils/handlers/errorHandler");

const subcommands = require("./challengeSubcommands/index");

module.exports = {
    name: "challenge",
    description: "Challenges (contains subcommands)",
    options: [subcommands.buttons.body],
    blacklist: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            let subcommand = interaction.options.getSubcommand();

            if (subcommand === "buttons") {
                await subcommands.buttons.callback(client, interaction);
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
