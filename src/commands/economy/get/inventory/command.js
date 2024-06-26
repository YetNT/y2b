const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { inventory } = require("./func");

const inv = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your or another user's inventory")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "Select which user's inventory you'd like to see"
                )
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            let query;
            let user = interaction.options.get("user")?.value;
            if (user) {
                user = await client.users.fetch(user); // this makes the variable even tho code didnt run lol
                if (user.bot)
                    return interaction.editReply(
                        new EmbedError("A beep boop cant have an inventory")
                            .output
                    );
            }
            let userInfo;
            if (user) {
                query = {
                    userId: user.id,
                };
                userInfo = user;
            } else {
                query = {
                    userId: interaction.user.id,
                };
                userInfo = interaction.user;
            }

            await inventory(interaction, query, userInfo);
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

inv.category = "economy";
inv.blacklist = true;

module.exports = inv;
