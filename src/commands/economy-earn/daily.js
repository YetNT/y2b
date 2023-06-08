const { EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { comma, coin } = require('../../utils/beatify')
const { newCooldown, checkCooldown } = require('../../utils/cooldown')
const errorHandler = require('../../utils/errorHandler')

const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: 'Receive your daily reward of 1000',
  blacklist: true,
  
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const cooldownResult = await checkCooldown('daily', interaction, EmbedBuilder);
      if (cooldownResult === 0) {
        return;
      }

      const query = {
        userId: interaction.member.id,
      };

      let user = await User.findOne(query);

      if (user) {
        user.balance += dailyAmount;
      } else {
        user = new User({
          ...query,
          balance: dailyAmount
        })
      }
      
      await user.save();

      interaction.editReply(
        { embeds : [ new EmbedBuilder()
          .setTitle("Daily Reward")
          .setDescription(`${comma(dailyAmount)} was added to your balance. Your new balance is ${coin(user.balance)}`)
          .setColor("Yellow")
        ]}
      );

      await newCooldown('1d', interaction, 'daily')
    }  catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
  },
};