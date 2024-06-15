const { EmbedBuilder, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List enabled and disabled commands in the server."),
    isCommand: false,
    async execute(interaction, client, sc, serverCommand) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setTitle("Command list").setFields([
                    {
                        name: "Rob",
                        value:
                            serverCommand.rob == false
                                ? ":moyai: Enabled"
                                : ":skull_crossbones: Disabled",
                    },
                    {
                        name: "Steal",
                        value:
                            serverCommand.steal == false
                                ? ":moyai: Enabled"
                                : ":skull_crossbones: Disabled",
                    },
                ]),
            ],
        });
    },
};
