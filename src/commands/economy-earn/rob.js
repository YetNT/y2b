const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const rndInt = require("../../utils/misc/rndInt");
const Inventory = require("../../models/Inventory");
const { comma, coin } = require("../../utils/formatters/beatify");
const { newCooldown, checkCooldown } = require("../../utils/handlers/cooldown");
const errorHandler = require("../../utils/handlers/errorHandler");

module.exports = {
    name: "rob",
    description: "Rob other people for some quick cash. Can end badly",
    options: [
        {
            name: "victim",
            description: "robbery",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    blacklist: true,
    canBeServerDisabled: true,

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            let victimId = interaction.options.get("victim").value;
            const sf = rndInt(1, 2); // 2 = success; 1 = failure

            let victim = await User.findOne({ userId: victimId });
            let inventory = await Inventory.findOne({ userId: victimId }); // victim's inventory
            let authorInventory = await Inventory.findOne({
                userId: interaction.user.id,
            }); //author's inventory.
            const victimDm = await client.users
                .fetch(victimId)
                .catch(() => null); // to dm the user.
            let author = await User.findOne({ userId: interaction.user.id });

            if (victimId == interaction.user.id) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "don't rob yourself."
                        ),
                    ],
                });
                return;
            }
            if (!author) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "You cannot rob people when you've got nothing"
                        ),
                    ],
                });
                return;
            }
            if (author.balance < 1000) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "You cannot rob people when your balance is lower than 1000."
                        ),
                    ],
                });
                return;
            }
            if (!victim) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "Leave them alone, they've got nothing :sob:"
                        ),
                    ],
                });
                return;
            }
            if (victim.balance < 0) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "This user is paying off their debts"
                        ),
                    ],
                });
                return;
            }
            if (victim.balance <= 500) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            `It aint worth it, they've only got ${coin(
                                victim.balance
                            )}`
                        ),
                    ],
                });
                return;
            }

            const cooldownResult = await checkCooldown(
                "rob",
                interaction,
                EmbedBuilder,
                false,
                "Ay bro chillax on the robbin. Cops are still out for you. They'll give up"
            );
            if (cooldownResult === 0) {
                return;
            }

            if (inventory) {
                // check if they have an inventory
                if (
                    inventory.inv.shield.amt > 0 &&
                    inventory.inv.shield.hp > 0
                ) {
                    let damage = rndInt(
                        Math.ceil(inventory.inv.shield.hp / 2),
                        inventory.inv.shield.hp
                    );
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder().setDescription(
                                `You tried to rob them but this user had a shield! You damaged their shield by **${comma(
                                    damage
                                )}%**`
                            ),
                        ],
                    });
                    inventory.inv.shield.hp -= damage;

                    await victimDm
                        .send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Your shield has been damaged!")
                                    .setDescription(
                                        `<@${
                                            interaction.user.id
                                        }> tried robbing you but instead damaged your shield by **${comma(
                                            damage
                                        )}%**`
                                    )
                                    .setFooter({
                                        text: `Server = ${interaction.member.guild.name}`,
                                    }),
                            ],
                        })
                        .catch(() => null);
                    await inventory.save();
                    if (inventory.inv.shield.hp == 0) {
                        inventory.inv.shield.amt -= 1;
                        await interaction.followUp(
                            "You broke this user's shield."
                        );
                        await inventory.save();

                        await victimDm
                            .send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(
                                            "Your shield has been broken!"
                                        )
                                        .setDescription(
                                            `<@${interaction.user.id}> managed to break your shield! You know have **${inventory.inv.shield.amt}** shields left.`
                                        )
                                        .setFooter({
                                            text: `Server = ${interaction.member.guild.name}`,
                                        }),
                                ],
                            })
                            .catch(() => null);
                    }
                    return;
                }
            }

            const max = Math.floor(victim.balance / 2); // doing this so mfs dont get their whole ass robbed.
            let sRob = rndInt(1, max); // user can only be robbed random amounts from 1 to half their balance
            let fRob = rndInt(Math.floor(author.balance / 2), author.balance); // if robbery failed deduct random amt between author/2 and author

            if (sf === 2) {
                // Succesful
                victim.balance -= sRob;
                author.balance += sRob;

                await victimDm
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("You have been robbed from!")
                                .setDescription(
                                    `<@${interaction.user.id}> stole ${coin(
                                        sRob
                                    )} from you!`
                                )
                                .setFooter({
                                    text: `Server = ${interaction.member.guild.name}`,
                                }),
                        ],
                    })
                    .catch(() => null);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Robbery :money_with_wings:")
                            .setDescription(
                                `You stole a grand total of ${coin(
                                    sRob
                                )} from <@${victimId}>. Leaving them with ${coin(
                                    victim.balance
                                )}`
                            )
                            .setColor("Green")
                            .setFooter({ text: "You monster" }),
                    ],
                });
            } else {
                // failed
                if (!authorInventory || authorInventory.inv.donut == 0) {
                    // Normal fail
                    author.balance -= fRob;
                    victim.balance += fRob;

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Robbery")
                                .setDescription(
                                    `You tried robbing <@${victimId}> but they caught you before you could get away. You paid ${coin(
                                        fRob
                                    )} in fines to <@${victimId}>`
                                )
                                .setColor("Red")
                                .setFooter({
                                    text: "I knew this wouldnt work.",
                                }),
                        ],
                    });
                } else {
                    // If user has a donut, do not subtract amount and instead give donut to victim.
                    if (inventory) {
                        inventory.inv.donut += 1;
                        authorInventory.inv.donut -= 1;
                    } else {
                        inventory = new Inventory({
                            userId: victimId,
                            inv: {
                                donut: 1,
                            },
                        });
                        authorInventory.inv.donut -= 1;
                    }

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Robbery")
                                .setDescription(
                                    `You tried robbing <@${victimId}> but they caught you before you could get away. **You had a donut in your inventory which was given to the victim.**`
                                )
                                .setColor("Orange")
                                .setFooter({
                                    text: "I knew this wouldnt work.",
                                }),
                        ],
                    });
                    await inventory.save();
                    await authorInventory.save();
                }
            }

            await author.save();
            await victim.save();

            await newCooldown("10min", interaction, "rob");
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
