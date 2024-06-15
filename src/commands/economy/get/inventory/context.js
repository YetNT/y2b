const {
    ApplicationCommandType,
    EmbedBuilder,
    ContextMenuCommandBuilder,
} = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { inventory } = require("./func");
const { ContextMenuBuilder } = require("ic4d");

const context = new ContextMenuBuilder({
    data: new ContextMenuCommandBuilder()
        .setName("User Inventory")
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            let userInfo = interaction.targetUser;
            let user = userInfo.id;
            if (userInfo.bot)
                return interaction.editReply(
                    new EmbedError("A beep boop cant have an inventory").output
                );
            let query = {
                userId: user,
            };

            await inventory(interaction, query, userInfo);
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

module.exports = context;
