const { EmbedBuilder } = require("discord.js");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");

const subcommands = require("./challengeSubcommands/index");

const challenge = new SlashCommandObject({
    name: "challenge",
    description: "Challenges (contains subcommands)",
    options: [subcommands.buttons.body],

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
});
challenge.category = "economy";
challenge.blacklist = true;

module.exports = challenge;
