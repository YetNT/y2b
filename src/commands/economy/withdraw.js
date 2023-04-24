const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const User = require('../../models/User')

module.exports = {
    name:"withdraw",
    description:"withdraw fr",
    blacklist: true,
    options: [
        {
            name:"amount",
            description:"how much to withdraw",
            required: true,
            type: ApplicationCommandOptionType.Number
        }
    ],

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const amount = interaction.options.get("amount").value;
            const query = {
                userId: interaction.user.id
            }
            let user = await User.findOne(query)

            if (!user) {
                await interaction.followUp({ content:"Why withdraw when you've got nothing?", ephemeral: true });
                return;
            }

            if (!user.bank) {
                await interaction.followUp({ content:"You exist in the database but have no money weird", ephemeral: true });
                return;
            }

            if (amount > user.bank) {
                await interaction.followUp({ content:`**${amount}** is **__${amount - user.bank}__** more than what you have`, ephemeral: true });
                return;
            }

            if (amount < 0) {
                await interaction.followUp({ content:"You can't withdraw numbers smaller than zerp", ephemeral: true });
                return;
            }

            user.bank -= amount
            user.balance += amount

            await user.save()

            interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Successful Withdrawal.")
                    .setDescription(`Successfully withdrew **${amount}**. Your balance is now **${user.balance}**`)
            ]})
        } catch (error) {
            console.log("You're code doesnt work" + "/n" + error)
        }
    }
}