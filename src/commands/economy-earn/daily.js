const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const Cooldown = require('../../models/Cooldown')
const [ comma, coin, shopify ] = require('../../utils/beatify')

const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: 'Collect your daily coins',
  blacklist: true,
  cooldown: "1d",
  
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
    }  catch (error) {
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