const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Inventory = require("../../models/Inventory");
const Items = require("../../utils/misc/items/items");
const { itemNames } = require("../../utils/misc/items/getItems");
const { comma, shopify } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");

class EmbedError {
    constructor(text) {
        this.output = {
            embeds: [new EmbedBuilder().setDescription(text)],
        };
    }
}

module.exports = {
    name: "sell",
    description: "Sell an item for some coins",
    blacklist: true,
    options: [
        {
            name: "item",
            description: "Which item you buying?",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: itemNames(2),
        },
        {
            name: "amount",
            description: "How much of this item are you selling?",
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const item = interaction.options.get("item").value;
            const amount = interaction.options.get("amount").value;
            const cost = Items[item].sell * amount;
            let emoji = Items[item].emoji != undefined ? Items[item].emoji : "";
            let query = {
                userId: interaction.user.id,
            };

            let user = await User.findOne(query);
            let inventory = await Inventory.findOne(query);

            if (!inventory)
                return await interaction.editReply(
                    new EmbedError(
                        "What you selling when you have no inventory? :skull:"
                    ).output
                );
            if (amount < 0)
                return interaction.editReply(
                    new EmbedError("Don't sell amounts lower than 0").output
                );
            if (inventory.inv[item] < amount)
                return await interaction.editReply(
                    new EmbedError(
                        `You do not have that many ${Items[item].emoji} ${Items[item].name}s!`
                    ).output
                );

            if (user) {
                user.balance += cost;
            } else {
                user = new User({
                    ...query,
                    balance: cost,
                });
            }

            inventory.inv[item] -= amount;

            await user.save();
            await inventory.save();

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("W Sell")
                        .setDescription(
                            `Succesfully sold \`${comma(amount)}\` ${emoji} ${
                                Items[item].name
                            } for ${shopify(cost)}`
                        )
                        .setColor("Green"),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
