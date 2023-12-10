const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    isCommand: false,
    body: {
        name: "list",
        description: "List enabled and disabled commands in the server.",
        type: ApplicationCommandOptionType.Subcommand,
    },
    callback: async (client, interaction, sc, serverCommand) => {
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
                ]),
            ],
        });
    },
};
