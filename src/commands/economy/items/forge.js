const {
    ComponentType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const User = require("../../../models/User");
const Items = require("../../../utils/misc/items/items");
const {
    getForgableItemNames,
    getRecipeItems,
} = require("../../../utils/misc/items/getItems");
// const { comma, coin, shopify } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject, CommandInteractionObject } = require("ic4d");
const { Pager } = require("@fyleto/dpager");
const { emojiToUnicode } = require("../../../utils/misc/emojiManipulation");
const { EmbedError } = require("../../../utils/handlers/embedError");

const separator = {
    title: "$(TITLE)$",
    item: "$(ITEM)$",
};

function joinArrayPairs(arr) {
    const result = [];

    for (let i = 0; i < arr.length; i += 2) {
        if (i + 1 < arr.length) {
            result.push(arr[i] + separator.item + arr[i + 1]);
        } else {
            result.push(arr[i]);
        }
    }

    return result;
}

function newFields(field1, field2) {
    let arr = [];
    const [field1Title, field1Recipe] = field1.split(separator.title);
    arr.push({
        name: field1Title,
        value: field1Recipe,
        inline: true,
    });
    if (field2 !== undefined) {
        /* Field 2 */ const [field2Title, field2Recipe] = field2.split(
            separator.title
        );
        arr.push({
            name: field2Title,
            value: field2Recipe,
            inline: true,
        });
    }

    return arr;
}

let f = getForgableItemNames();

const makeInteractions = () => {
    let arr = [];
    for (const item of f) {
        const int = new CommandInteractionObject({
            type: "button",
            authorOnly: true,
            customId: `forge-${item.item.name}`,
            callback: async (interaction) => {
                await interaction.update({
                    content: "Trying to purchase....",
                    embeds: [],
                    components: [],
                });

                const keys = Object.keys(item.recipe);

                const user = await User.findOne({
                    userId: interaction.user.id,
                });
                let errors = [];
                if (!user)
                    return interaction.followUp(
                        new EmbedError(
                            "You cannot forge items when you've got nothing."
                        ).output
                    );

                for (const key of keys) {
                    if (key === "_amt") continue;
                    if (!user.inventory[key]) {
                        errors.push(
                            `You do not have even \`1\` ${Items[key].name}!`
                        );
                    }
                    if (user.inventory[key] < item.recipe[key]) {
                        errors.push(
                            `You do not have enough ${Items[key].emoji} **${
                                Items[key].name
                            }** (You need ${
                                item.recipe[key] - user.inventory[key]
                            } more)`
                        );
                    }
                }

                if (errors.length != 0)
                    return await interaction.followUp(
                        new EmbedError(errors.join("\n")).output
                    );

                for (const key of keys) {
                    let amt = item.recipe[key];
                    user.inventory[key] -= amt;
                }

                user.inventory[item.item.id] += item.recipe._amt;

                await User.save(user);

                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `Succesfully forged ${item.recipe._amt} ${item.item.emoji} ${item.item.name}`
                            )
                            .setTitle("Succesful Forge!")
                            .setColor("Green"),
                    ],
                    components: [],
                    content: "_ _",
                });
            },
        });
        let emoji = emojiToUnicode(item.item.emoji);
        int.button = new ButtonBuilder()
            .setLabel(`Forge ${item.item.name}`)
            .setCustomId(`forge-${item.item.name}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji);
        arr.push(int);
    }
    return arr;
};

const buttons = makeInteractions();

const forge = new SlashCommandObject(
    {
        name: "forge",
        description: "Forge a new item from other items!",
        callback: async (c, interaction) => {
            await interaction.deferReply();
            try {
                const user = await User.findOne({
                    userId: interaction.user.id,
                });
                if (!user)
                    return interaction.editReply(
                        new EmbedError(
                            "You cannot forge items when you've got nothing."
                        ).output
                    );
                let pageArray = [];
                for (let i in f) {
                    let recipe = f[i].recipe;
                    let item = f[i].item;
                    let recipeStr = getRecipeItems(recipe, user);
                    let forgeStr = `Forges \`${recipe._amt}\` ${item.emoji} ${item.name}`;

                    pageArray.push(
                        `${item.name}${separator.title}${forgeStr}\n\n**Recipe:**${recipeStr}`
                    );
                }
                pageArray = joinArrayPairs(pageArray);
                const pager = new Pager();
                pager.addDynamicPages(pageArray, 2);
                let page = await pager.currentPage();
                const [field1, field2] = page.raw.content.split(separator.item);
                let fieldsArray = newFields(field1, field2);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Forge!")
                            .setFields(...fieldsArray),
                    ],
                    components: [
                        ...page.components,
                        new ActionRowBuilder().addComponents(
                            ...(buttons[1] !== undefined
                                ? [buttons[0].button, buttons[1].button]
                                : [buttons[0].button])
                        ),
                    ],
                });

                const res = await interaction.fetchReply();

                const collector = res.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 3_600_600,
                });

                collector.on("collect", async (interaction) => {
                    if (
                        ![
                            "prevMaxPage",
                            "prevPage",
                            "nextPage",
                            "nextMaxpage",
                        ].includes(interaction.customId)
                    )
                        return; // only listen for page changes and not custom buttons
                    let page = await pager.currentPage(interaction.customId);
                    const [field1, field2] = page.raw.content.split(
                        separator.item
                    );
                    let fieldsArray = newFields(field1, field2);

                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Forge!")
                                .setFields(...fieldsArray),
                        ],
                        components: [
                            ...page.components,
                            new ActionRowBuilder().addComponents(
                                ...(buttons[pager.index * 2 + 1] !== undefined
                                    ? [
                                          buttons[pager.index * 2].button,
                                          buttons[pager.index * 2 + 1].button,
                                      ]
                                    : [buttons[pager.index * 2].button])
                            ),
                        ],
                    });
                });
            } catch (error) {
                errorHandler(error, c, interaction, EmbedBuilder);
            }
        },
    },
    ...buttons
);
forge.category = "economy";
forge.blacklist = true;

module.exports = forge;
