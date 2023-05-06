
const { Client, Interaction, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')

let eco = ['daily', 'rob', 'work', 'balance', 'deposit', 'withdraw']
let other = ['help', 'ping']

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

            const select = new StringSelectMenuBuilder()
                .setCustomId('help')
                .setPlaceholder('Pick a category')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Economy')
                        .setDescription('All the economy commands')
                        .setValue('eco')
                        .setEmoji(':money_with_wings:'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Others')
                        .setDescription('The other commands')
                        .setValue('other')
                        .setEmoji(':information_source:'),
                );

            const row = new ActionRowBuilder()
                .addComponents(select);

            await interaction.editReply({
                content: 'help',
                components: [row],
            });

            client.on('interactionCreate', async (interaction) => {
                if (interaction.isStringSelectMenu() && interaction.customId === 'help') {
                    const selectedOption = interaction.values[0];
                    var message = await interaction.message.fetch();
                    let r; // get slash command from cache

                    if (selectedOption === 'eco') {
                        let ecoDesc = []
                        let ecoId = []
                        let ecoFields = []

                        eco.forEach((n) => {
                            r = commands.find(l => l.name === n);
                            ecoId.push(r.id)
                            ecoDesc.push(r.description);
                        });
            
                        await new Promise((resolve) => {
                            for (let i = 0; i < eco.length; i++) {
                                ecoFields.push({
                                    name: `**</${eco[i]}:${ecoId[i]}>**`,
                                    value: ecoDesc[i]
                                });
                            }
                            resolve();
                        });

                        await message.edit({ content: "h", components: [row], embeds: [new EmbedBuilder().setTitle("Economy").setFields(ecoFields).setColor("#4FC5E3")] });
                    }
                    if (selectedOption === 'other') {
                        let otherDesc = []
                        let otherId = []
                        let otherFields = []

                        other.forEach((n) => {
                            r = commands.find(l => l.name === n);
                            otherId.push(r.id)
                            otherDesc.push(r.description);
                        });
            
                        await new Promise((resolve) => {
                            for (let i = 0; i < other.length; i++) {
                                otherFields.push({
                                    name: `**</${other[i]}:${otherId[i]}>**`,
                                    value: otherDesc[i]
                                });
                            }
                            resolve();
                        });

                        await message.edit({ content: "h", components: [row], embeds: [new EmbedBuilder().setTitle("Others").setFields(otherFields).setColor("#4FC5E3")] });
                    }
                   interaction.deferUpdate()
                    if (message) {
                        setTimeout(async () => {
                            message.edit({components:[]});
                        }, 30000);
                    } else {
                        // do nothing.
                    }
                    
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}