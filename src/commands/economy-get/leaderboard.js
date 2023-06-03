const {EmbedBuilder } = require('discord.js')
const User = require('../../models/User')
const Inventory = require('../../models/Inventory')
const {comma, coin} = require('../../utils/beatify')
const { randomItem } = require('../../utils/items/items')
const errorHandler = require('../../utils/errorHandler')

module.exports = {
    name : "leaderboard",
    description:"View the coins leaderboard",
    blacklist: true,

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
        }
          catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}