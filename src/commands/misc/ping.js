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
     console.log(error) 
    }
  },
};
