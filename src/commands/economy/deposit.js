const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const User = require('../../models/User')

module.exports = {
    name:"deposit",
    description:"deposit fr",
    options: [
        {
            name:"amount",
            description:"how much to deposit",
            required: true,
            type: ApplicationCommandOptionType.Number
        }
    ],
    blacklist: true,

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
                await interaction.followUp({ content:"Why deposit when you've got nothing?", ephemeral: true });
                return;
            }

            if (!user.balance) {
                await interaction.followUp({ content:"You exist in the database but have no money weird", ephemeral: true });
                return;
            }

            if (amount > user.balance) {
                await interaction.followUp({ content:`**${amount}** is **__${amount - user.balance}__** more than what you have`, ephemeral: true });
                return;
            }

            if (amount < 0) {
                await interaction.followUp({ content:"You can't deposit numbers smaller than zerp", ephemeral: true });
                return;
            }

            user.balance -= amount
            user.bank += amount

            await user.save()

            interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Successful Deposit.")
                    .setDescription(`Successfully deposited **${amount}**. Your balance is now **${user.balance}**`)
            ]})
        } catch (error) {
            console.log("You're code doesnt work" + "/n" + error)
        }
    }
}