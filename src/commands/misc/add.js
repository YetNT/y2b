const {
  ApplicationCommandOptionType,
} = require('discord.js');

module.exports = {
  name: 'add',
  description: 'Add 2 nums',
  deleted: true,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'num1',
      description: 'Number 1.',
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
    {
      name: 'num2',
      description: 'Number 2.',
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
  ],

  callback: (client, interaction) => {
  
    const num1 = interaction.options.get('num1').value;
    const num2 = interaction.options.get('num2').value;
    const ans = num1 + num2
  
    interaction.reply(`${num1} + ${num2} = ${num1 + num2}`);
  },
};
