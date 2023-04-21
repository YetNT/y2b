const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const CooldownTimes = require('../../cooldownTimes.json')
const Cooldown = require('../../models/Cooldown')

module.exports = {
    name:"rob",
    description:"robn some",

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

            if (cooldown && cooldown.COMMAND_NAME) {
                const remainingTime = cooldown.COMMAND_NAME - Date.now()
                if ( remainingTime > 0){
                  interaction.editReply(`You are on cooldown. Please wait ${Math.ceil(remainingTime / 1000)} seconds.`)
                  return;
                }
            }

            interaction.editReply("Robbing in progress...")
            /*
            CODE GOES HEREEEEEE
            
            make sure you have this command in the models and the cooldown times in millieconds
            */

            if (cooldown) {
                cooldown.COMMAND_NAME = Date.now() + CooldownTimes.COMMAND_NAME
                await cooldown.save()
            } else {
                const newCooldown = new Cooldown({
                    userId: userId,
                    COMMAND_NAME: Date.now() + CooldownTimes.COMMAND_NAME
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
