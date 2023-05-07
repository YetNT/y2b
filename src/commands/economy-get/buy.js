const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const User = require('../../models/User')
const Inventory = require('../../models/Inventory')
const Items = require('../../utils/items/items.json')
const [ comma, coin, shopify ] = require('../../utils/beatify')

module.exports = {
    name:"buy",
    description:"Buy items",
    blacklist: true,
    options: [
        {
            name:"item",
            description:"Which item you buying?",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name:"Rock",
                    value:"rock"
                },
                {
                    name:"Stick",
                    value:"stick"
                },
                {
                    name:"Shield",
                    value:"shield"
                },
                {
                    name:"ShieldHP",
                    value:"shieldhp"
                }
            ]
        },
        {
            name:"amount",
            description:"How much of this item are you buying?",
            required: true,
            type: ApplicationCommandOptionType.Integer
        }
    ],

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()

            const item = interaction.options.get("item").value
            const amount = interaction.options.get("amount").value
            const cost = (Items[item].price * amount)
            let query = {
                userId: interaction.user.id
            }

            let user = await User.findOne(query)
            let inventory = await Inventory.findOne(query)

            if (!user) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You cannot buy items when you've got nothing") ] }); return}
            if (amount < 0) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("Don't buy amounts lower than 0") ] });return}
            if (cost > user.balance) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`You cannot afford ${comma(amount)} ${item}s`) ] }); return}
            
            if (inventory) {
                if ((inventory.inv.shield.amt + amount) > 20 && item == "shield") {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You can only have 20 shields.") ] }); return}
                user.balance -= cost
                if (item == "shield") {
                    inventory.inv.shield.amt += amount
                } else if (item == "shieldhp") {
                    inventory.inv.shield.hp += amount
                } else {
                    inventory.inv[item] += amount
                }
            } else {
                user.balance -= cost
                if (item == "shield") {
                    inventory = new Inventory({
                        ...query,
                        inv : {
                            shield : {
                                amt: amount
                            }
                       }
                    })
                
                } else if (item == "shieldhp") {
                    inventory = new Inventory({
                        ...query,
                        inv : {
                            shield: {
                                hp: amount
                            }
                        }
                    })
                } else {
                    inventory = new Inventory({
                        ...query,
                        inv : {
                            [item]: amount
                        }
                    })
                }
            }

            await user.save()
            await inventory.save()

            interaction.editReply({ embeds : [
                new EmbedBuilder()
                    .setTitle("W Purchase")
                    .setDescription(`Succesfully bought \`${amount} ${Items[item].name}\` for ${shopify(cost)}`)
                    .setColor("Green")
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