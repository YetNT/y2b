const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { inventory } = require("./func");

module.exports = {
    name: "User Inventory",
    isCommand: false,
    type: ApplicationCommandType.User,

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (interaction, client) => {
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
};
