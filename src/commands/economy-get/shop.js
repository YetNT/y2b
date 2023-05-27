const { Client, Interaction, EmbedBuilder } = require('discord.js')
const items = require('../../utils/items/items.json')
const [ comma, coin, shopify ] = require('../../utils/beatify')

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
        } catch (error) {
			interaction.editReply('An error occured!')
			client.guilds.cache.get("808701451399725116").channels.cache.get("971098250780241990").send({ embeds : [
				new EmbedBuilder()
				.setTitle(`An error occured. Command name = ${interaction.commandName}`)
				.setDescription(`\`${error}\``)
				.setTimestamp()
				.setFooter({text:`Server ID : ${interaction.guild.id} | User ID : ${interaction.user.id} | Error was also logged to console.`})
			]})
			console.log(error)
		}
    }
}