// ONLY AVAILABLE ON BETA BOT!!!!!!!
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { SlashCommandManager } = require("ic4d");

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
    async execute(interaction) {
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
}).setDev(true);

ev.devOnly = true;
ev.category = "dev";

module.exports = ev;
