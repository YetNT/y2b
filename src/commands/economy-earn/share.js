const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const User = require('../../models/User')
const Inventory = require('../../models/Inventory')
const Blacklist = require('../../models/Blacklist')
const [ comma, coin ] = require('../../utils/beatify')

module.exports = {
    name:"share",
    description: "share your wealth with other people",
    options: [
        {
            name:"user",
            description:"Who are you sharing to?",
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name:"amount",
            description:"How much are you sharing to this person?",
            required: true,
            type: ApplicationCommandOptionType.Integer
        },
        {
            name:"item",
            description:"Are you sharing an item? (If not leave this empty)",
            requred: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name:"Rock",
                    value:"rock"
                },
                {
                    name:"Stick",
                    value:"stick"
                }
            ]
        }
    ],
    blacklist: true,
    cooldown: '15s',
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    callback: async (client, interaction) => {
        try {
            interaction.deferReply()
            const userToGiveId = interaction.options.get("user").value
            let utgi = await client.users.fetch(userToGiveId) // cache the user to check if their a bot later on
            const amount = interaction.options.get("amount").value
            const item = interaction.options.get("item")?.value
            let isItem; let shareVar; let warning = ``; let t = await coin(amount)

            let user = await User.findOne({userId: userToGiveId})
            let userInv = await Inventory.findOne({userId: userToGiveId})
            let authorInv = await Inventory.findOne({userId: interaction.user.id})
            let blacklist = await Blacklist.findOne({userId: userToGiveId})
            let author = await User.findOne({userId: interaction.user.id})

            if (!author || author.balance < 0 || !authorInv) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You've got nothing to give.").setColor("Red")] }); return}
            if (utgi.bot == true) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You can't share with bots.").setColor("Red") ]});return}
            if (blacklist && blacklist.blacklisted == true) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("that user is blacklisted.").setColor("Red") ]});return}
            if (userToGiveId == interaction.user.id) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You cannot share with yourself").setColor("Red") ] });return}

            if (item) {
                isItem = true
                shareVar = `Share ${item}`;
                warning = `Are you sure that you'd like to share ${amount} ${item}s with <@${userToGiveId}>`
                if (authorInv.inv[item] < amount) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You have less than what you'd like to give").setColor("Red") ] });return}
            } else {
                isItem = false
                shareVar = 'Share Coins';
                warning = `Are you sure that you'd like to share ${t} with <@${userToGiveId}>`
                if (author.balance < amount) {interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("You have less than what you'd like to give").setColor("Red") ] });return}
            }

            const confirm = new ButtonBuilder().setCustomId('confirm').setLabel(shareVar).setStyle(ButtonStyle.Danger);
		    const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Success);
            const confirmDisabled = new ButtonBuilder().setCustomId('confirm').setLabel(shareVar).setStyle(ButtonStyle.Danger).setDisabled(true);
		    const cancelDisabled = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Success).setDisabled(true);
    
            const response = await interaction.editReply({
                embeds : [ new EmbedBuilder().setTitle("Confirmation").setDescription(warning) ],
                components: [new ActionRowBuilder().addComponents(cancel, confirm)],
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
	            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

                if (confirmation.customId === 'confirm') {

                    if (user) { // If the user exists
                        if (item) {
                            userInv.inv[item] += amount
                            authorInv.inv[item] -= amount
                        } else {
                            user.balance += amount
                            author.balance -= amount
                        }
                    } else { // User does not exist
                        if (item) {
                            userInv = new Inventory({
                                userId: userToGiveId,
                                inv : {
                                    [item]: amount
                                }
                            })
                            authorInv.inv[item] -= amount
                        } else {
                            user = new User({
                                userId: userToGiveId,
                                balance: amount
                            })
                            author.balance -= amount
                        }
                    }

                    let response;
                    if (item) {
                        await userInv.save()
                        await authorInv.save()
                        response = `Shared ${comma(amount)} ${item} with <@${userToGiveId}>`
                    } else {
                        await user.save()
                        await author.save()
                        response = `Shared ${coin(amount)} with <@${userToGiveId}>`
                    }

                    await confirmation.update({
                        embeds: [ new EmbedBuilder()
                            .setTitle("Sharing is caring")
                            .setColor("Yellow")
                            .setDescription(response)
                        ],
                        components: [new ActionRowBuilder().addComponents(confirmDisabled)] 
                    });

                } else if (confirmation.customId === 'cancel') {

                    await confirmation.update({ embeds: [ new EmbedBuilder().setDescription("Cancelled share.") ], components: [new ActionRowBuilder().addComponents(cancelDisabled)] });

                }

            } catch (e) { // User did not confirm whether they want to share the coins or not
	            await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("Confirmation not received within 1 minute, cancelling") ], components: [new ActionRowBuilder().addComponents(cancelDisabled, confirmDisabled)], });
            }
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