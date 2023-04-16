const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bans a member!!!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'target',
      description: 'The user to ban.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    interaction.reply(`banned ${interaction.options.get('target').value} with the reason "${interaction.options.get('reason').value}" **(JOKE)**`);
  },
};
