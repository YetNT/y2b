const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    isCommand: false,
    body: {
        name: "disable",
        description: "Disable a command in this server",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "command",
                description: "Which command you disablin?",
                choices: [
                    {
                        name: "Rob",
                        value: "rob",
                    },
                ],
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    callback: async (client, interaction, sc, serverCommand, command) => {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${command} has been disabled`)
                    .setDescription(
                        `The command \`${command}\` has been disabled. Users can no longer run this command in this server.`
                    ),
            ],
        });
        await sc.save(serverCommand);
    },
};
