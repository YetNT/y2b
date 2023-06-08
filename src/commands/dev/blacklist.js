// ONLY AVAILABLE ON BETA BOT!!!!!!!
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const Blacklist = require('../../models/Blacklist')
const errorHandler = require('../../utils/errorHandler')

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
            description:"User id of the user you would like to blacklist. This is parsed as a string cuz discord gae",
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
            await interaction.deferReply({ephemeral: true})

            const code = interaction.options.get("query").value
            const victim = interaction.options.get("user").value
            const reason = interaction.options.get("reason").value

            let victimUser = await client.users.fetch(victim)

            const time = Date.now()
            const query = {
                userId: victim
            };

            let blacklist = await Blacklist.findOne(query)
        

            if (code === "add") {
                if (blacklist) {
                    if (blacklist.blacklisted == true) {interaction.editReply({content:"This user has already been blacklisted",ephemeral: true}); return}
                    blacklist.blacklisted = true;
                    blacklist.reason = reason
                    blacklist.time = time
                } else {
                    blacklist = new Blacklist({
                        ...query,
                        blacklisted: true,
                        reason: reason,
                        time: time
                    })
                }
            } else {
                if (blacklist) {
                    if (blacklist.blacklisted == false) {interaction.editReply({content:"This user is already removed from the blacklist.",ephemeral: true}); return}
                    blacklist.blacklisted = false;
                    blacklist.reason = reason
                    blacklist.time = time
                } else {
                    blacklist = new Blacklist({
                        ...query,
                        blacklisted: false,
                        reason: reason,
                        time: time
                    })
                }
            }

            await blacklist.save();

            if (code === "add") {
                interaction.editReply({ 
                    embeds: [
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
                    ],
                    ephemeral: true
                })

                // log to support server

                client.guilds.cache.get("808701451399725116").channels.cache.get("858644165038047262").send({ 
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New Blacklist")
                            .setFields([
                                {
                                    name:"User",
                                    value:`Name: **${victimUser.username}** \n`+ `Discrim: **${victimUser.discriminator}** \n` + `User Id: **${victim}**`,
                                    inline: true
                                },
                                {
                                    name:"Reason",
                                    value:`${reason}`,
                                    inline: true
                                },
                                {
                                    name: "Time (epoch)",
                                    value: `${time}`,
                                    inline: true
                                }
                            ])
                            .setThumbnail(victimUser.avatarURL())
                            .setColor("Red")
                            .setImage("https://cdn.discordapp.com/emojis/860970578684018700.webp?size=160&quality=lossless")
                    ]
                });
            } else {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Blacklist")
                            .setDescription(`The user <@${victim}> has been removed from the blacklist`)
                            .setColor("Red")
                    ],
                    ephemeral: true
                })

                // log to support server

                client.guilds.cache.get("808701451399725116").channels.cache.get("858644165038047262").send({ 
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New Blacklist Removal")
                            .setFields(
                                {
                                    name:"User",
                                    value:`Name: **${victimUser.username}** \n`+ `Discrim: **${victimUser.discriminator}** \n` + `User Id: **${victim}**`,
                                    inline: true
                                },
                                {
                                    name: "Time (epoch)",
                                    value: `${time}`,
                                    inline: true
                                }
                            )
                            .setColor("Green")
                            .setThumbnail(victimUser.avatarURL())
                            .setImage("https://cdn.discordapp.com/emojis/860970578747981864.webp?size=160&quality=lossless")
                    ]
                });
            }
        }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
    }
}