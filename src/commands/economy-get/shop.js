const { Client, Interaction, EmbedBuilder } = require('discord.js')
const items = require('../../utils/items/items.json')
const [ comma, coin, shopify ] = require('../../utils/beatify')
const errorHandler = require('../../utils/errorHandler')

module.exports = {
    name:"shop",
    description:"Shop for items that you (tottaly) can afford",
    blacklist: true,
    
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()
            let reply = ``;

            for (let item in items) {
                reply += `__${items[item].name}__ - ${shopify(items[item].price)}\n`;
            }

            await interaction.editReply({ embeds : [
                new EmbedBuilder()
                    .setTitle("Shop")
                    .setDescription(reply)
                    .setColor("Fuchsia")
            ] })
        }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}