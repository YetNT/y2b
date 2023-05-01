const { /*PermissionFlgasBits,*/ Client, Interaction } = require('discord.js')

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
  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
