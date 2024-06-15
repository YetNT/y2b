const {
    /*PermissionFlagsBits,*/ EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const errorHandler = require("../../utils/handlers/errorHandler");
const { SlashCommandObject, SlashCommandManager } = require("ic4d");

const ping = new SlashCommandManager({
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
    async execute(interaction, client) {
        try {
            const sent = await interaction.reply({
                embeds: [new EmbedBuilder().setDescription("Pinging...")],
                fetchReply: true,
            });
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Pong!")
                        .setFields([
                            {
                                name: "Roundtrip latency",
                                value: `${
                                    sent.createdTimestamp -
                                    interaction.createdTimestamp
                                }ms`,
                                inline: true,
                            },
                            {
                                name: "Websocket heartbeat",
                                value: `${client.ws.ping}ms.`,
                                inline: true,
                            },
                        ])
                        .setColor("Green"),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

ping.category = "misc";

module.exports = ping;
