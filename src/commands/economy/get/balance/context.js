const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { balance } = require("./func");

module.exports = {
    name: "User Balance",
    type: ApplicationCommandType.User,
    isCommand: false,
    callback: async (interaction, client) => {
        await interaction.deferReply();
        try {
            const option = interaction.targetUser;
            if (option.bot)
                return interaction.editReply(
                    new EmbedError("Bots are broke.").output
                );

            const query = {
                userId: option.id,
            };

            await balance(interaction, query, option, option);

            //
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
