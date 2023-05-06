const { /*PermissionFlgasBits,*/ Client, Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'ping',
	description: 'Pong!',
	// devOnly: Boolean,
	testOnly: true,
	// options: Object[],
	// deleted: Boolean,
	// cooldown: 10000,
	// blacklist: true,
	// permissionsRequired: [PermissionFlagsBits.Administrator],
	// botPermissions: [PermissionFlagsBits.Administrator],

	/**
	 * 
	 * @param {Client} client 
	 * @param {Interaction} interaction 
	 */
	callback: async (client, interaction) => {
		try {
			const sent = await interaction.reply({ embeds: [new EmbedBuilder().setDescription('Pinging...')], fetchReply: true });
			interaction.editReply({
				embeds : [
					new EmbedBuilder()
					.setTitle("Pong!")
					.setFields(
						[
							{
								name:"Roundtrip latency",
								value:`${sent.createdTimestamp - interaction.createdTimestamp}ms`,
								inline: true
							},
							{
								name:"Websocket heartbeat",
								value: `${client.ws.ping}ms.`,
								inline: true
							}
						]
					)
					.setColor("Green")
				]
			});
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
	},
};
