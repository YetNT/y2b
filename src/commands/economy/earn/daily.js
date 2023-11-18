const { EmbedBuilder } = require("discord.js");
const User = require("../../../models/User");
const { comma, coin } = require("../../../utils/formatters/beatify");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../utils/handlers/cooldown");
const errorHandler = require("../../../utils/handlers/errorHandler");

const dailyAmount = 1000;
const { SlashCommandObject } = require("ic4d");
const daily = new SlashCommandObject({
    name: "daily",
    description: "Receive your daily reward of 1000",

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const cooldownResult = await checkCooldown(
                "daily",
                interaction,
                EmbedBuilder
            );
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
                    balance: dailyAmount,
                });
            }

            await user.save();

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Daily Reward")
                        .setDescription(
                            `${comma(
                                dailyAmount
                            )} was added to your balance. Your new balance is ${coin(
                                user.balance
                            )}`
                        )
                        .setColor("Yellow"),
                ],
            });

            await newCooldown(Cooldowns.daily, interaction, "daily");
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});
daily.category = "economy";
daily.blacklist = true;

module.exports = daily;
