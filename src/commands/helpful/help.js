const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const errorHandler = require('../../utils/errorHandler')

let eco = ['daily', 'rob', 'work', 'balance', 'deposit', 'withdraw', 'buy', 'promocode', 'share', 'shop', 'inventory', 'leaderboard', 'item']
let other = ['help', 'ping', 'command', 'info']

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
                        .setEmoji('💸'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Others')
                        .setDescription('The other commands')
                        .setValue('other')
                        .setEmoji('ℹ️'), // this is the emoji `ℹ️` not letter
                );
            
            const invite = new ButtonBuilder()
                .setLabel("Invite")
                .setURL("https://discord.com/oauth2/authorize?client_id=701280304182067251&permissions=412317141056&scope=applications.commands%20bot")
                .setStyle(ButtonStyle.Link)
            const support = new ButtonBuilder()
                .setLabel("Support Server")
                .setURL("https://discord.gg/r2rdHXTJvs")
                .setStyle(ButtonStyle.Link)

            const row1 = new ActionRowBuilder()
                .addComponents(select);
            const row2 = new ActionRowBuilder()
                .addComponents(invite, support)

            await interaction.editReply({
                content: 'help',
                components: [row1, row2],
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

                        await message.edit({ content: "_ _", components: [row1, row2], embeds: [new EmbedBuilder().setTitle("Economy").setFields(ecoFields).setColor("Random")] });
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

                        await message.edit({ content: "_ _", components: [row1, row2], embeds: [new EmbedBuilder().setTitle("Others").setFields(otherFields).setColor("Random")] });
                    }
                   interaction.deferUpdate()
                    if (message) {
                        setTimeout(async () => {
                            message.edit({components:[row2]});
                        }, 30000);
                    } else {
                        // do nothing.
                    }
                    
                }
            });
        }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}