const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../../models/User");
const rndInt = require("../../../utils/misc/rndInt");
const { coin } = require("../../../utils/formatters/beatify");
const { getMaxValue } = require("./_lib/robFuncs");
const { shieldStop } = require("./_lib/shieldStop");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../utils/handlers/cooldown");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");
const { EmbedError } = require("../../../utils/handlers/embedError");

const rob = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Rob other people for some quick cash. Can end badly")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("user you'd like to rob")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            let victimId = interaction.options.get("user").value;
            const sf = rndInt(1, 2); // 2 = success; 1 = failure

            let victim = await User.findOne({ userId: victimId });
            let author = await User.findOne({ userId: interaction.user.id });
            const victimDm = await client.users
                .fetch(victimId)
                .catch(() => null); // to dm the user.

            if (!victim)
                return interaction.editReply(
                    new EmbedError(
                        "Leave them alone, they've got nothing :sob:"
                    ).output
                );

            let blacklist = victim.blacklist;

            if (blacklist && blacklist.ed == true)
                return interaction.editReply(
                    new EmbedError("That user is blacklisted.").output
                );

            let inventory = victim.hasOwnProperty("inventory")
                ? victim.inventory
                : null; // victim's inventory

            if (!author)
                return interaction.editReply(
                    new EmbedError(
                        "You cannot rob people when you've got nothing"
                    ).output
                );

            let authorInventory = author.inventory; //author's inventory.

            if (author.balance < 100)
                return interaction.editReply(
                    new EmbedError(
                        "You cannot rob people when your balance is lower than 100. brokey."
                    ).output
                );

            if (victim.balance < 0)
                return interaction.editReply(
                    new EmbedError("This user is paying off their debts").output
                );

            if (victim.balance <= 500)
                return interaction.editReply(
                    new EmbedError(
                        `It aint worth it, they've only got ${coin(
                            victim.balance
                        )}`
                    ).output
                );

            const cooldownResult = await checkCooldown(
                "rob",
                client,
                interaction,
                EmbedBuilder,
                false,
                "Ay bro chillax on the robbin. Cops are still out for you. They'll give up"
            );
            if (cooldownResult === 0) {
                return;
            }

            await newCooldown(Cooldowns.rob, interaction, "rob"); // Anything below this code should have a cooldown.

            let s = await shieldStop(client, interaction, inventory, victim, [
                "You tried to rob them",
                "to rob you",
            ]);

            if (s) {
                return;
            }
            const maxOutput = getMaxValue(victim.balance);
            const max = maxOutput.max; // doing this so mfs dont get their whole ass robbed.
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
                                maxOutput.outputFunction(
                                    victimId,
                                    sRob,
                                    victim.balance
                                )
                            )
                            .setColor("Green")
                            .setFooter({ text: "You monster" }),
                    ],
                });
            } else {
                // failed
                if (!authorInventory || authorInventory.donut == 0) {
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
                        inventory.donut += 1;
                    } else {
                        inventory = {
                            donut: 1,
                        };
                    }

                    authorInventory.donut -= 1;

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
                }
            }

            await User.save(author);
            await User.save(victim);
            // Moved new Cooldown below cooldown check because shields returned. (line 107)
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

rob.category = "economy";
rob.blacklist = true;
rob.canBeServerDisabled = true;
rob.noSelfAt = true;
rob.noBotAt = true;

module.exports = rob;
