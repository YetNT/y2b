const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Inventory = require("../../models/Inventory");
const Items = require("../../utils/misc/items/items");
const { itemNames } = require("../../utils/misc/items/getItems");
const { comma, coin, shopify } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");

module.exports = {
    name: "buy",
    description: "Buy from the shop",
    blacklist: true,
    options: [
        {
            name: "item",
            description: "Which item you buying?",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: itemNames(true),
        },
        {
            name: "amount",
            description: "How much of this item are you buying?",
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const item = interaction.options.get("item").value;
            const amount = interaction.options.get("amount").value;
            const cost = Items[item].price * amount;
            let query = {
                userId: interaction.user.id,
            };

            let user = await User.findOne(query);
            let inventory = await Inventory.findOne(query);

            if (!user) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "You cannot buy items when you've got nothing"
                        ),
                    ],
                });
                return;
            }
            if (amount < 0) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "Don't buy amounts lower than 0"
                        ),
                    ],
                });
                return;
            }
            if (cost > user.balance) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            `You cannot afford ${comma(
                                amount
                            )} ${item}s\nyou need ${coin(
                                cost - user.balance
                            )} more coins`
                        ),
                    ],
                });
                return;
            }

            if (inventory) {
                if (
                    inventory.inv.shield.amt + amount > 20 &&
                    item == "shield"
                ) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder().setDescription(
                                "You can only have 20 shields."
                            ),
                        ],
                    });
                    return;
                }
                if (
                    inventory.inv.shield.hp + amount > 500 &&
                    item == "shieldhp"
                ) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder().setDescription(
                                "You can't buy more than 500 ShieldHP"
                            ),
                        ],
                    });
                    return;
                }
                user.balance -= cost;
                if (item == "shield") {
                    inventory.inv.shield.amt += amount;
                } else if (item == "shieldhp") {
                    inventory.inv.shield.hp += amount;
                } else {
                    inventory.inv[item] += amount;
                }
            } else {
                user.balance -= cost;
                if (item == "shield") {
                    inventory = new Inventory({
                        ...query,
                        inv: {
                            shield: {
                                amt: amount,
                            },
                        },
                    });
                } else if (item == "shieldhp") {
                    inventory = new Inventory({
                        ...query,
                        inv: {
                            shield: {
                                hp: amount,
                            },
                        },
                    });
                } else {
                    inventory = new Inventory({
                        ...query,
                        inv: {
                            [item]: amount,
                        },
                    });
                }
            }

            await user.save();
            await inventory.save();

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("W Purchase")
                        .setDescription(
                            `Succesfully bought \`${amount} ${
                                Items[item].name
                            }\` for ${shopify(cost)}`
                        )
                        .setColor("Green"),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
