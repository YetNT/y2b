const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    SlashCommandSubcommandBuilder,
    codeBlock,
} = require("discord.js");

const errorHandler = require("../../../utils/handlers/errorHandler");
const cb = codeBlock;

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("bug")
        .setDescription(
            "Report a bug you've found or saw. Make sure to be as descriptive as possible"
        )
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Bug type")
                .addChoices(
                    {
                        name: "Command",
                        value: "commmand",
                    },
                    {
                        name: "Button/Select Menu/",
                        value: "interaction",
                    }
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription(
                    "Say exactly what you were doing or saw before the bug happened and describe it."
                )
                .setRequired(true)
        ),
    body: {
        name: "bug",
        description:
            "Report a bug you've found or saw. Make sure to be as descriptive as possible",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "type",
                description: "Bug type",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "Command",
                        value: "commmand",
                    },
                    {
                        name: "Button/Select Menu/",
                        value: "interaction",
                    },
                ],
                required: true,
            },
            {
                name: "description",
                description:
                    "Say exactly what you were doing or saw before the bug happened and describe it.",
                required: true,
                type: ApplicationCommandOptionType.String,
            },
        ],
    },
    isCommand: false,
    async execute(i, client, forum, postTags) {
        try {
            let desc = i.options.get("description"); // desc.value is the value
            let type = i.options.getString("type");

            await forum.threads.create({
                name: "Bug Report #(NUM)",
                message: {
                    content: desc.value,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Gub report")
                            .setFields(
                                { name: "Type", value: type },
                                { name: "Description", value: cb(desc.value) },
                                {
                                    name: "UserID",
                                    value: `${cb(i.user.id)}\n<@${i.user.id}>`,
                                }
                            )
                            .setTimestamp()
                            .setColor("Red"),
                    ],
                },
                reason: "bug reprt",
                appliedTags: [postTags.bug],
            });

            await i.editReply("Bug reported. Thank you for helping! :)");
        } catch (error) {
            errorHandler(error, client, i, EmbedBuilder);
        }
    },
};
