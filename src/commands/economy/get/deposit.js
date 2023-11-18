const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const User = require("../../../models/User");
const { coin } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");

const dep = new SlashCommandObject({
    name: "deposit",
    description: "Deposit coins into your bank",
    options: [
        {
            name: "amount",
            description: "how much to deposit",
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    blacklist: true,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const amount = interaction.options.get("amount").value;
            const query = {
                userId: interaction.user.id,
            };
            let user = await User.findOne(query);

            if (!user) {
                await interaction.followUp({
                    content: "Why deposit when you've got nothing?",
                    ephemeral: true,
                });
                return;
            }

            if (!user.balance) {
                await interaction.followUp({
                    content:
                        "You exist in the database but have no money weird",
                    ephemeral: true,
                });
                return;
            }

            if (amount > user.balance) {
                await interaction.followUp({
                    content: `${coin(amount)} is **__${
                        amount - user.balance
                    }__** more than what you have`,
                    ephemeral: true,
                });
                return;
            }

            if (amount < 0) {
                await interaction.followUp({
                    content: "You can't deposit numbers smaller than zerp",
                    ephemeral: true,
                });
                return;
            }

            user.balance -= amount;
            user.bank += amount;

            await user.save();

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Successful Deposit.")
                        .setDescription(
                            `Successfully deposited ${coin(
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
dep.category = "economy";
dep.blacklist = "economy";

module.exports = dep;
