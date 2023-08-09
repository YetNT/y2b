const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Inventory = require("../../models/Inventory");
const Items = require("../../utils/misc/items/items");
const { itemNames } = require("../../utils/misc/items/getItems");
const { comma, coin, shopify } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");

class EmbedError {
    constructor(text) {
        this.output = {
            embeds: [new EmbedBuilder().setDescription(text)],
        };
    }
}

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
            let emoji = Items[item].emoji != undefined ? Items[item].emoji : "";
            let query = {
                userId: interaction.user.id,
            };

            let user = await User.findOne(query);
            let inventory = await Inventory.findOne(query);

            if (!user)
                return interaction.editReply(
                    new EmbedError(
                        "You cannot buy items when you've got nothing"
                    ).output
                );
            if (amount < 0)
                return interaction.editReply(
                    new EmbedError("Don't buy amounts lower than 0").output
                );
            if (cost > user.balance)
                return interaction.editReply(
                    new EmbedError(
                        `You cannot afford ${comma(amount)} ${emoji} ${
                            Items[item].name
                        }s\nyou need ${coin(cost - user.balance)} more coins`
                    ).output
                );

            if (inventory) {
                if (inventory.inv.shield.amt + amount > 20 && item == "shield")
                    return interaction.editReply(
                        new EmbedError("You can only have 20 shields.").output
                    );
                if (
                    inventory.inv.shield.hp + amount > 500 &&
                    item == "shieldhp"
                )
                    return interaction.editReply(
                        new EmbedError("You can't buy more than 500 ShieldHP")
                            .output
                    );
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
                            `Succesfully bought \`${amount}\` ${emoji} ${
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
