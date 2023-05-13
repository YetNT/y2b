const { Client, Interaction, EmbedBuilder } = require('discord.js')
const User = require('../../models/User')
const [ comma, coin, shopify ] = require('../../utils/beatify')

module.exports = {
    name : "leaderboard",
    description:"View the coins leaderboard",

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()
            const leaderboard = await User.find({ balance: { $exists: true } })
                .sort({ balance: -1 })
                .limit(10)
                .select('userId balance -_id')
            // sort by descending balance, limit to top 10, select userId and balance fields, exclude _id field
            
            let output = [];
            for (let i = 0; i < leaderboard.length; i++) {
                output.push(`\n${i+1}. <@${leaderboard[i].userId}> - ${coin(leaderboard[i].balance)}`)
            }

            await interaction.editReply({ embeds: [ new EmbedBuilder()
                .setTitle("Leaderboard")
                .setColor("Yellow")
                .setDescription(output.join('\n'))
            ]})
        }  catch (error) {
		}
    }
}