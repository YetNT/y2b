// ONLY AVAILABLE ON BETA BOT!!!!!!!
const {
    ApplicationCommandOptionType,
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const { SlashCommandObject, SlashCommandManager } = require("ic4d");

const ev = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("evaluates a command")
        .addStringOption((option) =>
            option
                .setName("eval")
                .setDescription("Eval what?")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        var evalq;

        try {
            evalq = await eval(interaction.options.get("eval").value);

            const embed = new EmbedBuilder()
                .setTitle("Eval")
                .setFields(
                    {
                        name: "Code",
                        value: `
                            \`\`\`js
${interaction.options.get("eval").value}
\`\`\`
                        `,
                    },
                    {
                        name: "output",
                        value: `
                            \`\`\`js
${evalq}
\`\`\`
                        `,
                    },
                    {
                        name: "output (without codeblock)",
                        value: `${evalq}`,
                    }
                )
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle("Eval (Error)")
                .setFields(
                    {
                        name: "Code",
                        value: `
                            \`\`\`js
${interaction.options.get("eval").value}
\`\`\`
                        `,
                    },
                    {
                        name: "Output (error)",
                        value: `
                            \`\`\`js
${error}
\`\`\`
                        `,
                    }
                )
                .setColor("#DC143C");
            interaction.editReply({ embeds: [embed] });
        }
    },
}).setDeleted(true);

const evOld = new SlashCommandObject({
    name: "eval",
    description: "evaluate",
    deleted: true,
    options: [
        {
            name: "eval",
            description: "Eval what?",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        var evalq;

        try {
            evalq = await eval(interaction.options.get("eval").value);

            const embed = new EmbedBuilder()
                .setTitle("Eval")
                .setFields(
                    {
                        name: "Code",
                        value: `
                            \`\`\`js
${interaction.options.get("eval").value}
\`\`\`
                        `,
                    },
                    {
                        name: "output",
                        value: `
                            \`\`\`js
${evalq}
\`\`\`
                        `,
                    },
                    {
                        name: "output (without codeblock)",
                        value: `${evalq}`,
                    }
                )
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle("Eval (Error)")
                .setFields(
                    {
                        name: "Code",
                        value: `
                            \`\`\`js
${interaction.options.get("eval").value}
\`\`\`
                        `,
                    },
                    {
                        name: "Output (error)",
                        value: `
                            \`\`\`js
${error}
\`\`\`
                        `,
                    }
                )
                .setColor("#DC143C");
            interaction.editReply({ embeds: [embed] });
        }
    },
});

ev.devOnly = true;
ev.category = "dev";

module.exports = ev;
