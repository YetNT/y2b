const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Inventory = require("../../models/Inventory");
const items = require("../../utils/misc/items/items.json");
const { comma } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");

/**
 *
 * @param {Inventory} model the queried inventory model
 * @returns
 */
const calculateInv = (model) => {
    let total =
        model.inv.shield.amt * items.shield.price +
        model.inv.shield.amt * items.shieldhp.price;
    // eslint-disable-next-line
    let { shield, shieldhp, ...newInv } = items;

    for (let item in newInv) {
        if (item.price === -1) continue;
        total += model.inv[item] * items[item].price;
    }

    return total;
};

module.exports = {
    name: "balance",
    description: "View your or another user's coin balance, bank and networth",
    blacklist: true,
    options: [
        {
            name: "userid",
            description:
                "view another user's balance (leave blank to view yours)",
            type: ApplicationCommandOptionType.User,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const option = interaction.options.get("userid")?.value;
            let querySet;

            if (option) {
                // set the user id to the option field
                querySet = option;
            } else {
                // set the user id to the user's id
                querySet = interaction.member.id;
            }

            const query = {
                userId: querySet,
            };

            let user = await User.findOne(query);
            let inventory = await Inventory.findOne(query);

            let networth = 0;
            let inventoryNetworth = 0;
            let totalNetworth = 0;

            if (user) {
                if (!inventory) {
                    networth += user.balance + user.bank;
                    totalNetworth += networth;
                } else {
                    networth += user.balance + user.bank;
                    inventoryNetworth += calculateInv(inventory);
                    totalNetworth += networth + inventoryNetworth;
                }
                // if the user exists in the database =
                if (option !== undefined) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    `${
                                        client.users.cache.get(option).username
                                    }'s Balance`
                                )
                                .setFields(
                                    {
                                        name: "Balance",
                                        value: `${comma(user.balance)}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Bank",
                                        value: `${comma(user.bank)}`,
                                        inline: true,
                                    },
                                    {
                                        // INVIS FIELD
                                        name: "_ _",
                                        value: "_ _",
                                        inline: true,
                                    },
                                    {
                                        name: "Items Networth",
                                        value: `${comma(inventoryNetworth)}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Total Networth",
                                        value: `${comma(totalNetworth)}`,
                                        inline: true,
                                    }
                                )
                                .setColor("DarkGreen"),
                        ],
                    });
                } else {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    `${interaction.user.username}'s Balance`
                                )
                                .setFields(
                                    {
                                        name: "Balance",
                                        value: `${comma(user.balance)}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Bank",
                                        value: `${comma(user.bank)}`,
                                        inline: true,
                                    },
                                    {
                                        // INVIS FIELD
                                        name: "_ _",
                                        value: "_ _",
                                        inline: true,
                                    },
                                    {
                                        name: "Items Networth",
                                        value: `${comma(inventoryNetworth)}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Total Networth",
                                        value: `${comma(totalNetworth)}`,
                                        inline: true,
                                    }
                                )
                                .setColor("Green"),
                        ],
                    });
                }
            } else {
                // if the user does not exist in the database =
                if (option !== null) {
                    interaction.editReply(`${option} has nothing`);
                } else {
                    interaction.editReply(`You do not have anything`);
                }
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
