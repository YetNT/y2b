const {
    ApplicationCommandType,
    EmbedBuilder,
    ContextMenuCommandBuilder,
} = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { balance } = require("./func");
const { ContextMenuBuilder } = require("ic4d");

const context = new ContextMenuBuilder({
    data: new ContextMenuCommandBuilder()
        .setName("User Balance")
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
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
});

module.exports = context;
