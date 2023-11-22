const { EmbedBuilder } = require("discord.js");
const User = require("../../../../models/User");
const items = require("../../../../utils/misc/items/items");
const { comma } = require("../../../../utils/formatters/beatify");

/**
 *
 * @param {Inventory} model the queried inventory model
 * @returns
 */
const calculateInv = (model) => {
    let total =
        model.shield.amt * items.shield.price +
        model.shield.amt * items.shieldhp.price;
    // eslint-disable-next-line
    let { shield, shieldhp, ...newInv } = items;

    for (let item in newInv) {
        if (item.price === -1) continue;
        total += model[item] * items[item].price;
    }

    return total;
};

async function balance(interaction, query, option, cachedUser) {
    let user = await User.findOne(query);
    let inventory;

    let networth = 0;
    let inventoryNetworth = 0;
    let totalNetworth = 0;

    if (user) {
        if (!user.inventory) {
            networth += user.balance + user.bank;
            totalNetworth += networth;
        } else {
            inventory = user.inventory;
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
                                cachedUser.username
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
                        .setTitle(`${interaction.user.username}'s Balance`)
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
            interaction.editReply(`<@${option}> has nothing`);
        } else {
            interaction.editReply(`You do not have anything`);
        }
    }
}
const isCommand = false;
module.exports = { isCommand, balance };
