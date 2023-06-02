const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const Items = require('../../utils/items/items.json')
const { all, withoutShield, itemNames, itemNamesNoShield } = require('../../utils/items/items')
const [ comma, coin, shopify ] = require('../../utils/beatify')
const errorHandler = require('../../utils/errorHandler')

module.exports = {
    name:"item",
    description:"View item's information.",
    blacklist: true,
    options: [
        {
            name:"item",
            description:"Which item you buying?",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: itemNames()
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
            const item = interaction.options.get("item").value
            await interaction.editReply({ embeds: [ new EmbedBuilder()
                .setTitle(Items[item].name)
                .setFields([
                    {
                        name:"Info",
                        value: Items[item].description,
                        inline: true
                    },
                    {
                        name:"Uses",
                        value: Items[item].uses.length > 0 ? Items[item].uses.join("\n") : "This item has no uses.",
                        inline: true
                    },
                    {
                        name:"Price",
                        value: coin(Items[item].price),
                        inline: true
                    },
                    {
                        name: "ID",
                        value: `\`${Items[item].id}\``,
                        inline: true
                    }
                ])
                .setFooter({text: `Rarity: ${Items[item].rarity}`})
            ]})
        }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}