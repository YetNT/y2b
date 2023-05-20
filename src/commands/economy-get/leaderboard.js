const { Client, Interaction, EmbedBuilder } = require('discord.js')
const User = require('../../models/User')
const Inventory = require('../../models/Inventory')
const [ comma, coin, shopify ] = require('../../utils/beatify')
const { randomItem } = require('../../utils/items/items')

module.exports = {
    name : "leaderboard",
    description:"View the coins leaderboard",

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()
            const randomItemObj = randomItem()
            const leaderboard = await User.find({ balance: { $exists: true } })
                .sort({ balance: -1 })
                .limit(10)
                .select('userId balance -_id')

            const query = {};
            query[`inv.${randomItemObj.id}`] = { $exists: true };

            const leaderboard2 = await Inventory.find(query)
                .sort({ [`inv.${randomItemObj.id}`]: -1 })
                .limit(10)
                .select(`userId inv.${randomItemObj.id} -_id`);
            // sort by descending balance, limit to top 10, select userId and balance fields, exclude _id field
            
            let output = [];
            for (let i = 0; i < leaderboard.length; i++) {
                output.push(`${i+1}. <@${leaderboard[i].userId}> - ${coin(leaderboard[i].balance)}`)
            }

            let output2 = [];
            for (let i = 0; i < leaderboard2.length; i++) {
                output2.push(`${i+1}. <@${leaderboard2[i].userId}> - **${comma(leaderboard2[i].inv[randomItemObj.id])}**`)
            }

            await interaction.editReply({ embeds: [ new EmbedBuilder()
                .setTitle("Leaderboard")
                .setColor("Yellow")
                .setFields([
                    {
                        name:"Money",
                        value:output.join('\n'),
                        inline:true
                    },
                    {
                        name:`Random Item - ${randomItemObj.name}`,
                        value:output2.join('\n'),
                        inline:true
                    }
                ])
            ]})
        } catch (error) {
			interaction.editReply('An error occured.')
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