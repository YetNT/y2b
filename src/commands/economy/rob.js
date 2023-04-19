const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const CooldownTimes = require('../../cooldownTimes.json')
const Cooldown = require('../../models/Cooldown')

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

    /**
    *
    * @param {Client} client
    * @param {Interaction} interaction
    */
    callback: async (client, interaction) => {

        try {

            await interaction.deferReply()
/*
            const query = {
                userId: interaction.member.id
            };
        
            let cooldown = await Cooldown.findOne(query);

            if (cooldown.rob == true) {
                interaction.editReply("lmao you on cooldown noob")
            } else {
                interaction.editReply("no cooldown")
            }

            if (cooldown) {
                if (cooldown.rob == true) { return }

                console.log("cooldown started for" + interaction.user.username)

                cooldown.rob = true
            } else {
                cooldown = new Cooldown({
                    ...query,
                    rob: true
                })
            }

            setTimeout(() => {
                cooldown.rob = false
                console.log("cooldown for" + interaction.user.username)

                cooldown.save()
            }, CooldownTimes.rob)


            await cooldown.save()
*/
            interaction.editReply("robbed" + interaction.options.get("victim").value)
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