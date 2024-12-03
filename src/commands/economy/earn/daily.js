const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../../models/User");
const { comma, coin } = require("../../../utils/formatters/beatify");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../utils/handlers/cooldown");
const errorHandler = require("../../../utils/handlers/errorHandler");
const battery = require("../items/use/battery");

const dailyAmount = 1000;
const { SlashCommandManager } = require("ic4d");

const daily = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Receive your daily reward of 100"),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();
            const cooldownResult = await checkCooldown(
                "daily",
                client,
                interaction,
                EmbedBuilder
            );
            if (cooldownResult === 0) {
                return;
            }

            const query = {
                userId: interaction.user.id,
            };

            let user = await User.findOne(query);
            let bInfo = battery.info.calc(dailyAmount);

            if (user) {
                user.balance += !battery.info.isActive(user)
                    ? dailyAmount
                    : dailyAmount + bInfo.num;
            } else {
                user = User.newDoc({
                    userId: query.userId,
                    balance: dailyAmount,
                });
            }

            await User.save(user);

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Daily Reward")
                        .setDescription(
                            `${comma(
                                dailyAmount
                            )} was added to your balance. Your new balance is ${coin(
                                user.balance
                            )}}${battery.info.isActive(user) ? bInfo.info : ""}`
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
