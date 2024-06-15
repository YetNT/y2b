const {
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
    ApplicationCommandOptionType,
    codeBlock,
} = require("discord.js");

const errorHandler = require("../../../utils/handlers/errorHandler");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("user")
        .setDescription(
            "Report a user for breaking ToS or something else appropriate."
        )
        .addUserOption((option) =>
            option
                .setName("who")
                .setDescription("Who are you reporting?")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("What have they done?")
                .setRequired(true)
        ),
    isCommand: false,
    async execute(i, client, forum, postTags) {
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
