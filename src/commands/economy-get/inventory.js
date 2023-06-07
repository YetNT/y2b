const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { all, withoutShield } = require('../../utils/items/items')
const { comma } = require('../../utils/beatify')
const Inventory = require('../../models/Inventory')
const Badges = require('../../models/Badges')
const allBadges = require('../../utils/badges/badges.json')
const { progressBar } = require('../../utils/progressBar')
const errorHandler = require('../../utils/errorHandler')

module.exports = {
    name:"inventory",
    description:"See yours or another user's inventory",
    blacklist: true,
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
            let badges = await Badges.findOne(query)
            if (!badges) {badges = {badges:{}}}
            if (!inventory) {interaction.editReply({ embeds : [ new EmbedBuilder().setTitle(`${userInfo.username}'s Inventory`).setDescription("User has no items yet.") ]}); return}
            let invOutput = []
            let badgeOutput = []
            let rareInvOutput = []

            // set outputs
            for (let item of Object.values(withoutShield)) {
                let id = item.id
                if((inventory.inv.hasOwnProperty(item.id) == true) && inventory.inv[item.id] > 0) {
                    if (all[id].rarity == "Rare" || all[id].rarity == "Extremely Rare") {
                        rareInvOutput.push(`${all[id].emoji} **${withoutShield[id].name}** - ${comma(inventory.inv[id])}\n_${all[id].rarity}_`)
                    } else {
                        invOutput.push(`${all[id].emoji} **${withoutShield[id].name}** - ${comma(inventory.inv[id])}\n_${all[id].rarity}_`)
                    }
                }
            }

            for (let badge of Object.values(allBadges)) {
                let id = badge.id
                if((badges.badges.hasOwnProperty(badge.id) == true) && badges.badges[badge.id] > 0) {
                    badgeOutput.push(`${allBadges[id].emoji}`)
                }
            }
            
            // checks
            if (typeof invOutput !== 'undefined' && invOutput.length === 0) {
                invOutput.push("User is broke as hell")
                invOutput.push(":skull:")
            }

            if (typeof rareInvOutput !== 'undefined' && rareInvOutput.length === 0) {
                rareInvOutput.push("User is has no rare items")
                rareInvOutput.push(":skull:")
            }

            if (typeof badgeOutput !== 'undefined' && badgeOutput.length === 0) {
                badgeOutput.push("Bro has no badges.")
                badgeOutput.push(":skull:")
            }

            let shieldOutput;
            let bar;
            if (inventory.inv.shield.amt > 0 && inventory.inv.shield.hp > 0) {
                bar = progressBar(inventory.inv.shield.hp / 5, 10, "<:progressempty:1113377221067931699>", "<:progressfull:1113377216743624705>", false, ["<:firstempty:1113377223567736832>", "<:firstfull:1113377227069997137>"], ["<:lastempty:1113377233248198687>","<:lastfull:1113377230693879821>"])
                shieldOutput = `*[Active](https://discord.com "${inventory.inv.shield.amt} Shields")*\n` + bar + ` **${inventory.inv.shield.hp}/500**`
            } else {
                shieldOutput = `*[Inactive](https://discord.com "${inventory.inv.shield.amt} Shields")*`
            }

            // send outputs
            await interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setTitle(`${userInfo.username}'s Inventory`)
                    .setFields([
                        {
                            name:"Shield",
                            value: shieldOutput,
                            inline: false
                        },
                        {
                            name:"Badges",
                            value: badgeOutput.join(' '),
                            inline: false
                        },
                        {
                            name:"Items",
                            value: invOutput.join('\n \n'),
                            inline: true
                        },
                        {
                            name:"Real Items",
                            value: rareInvOutput.join('\n \n'),
                            inline: true
                        }
                    ])
                    .setColor("Blue")
                    .setThumbnail("https://cdn.discordapp.com/avatars/"+userInfo.id+"/"+userInfo.avatar+".jpeg")
            ] })


        }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}