const { SlashCommandManager } = require("ic4d");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { itemNames } = require("../../../../utils/misc/items/getItems");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { slingshot } = require("./slingshot");
const { battery } = require("./battery");

const commands = { slingshot, battery };

const use = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("use")
        .setDescription("Use an item. What u expect")
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("Which item you tryna view cuh?")
                .setRequired(true)
                .setChoices(...itemNames(3))
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("If item requires a user to be called.")
        ),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();
            const itemName = interaction.options.getString("item");
            const user = interaction.options.getUser("user");
            return await commands[itemName](client, interaction, user);
        } catch (e) {
            errorHandler(e, client, interaction, EmbedBuilder);
        }
    },
});

use.category = "economy";
use.blacklist = true;

module.exports = use;
