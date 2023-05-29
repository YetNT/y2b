const {Client, Interaction, EmbedBuilder} = require('discord.js')
const pkg = require('../../../package.json')

module.exports = {
    name:"info",
    description:"Bot's info and other stuff",

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            interaction.reply({
                embeds : [
                    new EmbedBuilder()
                        .setTitle("Stats")
                        .setFields([
                            {
                                name: "Slash command count",
                                value: `${interaction.client.application.commands.cache.size}`,
                                inline: true
                            },
                            {
                                name: "Total user count",
                                value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`,
                                inline: true
                            },
                            {
                                name:"Guild count",
                                value: `${client.guilds.cache.size}`,
                                inline: true
                            },
                            {
                                name: "Discord.js version",
                                value: `${pkg.dependencies['discord.js']}`,
                                inline: true
                            },
                            {
                                name: "Mongoose version",
                                value: `${pkg.dependencies.mongoose}`,
                                inline: true
                            },
                            {
                                name: "Github repository",
                                value: `[Github repo](https://github.com/Yetity/y2b "ay bruh why u hoverin over dis?")`,
                                inline: true
                            }
                        ])
                        .setColor("#ADD8E6")
                ]
            })
        } catch (error) {
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