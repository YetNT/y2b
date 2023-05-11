const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder } = require('discord.js')
const { newCooldown, checkCooldown } = require('../../utils/cooldown') // import custom cooldown handler

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
            await interaction.deferReply();
            /*
             * add any errors over here, so cooldown only executes if all checks have been passed
             */
            const cooldownResult = await checkCooldown(COMMAND_NAME, interaction, EmbedBuilder);
            if (cooldownResult === 0) {
              return;
            }

            /*
            CODE GOES HEREEEEEE
            
            cooldown time can be like '1d' pr '20m' cuz i made it work lolololol
            */

            await newCooldown('TIME', interaction, COMMAND_NAME)

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
