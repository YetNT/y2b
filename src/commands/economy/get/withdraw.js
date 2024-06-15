const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../../models/User");
const { coin } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");

const withdraw = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw coins from your bank")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("how much to withdraw")
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const amount = interaction.options.get("amount").value;
            const query = {
                userId: interaction.user.id,
            };
            let user = await User.findOne(query);

            if (!user) {
                await interaction.followUp({
                    content: "Why withdraw when you've got nothing?",
                    ephemeral: true,
                });
                return;
            }

            if (!user.bank) {
                await interaction.followUp({
                    content:
                        "You exist in the database but have no money in your banl weird",
                    ephemeral: true,
                });
                return;
            }

            if (amount > user.bank) {
                await interaction.followUp({
                    content: `${coin(amount)} is **__${
                        amount - user.bank
                    }__** more than what you have`,
                    ephemeral: true,
                });
                return;
            }

            if (amount < 0) {
                await interaction.followUp({
                    content: "You can't withdraw numbers smaller than zerp",
                    ephemeral: true,
                });
                return;
            }

            user.bank -= amount;
            user.balance += amount;

            await User.save(user);

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Successful Withdrawal.")
                        .setDescription(
                            `Successfully withdrew ${coin(
                                amount
                            )}. Your balance is now ${coin(user.balance)}`
                        ),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

withdraw.category = "economy";
withdraw.blacklist = true;

module.exports = withdraw;
