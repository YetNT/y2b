const { EmbedBuilder, ComponentType, ButtonStyle } = require("discord.js");
const User = require("../../../../models/User");
const { all, withoutShield } = require("../../../../utils/misc/items/getItems");
const { comma } = require("../../../../utils/formatters/beatify");
const allBadges = require("../../../../utils/misc/badges/badges.json");
const {
    empty,
    filled,
    firstFill,
    firstEmpty,
    lastFill,
    lastEmpty,
    split,
} = require("../../../../pbEmojis.json");
const { ProgressBar } = require("@yetnt/progressbar");
const { Pager } = require("@fyleto/dpager");

async function inventory(interaction, query, userInfo) {
    let userl = await User.findOne(query);
if (!userl) return interaction.editReply({embeds: [new EmbedBuilder().setTitle(`${userInfo.username}'s Inventory`).setDescription("User does not have an inventory, nor a balance.")]})
    let inventory;
    let badges;
    if (!"badges" in userl) {
        badges = { badges: {} };
    } else {
        badges = userl.badges;
    }
    if (!userl.inventory) {
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${userInfo.username}'s Inventory`)
                    .setDescription("User has no items yet."),
            ],
        });
        return;
    }
    inventory = userl.inventory;
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
                `${all[id].emoji} **${withoutShield[id].name}** - ${comma(
                    inventory[id]
                )}\n_${all[id].rarity}_`
            );
        }
    }

    for (let badge of Object.values(allBadges)) {
        let id = badge.id;
        if (badges.hasOwnProperty(badge.id) == true && badges[badge.id] > 0) {
            badgeOutput.push(`${allBadges[id].emoji}`);
        }
    }

    // checks
    if (typeof invOutput !== "undefined" && invOutput.length === 0) {
        invOutput.push("User is broke as hell");
        invOutput.push(":skull:");
    }

    if (typeof badgeOutput !== "undefined" && badgeOutput.length === 0) {
        badgeOutput.push("Bro has no badges.");
        badgeOutput.push(":skull:");
    }

    let shieldOutput;
    let bar;
    if (inventory.shield.amt > 0 && inventory.shield.hp > 0) {
        bar = new ProgressBar(
            inventory.shield.hp / 5,
            10,
            empty,
            filled,
            [firstEmpty, firstFill],
            [lastEmpty, lastFill]
        );
        bar.charSplit(split);
        shieldOutput =
            `*[Active](https://discord.com "${inventory.shield.amt} Shields")*\n` +
            bar.bar +
            ` **${inventory.shield.hp}/500**`;
    } else {
        shieldOutput = `*[Inactive](https://discord.com "${inventory.shield.amt} Shields")*`;
    }

    const pages = new Pager(`${userInfo.username}'s Inventory`);
    pages.addDynamicPages(invOutput, 5, "\n\n");
    pages.config({
        nextPage: {
            label: "Next Page",
            style: ButtonStyle.Secondary,
        },
        prevPage: {
            label: "Previous Page",
            style: ButtonStyle.Secondary,
        },
    });
    let initPage = await pages.currentPage();

    // send outputs
    await interaction.editReply({
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
                        value: initPage.raw.content,
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
                    text: `Page ${pages.index + 1}/${pages.pages.length}`,
                }),
        ],
        components: initPage.components,
    });

    const res = await interaction.fetchReply();

    const collector = res.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 3_600_000,
    });

    collector.on("collect", async (i) => {
        let page = await pages.currentPage(i.customId);

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
                            value: page.raw.content,
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
                        text: `Page ${pages.index + 1}/${pages.pages.length}`,
                    }),
            ],
            components: page.components,
        });
    });
}

const isCommand = false;
module.exports = { inventory, isCommand };
