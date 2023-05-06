const { Client, Interaction, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "slash-test",
    description: "jh",
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            const select = new StringSelectMenuBuilder()
                .setCustomId('starter')
                .setPlaceholder('Make a selection!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('h')
                        .setDescription('woah')
                        .setValue('h'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('q')
                        .setDescription('yep')
                        .setValue('q'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('s')
                        .setDescription('breh')
                        .setValue('s'),
                );

            const row = new ActionRowBuilder()
                .addComponents(select);

            await interaction.reply({
                content: 'hmm',
                components: [row],
            });

            client.on('interactionCreate', async (interaction) => {
                if (interaction.isStringSelectMenu() && interaction.customId === 'starter') {
                    const selectedOption = interaction.values[0];
                    var message = await interaction.message.fetch();

                    if (selectedOption === 'h') {
                        await message.edit({ content: "h", components: [row] });
                    }
                    if (selectedOption === 'q') {
                        await message.edit({ content: "q", components: [row] });
                    }
                    if (selectedOption === 's') {
                        await message.edit({ content: "s", components: [row] });
                    }
                }
            });

            setTimeout(async () => {
                const message = await interaction.fetchReply();
                message.delete();
            }, 30000);

            interaction.channel.client.on('interactionCreate', async (interaction) => {
                if (interaction.isMessageComponent() && interaction.customId === 'starter') {
                    const message = await interaction.message.fetch();
                    message.delete();
                    await interaction.reply({
                        content: 'hmm',
                        components: [row],
                    });
                    setTimeout(async () => {
                        const newMessage = await interaction.fetchReply();
                        newMessage.delete();
                    }, 30000);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}