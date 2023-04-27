const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const Cooldown = require('../../models/Cooldown')

const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: 'Collect your dailies!',
  blacklist: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
      };

      let user = await User.findOne(query);
      let cooldown = await Cooldown.findOne(query);

      if (cooldown) {
        const lastDailyDate = cooldown.daily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected your dailies today. Come back tomorrow!'
          );
          return;
        }
        
        cooldown.daily = new Date();

        await cooldown.save()
      } else {
        cooldown = new Cooldown({
          ...query,
          daily: new Date(),
        });
        await cooldown.save()
      }

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
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}`
      );
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};