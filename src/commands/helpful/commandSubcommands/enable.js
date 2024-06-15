const { EmbedBuilder, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("enable")
        .setDescription("Enable a command in this server")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Which command you enablin?")
                .addChoices(
                    {
                        name: "Rob",
                        value: "rob",
                    },
                    {
                        name: "Steal",
                        value: "steal",
                    }
                )
                .setRequired(true)
        ),
    isCommand: false,
    async execute(interaction, client, sc, serverCommand, command) {
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
