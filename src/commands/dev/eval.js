const { Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name:"eval",
    description:"evaluate",
    devOnly: true,
    deleted: true,
    options: [
        {
            name:"eval",
            description:"Eval what?",
            type: ApplicationCommandOptionType.String,
            required: true
        }
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
            evalq = eval(interaction.options.get("eval").value);

            const embed = new EmbedBuilder()
                .setTitle("Eval")
                .setFields(
                    {
                        name: "Code",
                        value: `
                            \`\`\`js
${interaction.options.get("eval").value}
\`\`\`
                        `
                    },
                    {
                        name: "output",
                        value: `
                            \`\`\`js
${evalq}
\`\`\`
                        `
                    }
                )
                .setColor('Green')
            interaction.editReply({ embeds: [embed] })
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
                        `
                    },
                    {
                        name: "Output (error)",
                        value: `
                            \`\`\`js
${error}
\`\`\`
                        `
                    }
                )
                .setColor('#DC143C')
            interaction.editReply({ embeds: [embed] })
        }
        

    }
}