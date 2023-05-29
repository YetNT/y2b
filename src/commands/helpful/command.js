const {Client, Interaction,ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const ServerCommand = require("../../models/ServerCommand")

module.exports = {
    name: "command",
    description:"Server Command Disbale/Enable/List",
    options: [
        {
            name: "list",
            description: "List enabled and disabled commands in the server.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "enable",
            description: "Enable a command in this server",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name:"command",
                    description: "Which command you enablin?",
                    choices:[
                        {
                            name:"Rob",
                            value:"rob"
                        }
                    ],
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name:"disable",
            description: "Disable a command in this server",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name:"command",
                    description: "Which command you disablin?",
                    choices:[
                        {
                            name:"Rob",
                            value:"rob"
                        }
                    ],
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
	
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply()
            const guildId = interaction.guild.id
            let query = {
                guildId : guildId
            }
            let serverCommand = await ServerCommand.findOne(query)
            let subcommand = interaction.options.getSubcommand();
            
            if (subcommand === "list") {
                return
            } else if (subcommand === "enable") {
                console.log("enable!")
                let command = interaction.options.getString('command');

                if (!serverCommand) {interaction.editReply("Command is already enabled"); return}
                if (serverCommand[command] == false) {interaction.editReply("Command is already enabled."); return}

                serverCommand[command] = false
                await interaction.editReply({
                    embeds : [
                        new EmbedBuilder()
                            .setTitle(`${command} has been enabled`)
                            .setDescription(`The command \`${command}\` has been enabled. Users can now run this command in this server.`)
                    ]
                })
                await serverCommand.save()
            } else if (subcommand === "disable") {
                console.log("disable!")
                let command = interaction.options.getString('command');

                if (serverCommand && serverCommand[command] == true) {interaction.editReply("Command is already disabled."); return}

                if (serverCommand) {
                    serverCommand[command] = true
                } else  {
                    serverCommand = new ServerCommand({
                        guildId: guildId,
                        [command]: true
                    })
                }

                await interaction.editReply({
                    embeds : [
                        new EmbedBuilder()
                            .setTitle(`${command} has been disabled`)
                            .setDescription(`The command \`${command}\` has been disabled. Users can no longer run this command in this server.`)
                    ]
                })
                await serverCommand.save()
            }
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