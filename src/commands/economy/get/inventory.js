const {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const User = require("../../../models/User");
const { all, withoutShield } = require("../../../utils/misc/items/getItems");
const { comma } = require("../../../utils/formatters/beatify");
const allBadges = require("../../../utils/misc/badges/badges.json");
const { progressBar } = require("@yetnt/progressbar");
const errorHandler = require("../../../utils/handlers/errorHandler");

const { pageCreator, pagerButtons } = require("../../../utils/handlers/pages");
let nextPage = new ButtonBuilder()
    .setCustomId("nextPage")
    .setLabel("Next Page")
    .setStyle(ButtonStyle.Secondary);
let previousPage = new ButtonBuilder()
    .setCustomId("prevPage")
    .setLabel("Previous Page")
    .setStyle(ButtonStyle.Secondary);

module.exports = {
    name: "inventory",
    description: "View your or another user's inventory",
    blacklist: true,
    options: [
        {
            name: "user",
            description: "Select which user's inventory you'd like to see",
            type: ApplicationCommandOptionType.User,
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            let query;
            let user = interaction.options.get("user")?.value;
            let userInfo;
            if (user) {
                query = {
                    userId: user,
                };
                userInfo = await client.users.cache.get(user);
            } else {
                query = {
                    userId: interaction.user.id,
                };
                userInfo = await client.users.cache.get(interaction.user.id);
            }
            let userl = await User.findOne(query);

            let inventory = userl.inventory;
            let badges = userl.badges;
            if (!badges) {
                badges = { badges: {} };
            }
            if (!inventory) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${userInfo.username}'s Inventory`)
                            .setDescription("User has no items yet."),
                    ],
                });
                return;
            }
            let invOutput = [];
            let badgeOutput = [];

            // set outputs
            for (let item of Object.values(withoutShield)) {
                let id = item.id;
                if (
                    inventory.hasOwnProperty(item.id) == true &&
                    inventory[item.id] > 0
                ) {
                    invOutput.push(
                        `${all[id].emoji} **${
                            withoutShield[id].name
                        }** - ${comma(inventory[id])}\n_${all[id].rarity}_`
                    );
                }
            }

            for (let badge of Object.values(allBadges)) {
                let id = badge.id;
                if (
                    badges.hasOwnProperty(badge.id) == true &&
                    badges[badge.id] > 0
                ) {
                    badgeOutput.push(`${allBadges[id].emoji}`);
                }
            }

            // checks
            if (typeof invOutput !== "undefined" && invOutput.length === 0) {
                invOutput.push("User is broke as hell");
                invOutput.push(":skull:");
            }

            if (
                typeof badgeOutput !== "undefined" &&
                badgeOutput.length === 0
            ) {
                badgeOutput.push("Bro has no badges.");
                badgeOutput.push(":skull:");
            }

            let shieldOutput;
            let bar;
            if (inventory.shield.amt > 0 && inventory.shield.hp > 0) {
                bar = progressBar(
                    inventory.shield.hp / 5,
                    10,
                    "<:progressempty:1113377221067931699>",
                    "<:progressfull:1113377216743624705>",
                    false,
                    [
                        "<:firstempty:1113377223567736832>",
                        "<:firstfull:1113377227069997137>",
                    ],
                    [
                        "<:lastempty:1113377233248198687>",
                        "<:lastfull:1113377230693879821>",
                    ]
                );
                shieldOutput =
                    `*[Active](https://discord.com "${inventory.shield.amt} Shields")*\n` +
                    bar +
                    ` **${inventory.shield.hp}/500**`;
            } else {
                shieldOutput = `*[Inactive](https://discord.com "${inventory.shield.amt} Shields")*`;
            }

            let pageItems = pageCreator(invOutput, 5);

            let initRow =
                pageItems.length != 1
                    ? [pagerButtons(nextPage, previousPage, "previous")]
                    : [];

            var pageIndex = 1;

            // send outputs
            let response = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${userInfo.username}'s Inventory`)
                        .setFields([
                            {
                                name: "Shield",
                                value: shieldOutput,
                                inline: false,
                            },
                            {
                                name: "Badges",
                                value: badgeOutput.join(" "),
                                inline: false,
                            },
                            {
                                name: "Items",
                                value: pageItems[pageIndex - 1].join("\n\n"),
                                inline: true,
                            },
                        ])
                        .setColor("Blue")
                        .setThumbnail(
                            "https://cdn.discordapp.com/avatars/" +
                                userInfo.id +
                                "/" +
                                userInfo.avatar +
                                ".jpeg"
                        )
                        .setFooter({
                            text: `Page ${pageIndex}/${pageItems.length}`,
                        }),
                ],
                components: initRow,
            });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 3_600_000,
            });

            collector.on("collect", async (i) => {
                let id = i.customId;
                let pagerRow;

                if (id == "prevPage") {
                    pageIndex--;
                    if (pageIndex != 1) {
                        pagerRow = pagerButtons(nextPage, previousPage, null);
                    } else {
                        pagerRow = pagerButtons(
                            nextPage,
                            previousPage,
                            "previous"
                        );
                    }
                }
                if (id == "nextPage") {
                    pageIndex++;
                    if (pageIndex != pageItems.length) {
                        pagerRow = pagerButtons(nextPage, previousPage, null);
                    } else {
                        pagerRow = pagerButtons(nextPage, previousPage, "next");
                    }
                }
                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${userInfo.username}'s Inventory`)
                            .setFields([
                                {
                                    name: "Shield",
                                    value: shieldOutput,
                                    inline: false,
                                },
                                {
                                    name: "Badges",
                                    value: badgeOutput.join(" "),
                                    inline: false,
                                },
                                {
                                    name: "Items",
                                    value: pageItems[pageIndex - 1].join(
                                        "\n\n"
                                    ),
                                    inline: true,
                                },
                            ])
                            .setColor("Blue")
                            .setThumbnail(
                                "https://cdn.discordapp.com/avatars/" +
                                    userInfo.id +
                                    "/" +
                                    userInfo.avatar +
                                    ".jpeg"
                            )
                            .setFooter({
                                text: `Page ${pageIndex}/${pageItems.length}`,
                            }),
                    ],
                    components: [pagerRow],
                });
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
