const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const promocodes = require('../../../promocodes.json')
const [ comma, coin, shopify ] = require('../../utils/beatify')
/*
    If you clone the git and use this command, json looks something like this
    {
        "promocodeName" : "pRom0c4de-Valyou"
    }

    make sure the promocodes.json file is in the main direcotory above src
*/

module.exports = {
    name:"promocode",
    description:"Redeem promocodes hidden around anywhere for coins and items",
    blacklist: true,
    options: [
        {
            name:"code",
            description:"Enter the promocode you'd like to redeem.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true })
            const code = interaction.options.get("code").value

            if (!Object.values(promocodes).includes(code)) {interaction.editReply({content:"INvalid promocode", ephemeral: true}); return}

            interaction.editReply({content:"ok " + coin(93), ephemeral: true})
        } catch (error) {
			interaction.reply({content:'An error occured.', ephemeral: true})
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