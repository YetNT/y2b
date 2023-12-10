const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const promocodes = require("../../../../promocodes.json");
const { comma, coin } = require("../../../utils/formatters/beatify");
const User = require("../../../models/User");
const items = require("../../../utils/misc/items/items");
const { awardBadge } = require("../../../utils/misc/badges/badges.js");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");
/*
    If you clone the git and use this command, json looks something like this
    {
        "promocodeName" : "pRom0c4de-Valyou"
    }

    make sure the promocodes.json file is in the main direcotory above src
*/

/**
 *
 * @param {Number} amount Amount of item/money
 * @param {String} Userid User Id
 * @param {Boolean} item Is it an item? Default is false
 * @param {String} itemId item's Id Default is null
 * @returns nothing
 */
const add = async (user, amount, UserId, item = false, itemId = null) => {
    if (item != true) {
        if (user) {
            user.balance += amount;
        } else {
            user = User.newDoc({
                userId: UserId,
                balance: amount,
            });
        }
    } else {
        let inventory = user.inventory;

        if (inventory) {
            inventory[itemId] += amount;
        } else {
            inventory = {
                [itemId]: amount,
            };
        }
    }
};

const promocode = new SlashCommandObject({
    name: "promocode",
    description: "Redeem promocodes hidden around anywhere for coins and items",
    blacklist: true,
    options: [
        {
            name: "code",
            description: "Enter the promocode you'd like to redeem.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        try {
            const code = interaction.options.get("code").value;
            let user = await User.findOne({ userId: interaction.user.id });
            let promocodedb = user.promocode;

            if (!Object.values(promocodes).includes(code)) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Invalid Promocode")
                            .setDescription("Lmao rip")
                            .setColor("Red"),
                    ],
                    ephemeral: true,
                });
                return;
            }

            let promocodeName = null;
            for (const prop in promocodes) {
                if (promocodes[prop] === code) {
                    promocodeName = prop;
                    break;
                }
            }

            if (promocodedb) {
                if (promocodedb[promocodeName] == true) {
                    interaction.editReply({
                        content: "you claimed this.",
                        ephemeral: true,
                    });
                    return;
                }
            }

            let embed = new EmbedBuilder()
                .setTitle("Real promocode")
                .setColor("Green");
            if (code === promocodes.beta) {
                await add(user, 900, interaction.user.id);
                interaction.editReply({
                    embeds: [
                        embed.setDescription(
                            `**Thanks for using the beta bot!**\n**+**${coin(
                                900
                            )}`
                        ),
                    ],
                    ephemeral: true,
                });
                if (!promocodedb) {
                    promocodedb = {
                        userId: interaction.user.id,
                        beta: true,
                    };
                } else {
                    promocodedb.beta = true;
                }

                await awardBadge(
                    interaction,
                    EmbedBuilder,
                    interaction.user.id,
                    "betaTester",
                    true
                );
            } else if (code === promocodes.bruh) {
                await add(user, 10, interaction.user.id, true, "donut");
                interaction.editReply({
                    embeds: [
                        embed.setDescription(
                            `**How the hell did you find this?**\n**+${comma(
                                10
                            )}** ${items.donut.emoji}`
                        ),
                    ],
                    ephemeral: true,
                });
                if (!promocodedb) {
                    promocodedb = {
                        userId: interaction.user.id,
                        bruh: true,
                    };
                } else {
                    promocodedb.bruh = true;
                }
            } else if (code === promocodes.newMember) {
                await add(user, 1000, interaction.user.id);
                interaction.editReply({
                    embeds: [
                        embed.setDescription(
                            `**Welcome, new user.**\n**+**${coin(1000)}`
                        ),
                    ],
                    ephemeral: true,
                });
                if (!promocodedb) {
                    promocodedb = {
                        userId: interaction.user.id,
                        newMember: true,
                    };
                } else {
                    promocodedb.newMember = true;
                }
            } else if (code === promocodes.promocodeName) {
                await add(user, 1, interaction.user.id, true, "gem");
                interaction.editReply({
                    embeds: [
                        embed.setDescription(
                            `**Not surprised you found this one.**\n**+1${comma(
                                1
                            )}** ${items.gem.emoji}`
                        ),
                    ],
                    ephemeral: true,
                });
                if (!promocodedb) {
                    promocodedb = {
                        userId: interaction.user.id,
                        promocodeName: true,
                    };
                } else {
                    promocodedb.promocodeName = true;
                }
            } else if (code === promocodes.website) {
                await add(user, 2000, interaction.user.id);
                await add(user, 2, interaction.user.id, true, "gem");
                interaction.editReply({
                    embeds: [
                        embed.setDescription(
                            `**Thanks for visiting my website :)**\n**+${comma(
                                2
                            )}** ${items.gem.emoji}\n+**${coin(2000)}`
                        ),
                    ],
                    ephemeral: true,
                });
                if (!promocodedb) {
                    promocodedb = {
                        userId: interaction.user.id,
                        website: true,
                    };
                } else {
                    promocodedb.website = true;
                }
            }
            await User.save(user);
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});
promocode.category = "economy";
promocode.blacklist = true;

module.exports = promocode;
