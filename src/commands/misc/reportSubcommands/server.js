const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    codeBlock,
} = require("discord.js");

const errorHandler = require("../../../utils/handlers/errorHandler");

module.exports = {
    body: {
        name: "server",
        description: "Report a server for ToS breaking activities",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "reason",
                description: "Why are you reporting (this) server?",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    isCommand: false,
    callback: async (client, i, forum, postTags) => {
        try {
            const reason = i.options.get("reason");
            await forum.threads.create({
                name: "Server Report #(NUM)",
                message: {
                    content: reason.value,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guild Report")
                            .setFields(
                                { name: "guildID", value: i.guild.id },
                                {
                                    name: "Reason",
                                    value: codeBlock(reason.value),
                                },
                                {
                                    name: "Reporter",
                                    value: `${codeBlock(i.user.id)}\n<@${
                                        i.user.id
                                    }>`,
                                }
                            )
                            .setTimestamp()
                            .setColor("Blue"),
                    ],
                },
                reason: "server repro",
                appliedTags: [postTags.server],
            });
            await i.editReply("You've reported this server.");
        } catch (error) {
            errorHandler(error, client, i, EmbedBuilder);
        }
    },
};
