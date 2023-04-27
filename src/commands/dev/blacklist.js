const { Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const Blacklist = require('../../models/Blacklist')

module.exports = {
    name:"blacklist",
    description:"blacklist users",
    devOnly: true,
    options: [
        {
            name:"query",
            description:"add or remove",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name:"add",
                    value:"add"
                },
                {
                    name:"remove",
                    value:"remove"
                }
            ],
            required: true
        }, 
        {
            name:"user",
            description:"which user to blacklist",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name:"reason",
            description:"why blacklist?",
            type: ApplicationCommandOptionType.String,
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
            interaction.deferReply()

            const code = interaction.options.get("query").value
            const victim = interaction.options.get("user").value
            const reason = interaction.options.get("reason").value
            const query = {
                userId: victim
            };

            let blacklist = await Blacklist.findOne(query)
              
            if (code === "add") {
                if (blacklist) {
                    if (blacklist.blacklisted === true) {interaction.editReply({content: "This is user has already been blacklisted", ephemeral: true}); return;}
                    blacklist.blacklisted = true;
                    blacklist.reason = reason
                } else {
                    blacklist = new Blacklist({
                        ...query,
                        blacklisted: true,
                        reason: reason
                    })
                }
            } else {
                if (blacklist) {
                    if (blacklist.blacklisted === false) {interaction.editReply({content: "This user is already removed from the blacklist.", ephemeral: true}); return;}
                    blacklist.blacklisted = false;
                    blacklist.reason = reason
                } else {
                    blacklist = new Blacklist({
                        ...query,
                        blacklisted: false,
                        reason: reason
                    })
                }
            }

            await blacklist.save();

            if (code === "add") {
                interaction.editReply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Blacklist")
                        .setDescription(`The user <@${victim}> has been add to the blacklist`)
                        .setFields(
                            {
                                name:"Reason",
                                value:`${reason}`
                            }
                        )
                        .setColor("Red")
                ]})
            } else {
                interaction.editReply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Blacklist")
                        .setDescription(`The user <@${victim}> has been removed from the blacklist`)
                        .setColor("Red")
                ]})
            }
        } catch (error) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`${error}`)
                ]
            })
        }
    }
}