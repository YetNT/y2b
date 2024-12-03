const {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");
const User = require("../../../../models/User");
const strToMilli = require("../../../../utils/formatters/strToMilli");
const items = require("../../../../utils/misc/items/items");
const { coinEmoji, coin } = require("../../../../utils/formatters/beatify");

module.exports = {
    isCommand: false,
    /**
     * Function called when battery is used
     * (Enables the effect)
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async battery(client, interaction) {
        const user = await User.findOne({ userId: interaction.user.id });
        const date = new Date(Date.now() + strToMilli("2.5h"));

        if (
            !user ||
            !user.inventory ||
            !user.inventory.battery ||
            user.inventory.battery === 0
        )
            return await interaction.editReply({
                ephemeral: true,
                content: "You lowkey don't have a single battery",
            });

        if (user.effects.find((v) => v.name === "battery")) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "You already have the battery effect active!"
                        )
                        .setColor("Gold"),
                ],
            });
        } else {
            user.effects.push({ name: "battery", endTime: date });
            user.inventory.battery -= 1;

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            `${items.battery.emoji} ${items.battery.name}`
                        )
                        .setDescription(
                            `You have used an **_${items.battery.name}_**, granting you a **+5% increase** in ${coinEmoji} earned from commands.\n` +
                                `This effect will run out ${time(
                                    date,
                                    TimestampStyles.RelativeTime
                                )}`
                        )
                        .setColor("Gold"),
                ],
                ephemeral: true,
            });
            await User.save(user);
        }
    },
    info: {
        /**
         * Is battery effect enabled?
         * @param {import("../../../../models/User").user} user
         */
        isActive(user) {
            return !!(
                user.effects && user.effects.find((v) => v.name === "battery")
            );
        },
        /**
         * Calculates the added bonus of the battery (without original) AND returns info string.
         * @param {number} number
         */
        calc(number) {
            const num = Math.round(number * 0.05);
            return {
                num,
                info: ` __(_**+**${coin(num)} ${items.battery.emoji}_)__`,
            };
        },
    },
};
