const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");

const subcommands = require("./challengeSubcommands/index");

const challenge = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("challenge")
        .setDescription("Challenges (contains subcomamnds)")
        .addSubcommand(subcommands.buttons.data),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            let subcommand = interaction.options.getSubcommand();

            if (subcommand === "buttons") {
                await subcommands.buttons.execute(interaction, client);
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

challenge.category = "economy";
challenge.blacklist = true;

module.exports = challenge;
