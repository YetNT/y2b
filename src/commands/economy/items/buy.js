const {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const User = require("../../../models/User");
const Items = require("../../../utils/misc/items/items");
const { itemNames } = require("../../../utils/misc/items/getItems");
const { comma, coin, shopify } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject, CommandInteractionObject } = require("ic4d");
const { EmbedError } = require("../../../utils/handlers/embedError");

async function buyItem(inventory, user, item, obj, interaction) {
    const amount = obj.amount;
    const cost = obj.cost;
    const emoji = obj.emoji;
    if (inventory) {
        if (inventory.shield.amt + amount > 20 && item == "shield")
            return interaction.update(
                new EmbedError("You can only have 20 shields.").output
            );
        if (inventory.shield.hp + amount > 500 && item == "shieldhp")
            return interaction.update(
                new EmbedError(
                    `You can't have more than 500 ShieldHP (You have \`${inventory.shield.hp}\` and you're trying to get \`${amount}\` more)`
                ).output
            );
        user.balance -= cost;
        if (item == "shield") {
            inventory.shield.amt += amount;
        } else if (item == "shieldhp") {
            inventory.shield.hp += amount;
        } else {
            inventory[item] += amount;
        }
    } else {
        user.balance -= cost;
        if (item == "shield") {
            inventory = {
                shield: {
                    amt: amount,
                },
            };
        } else if (item == "shieldhp") {
            inventory = {
                shield: {
                    hp: amount,
                },
            };
        } else {
            inventory = {
                [item]: amount,
            };
        }
    }

    await User.save(user);

    interaction.update({
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
        components: [],
    });
}

const buy = new SlashCommandObject(
    {
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
                let emoji =
                    Items[item].emoji != undefined ? Items[item].emoji : "";
                let query = {
                    userId: interaction.user.id,
                };

                let user = await User.findOne(query);
                let inventory = user.inventory;

                if (!user)
                    return interaction.editReply(
                        new EmbedError(
                            "You cannot buy items when you've got nothing"
                        ).output
                    );
                if (amount < 0)
                    return interaction.editReply(
                        new EmbedError(
                            "Tf is u tryna buy a negative item :skull:"
                        ).output
                    );
                if (cost > user.balance)
                    return interaction.editReply(
                        new EmbedError(
                            `You cannot afford ${comma(amount)} ${emoji} ${
                                Items[item].name
                            }s\nyou need ${coin(
                                cost - user.balance
                            )} more coins`
                        ).output
                    );

                buy.user = user;
                buy.inventory = inventory;
                buy.item = item;
                buy.obj = {
                    amount: amount,
                    cost: cost,
                    emoji: emoji,
                };

                const confirm = new ButtonBuilder()
                    .setCustomId("acceptBuy")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success);
                const cancel = new ButtonBuilder()
                    .setCustomId("cancelBuy")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Confirmation")
                            .setDescription(
                                `Are you sure you'd like to buy \`${amount}\` ${emoji} ${
                                    Items[item].name
                                } for ${shopify(cost)}`
                            ),
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(confirm, cancel),
                    ],
                });
            } catch (error) {
                errorHandler(error, client, interaction, EmbedBuilder);
            }
        },
    },
    new CommandInteractionObject({
        customId: "acceptBuy",
        type: "button",
        onlyAuthor: true,
        callback: async (interaction) => {
            await buyItem(
                buy.inventory,
                buy.user,
                buy.item,
                buy.obj,
                interaction
            );
        },
        timeout: 20_000,
        onTimeout: (i) => {
            i.update({
                embeds: [
                    new EmbedBuilder().setDescription(
                        "Answer not given in 20 seconds. Cancelled operation."
                    ),
                ],
                components: [],
            });
        },
    }),
    new CommandInteractionObject({
        customId: "cancelBuy",
        type: "button",
        onlyAuthor: true,
        callback: async (i) => {
            i.update({
                embeds: [new EmbedBuilder().setDescription("Cancelled.")],
                components: [],
            });
        },
    })
);

buy.category = "economy";
buy.blacklist = true;

module.exports = buy;
