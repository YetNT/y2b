const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    isCommand: false,
    body: {
        name: "enable",
        description: "Enable a command in this server",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "command",
                description: "Which command you enablin?",
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
        serverCommand[command] = false;
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${command} has been enabled`)
                    .setDescription(
                        `The command \`${command}\` has been enabled. Users can now run this command in this server.`
                    ),
            ],
        });
        await sc.save(serverCommand);
    },
};
