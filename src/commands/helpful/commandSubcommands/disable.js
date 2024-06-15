const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    SlashCommandSubcommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("disable")
        .setDescription("Disable a command in this server")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Which command you disablin?")
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
