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

            const userId = interaction.user.id
            const cooldown = await Cooldown.findOne({ userId: userId })

            if (cooldown && cooldown.rob) {
                const remainingTime = cooldown.rob - Date.now()
                if ( remainingTime > 0){
                  interaction.editReply(`You are on cooldown. Please wait ${Math.ceil(remainingTime / 1000)} seconds.`)
                  return;
                }
            }

            interaction.editReply("Robbing in progress...")
            const victim = interaction.options.get("victim").user
            // rob code will go here 

            if (cooldown) {
                cooldown.rob = Date.now() + CooldownTimes.rob
                await cooldown.save()
            } else {
                const newCooldown = new Cooldown({
                    userId: userId,
                    rob: Date.now() + CooldownTimes.rob
                })
                await newCooldown.save()
            }

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
