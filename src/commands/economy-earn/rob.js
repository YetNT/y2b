const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const User = require('../../models/User')
const rndInt = require('../../utils/rndInt')

module.exports = {
    name:"rob",
    description:"robn some",
    options: [
        {
            name:"victim",
            description:"robbery",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    blacklist: true,
    cooldown: 10000,


    /**
    *
    * @param {Client} client
    * @param {Interaction} interaction
    */
    callback: async (client, interaction) => {

        try {
            await interaction.deferReply()
            let victimId = interaction.options.get("victim").value
            const sf = rndInt(1, 2) // 2 = success; 1 = failure

            let victim = await User.findOne({userId: victimId})
            const victimDm = await client.users.fetch(victimId).catch(() => null); // to dm the user.
            let author = await User.findOne({userId: interaction.user.id })

            if (victimId == interaction.user.id) {interaction.editReply("don't rob yourself."); return};
            if (!author) {interaction.editReply("You cannot rob people when you've got nothing"); return}
            if (author.balance < 1000) {interaction.editReply("You cannot rob people when your balance is lower than 1000."); return}
            if (!victim) {interaction.editReply("Leave them alone, they've got nothing :sob:"); return};
            if (victim.balance < 0) {interaction.editReply("This user is paying off their debts"); return};
            if (victim.balance <= 500) {interaction.editReply(`It aint worth it, they've only got ${victim.balance}`); return};
            
            const max = Math.floor(victim.balance / 2) // doing this so mfs dont get their whole ass robbed. 
            let sRob = rndInt(1, max) // user can only be robbed random amounts from 1 to half their balance
            let fRob = rndInt(Math.floor(author.balance / 2), author.balance) // if robbery failed deduct random amt between author/2 and author

            if (sf === 2) { // Succesful
                victim.balance -= sRob
                author.balance += sRob

                await victimDm.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("You have been robbed from!")
                            .setDescription(`<@${interaction.user.id}> stole **${sRob}** from you!`)
                            .setFooter({text: `Server = ${interaction.member.guild.name}`})
                    ]
                }).catch(() => null);

                interaction.editReply({
                    embeds : [
                        new EmbedBuilder()
                            .setTitle("Robbery :money_with_wings:")
                            .setDescription(`You stole a grand total of **${sRob}** from <@${victimId}>. Leaving them with ${victim.balance}`)
                            .setColor("Green")
                            .setFooter({text: "You monster"})
                    ]
                })
            } else { // failed
                author.balance -= fRob
                victim.balance += fRob

                interaction.editReply({
                    embeds : [
                        new EmbedBuilder()
                            .setTitle("Robbery")
                            .setDescription(`You tried robbing <@${victimId}> but they caught you before you could get away. You paid **${fRob}** in fines to <@${victimId}>`)
                            .setColor("Red")
                            .setFooter({text: "I knew this wouldnt work."})
                    ]
                })
            }

            await author.save()
            await victim.save()
        } catch (error) {
            interaction.editReply(
                {
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('ERROR!!!!')
                            .setDescription(error)
                    ]
                }
            )
        }
    }
}
