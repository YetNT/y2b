const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { all, withoutShield, itemNames, itemNamesNoShield } = require('../../utils/items/items')
const [ comma, coin ] = require('../../utils/beatify')
const Inventory = require('../../models/Inventory')

module.exports = {
    name:"inventory",
    description:"See yours or another user's inventory",
    options : [
        {
            name:"user",
            description:"Select which user's inventory you'd like to see",
            type: ApplicationCommandOptionType.User
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()
            let query;
            let user = interaction.options.get('user')?.value
            let userInfo;
            if (user) {
                query = {
                    userId: user
                }
                userInfo = await client.users.cache.get(user)
            } else {
                query = {
                    userId : interaction.user.id
                }
                userInfo = await client.users.cache.get(interaction.user.id)
            }

            let inventory = await Inventory.findOne(query)
            if (!inventory) interaction.editReply({ embeds : [ new EmbedBuilder().setTitle(`${userInfo.username}'s Inventory`).setDescription("User has no items yet.") ]});
            let output = []

            for (let item of Object.values(withoutShield)) {
                let id = item.id
                if((inventory.inv.hasOwnProperty(item.id) == true) && inventory.inv[item.id] > 0) {
                    output.push(`${withoutShield[id].name} ${all[id].emoji} - **${comma(inventory.inv[id])}**`)
                }
            }

            let shieldOutput;
            if (inventory.inv.shield.amt > 0) {
                shieldOutput = `*Active*\nShield Hp - **${inventory.inv.shield.hp}**`
            } else {
                shieldOutput = '*Inactive*'
            }

            
            await interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setTitle(`${userInfo.username}'s Inventory`)
                    .setDescription(shieldOutput)
                    .setFields([
                        {
                            name:"Badges",
                            value: "(Coming soon)"
                        },
                        {
                            name:"Items",
                            value: output.join('\n')
                        }
                    ])
                    .setColor("Blue")
                    .setThumbnail("https://cdn.discordapp.com/avatars/"+userInfo.id+"/"+userInfo.avatar+".jpeg")
            ] })


        }  catch (error) {
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