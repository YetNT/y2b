const { Client, ApplicationCommandOptionType, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');


module.exports = {
    name:"balance",
    description:"view your or other's balance",
    options : [
        {
            name:"userid",
            description:"view another user's balance (leave blank to view yours)",
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
            await interaction.deferReply();
            const option = interaction.options.get('userid')?.value

            if (option) {
                // set the user id to the option field
                var querySet = option
            } else {
                // set the user id to the user's id
                var querySet = interaction.member.id
            }

            const query = {
                userId: querySet
            };
    
            let user = await User.findOne(query);
            
            if (user) {
                // if the user exists in the database =
                if (option !== undefined) {
                    interaction.editReply({ embeds: [
                        new EmbedBuilder()
                            .setTitle(`${option}'s Balance`)
                            .setFields(
                                {
                                    name:"Balance",
                                    value: `${user.balance}`
                                },
                                {
                                    name:"Bank",
                                    value: "Coming Soon!"
                                }
                            )
                            .setColor("DarkGreen")
                    ]})
                } else {
                    interaction.editReply({ embeds: [
                        new EmbedBuilder()
                            .setTitle(`${interaction.user.id}'s Balance`)
                            .setFields(
                                {
                                    name:"Balance",
                                    value: `${user.balance}`
                                },
                                {
                                    name:"Bank",
                                    value: "Coming Soon!"
                                }
                            )
                            .setColor("Green")
                    ]})
                }
                
            } else {
                // if the user does not exist in the database =
                if (option !== null) {
                    interaction.editReply(`${option} has nothing`)
                } else {
                    interaction.editReply(`You do not have anything`)
                }
            };
        } catch (error) {
            console.log(`errorrr wit balance ${error}`);
        };
    }
}
