const { Client, Interaction, EmbedBuilder } = require('discord.js')

let names = ['daily', 'rob', 'work', 'balance', 'deposit', 'withdraw', 'help', 'ping']
var desc = [];
let fields = [];

module.exports = {
    name: "help",
    description: "Get help with commands",

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const commands = await client.application?.commands.fetch();
            names.forEach((n) => {
                let r = commands.find(l => l.name === n);
                desc.push(r.description);
            });

            await new Promise((resolve) => {
                for (let i = 0; i < names.length; i++) {
                    fields.push({
                        name: names[i],
                        value: desc[i]
                    });
                }
                resolve();
            });

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("help")
                        .setFields(fields)
                ]
            });
        } catch (error) {
            console.log(error);
        }
    }
}
