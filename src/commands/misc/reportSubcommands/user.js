const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    codeBlock,
} = require("discord.js");

const errorHandler = require("../../../utils/handlers/errorHandler");

module.exports = {
    body: {
        name: "user",
        description: "Report a user for breaking ToS",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "who",
                description: "Who are you reporting?",
                required: true,
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "reason",
                description: "What have they done?",
                required: true,
                type: ApplicationCommandOptionType.String,
            },
        ],
    },
    isCommand: false,
    callback: async (client, i, forum, postTags) => {
        try {
            const reason = i.options.get("reason");
            const who = i.options.get("who");

            await forum.threads.create({
                name: "User Report #(NUM)",
                message: {
                    content: `Report against <@${who.value}>`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("User Report")
                            .setFields(
                                {
                                    name: "User (Author)",
                                    value: `${codeBlock(i.user.id)}\n<@${
                                        i.user.id
                                    }>`,
                                },
                                {
                                    name: "User",
                                    value: `${codeBlock(who.value)}\n<@${
                                        who.value
                                    }>`,
                                },
                                {
                                    name: "Reason",
                                    value: codeBlock(reason.value),
                                }
                            )
                            .setTimestamp()
                            .setColor("Yellow"),
                    ],
                },
                reason: "user bad",
                appliedTags: [postTags.user],
            });

            await i.editReply(`reported <@${who.value}>`);
        } catch (error) {
            errorHandler(error, client, i, EmbedBuilder);
        }
    },
};
