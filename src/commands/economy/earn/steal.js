const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    Embed,
} = require("discord.js");
const { emojiToImage } = require("../../../utils/misc/emojiManipulation");
const User = require("../../../models/User");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");
const { all } = require("../../../utils/misc/items/getItems");
const { EmbedError } = require("../../../utils/handlers/embedError");
const { shieldStop } = require("./_lib/shieldStop");
const { pythStop, pythStopFailMessage } = require("./_lib/pythStop");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../utils/handlers/cooldown");
const { getRandomItem } = require("./_lib/stealFuncs");
const { comma } = require("../../../utils/formatters/beatify");

const steal = new SlashCommandObject({
    name: "steal",
    description: "Steal from user's inventory!",
    // devOnly: true,
    // testOnly: true,

    options: [
        {
            name: "user",
            description: "User to steal from.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    // blacklist: true,
    callback: async function (client, interaction) {
        await interaction.deferReply();
        const origInt = interaction;
        if (interaction.user.bot) {
            return interaction.editReply(
                new EmbedError("You can't rob bots tf").output
            );
        }

        const cooldownResult = await checkCooldown(
            "steal",
            client,
            interaction,
            EmbedBuilder,
            false,
            "Ay dawg u've stolen good loot. Wait a while."
        );
        if (cooldownResult === 0) {
            return;
        }

        await newCooldown(Cooldowns.steal, interaction, "steal");

        try {
            let user = await User.findOne({ userId: interaction.user.id });
            let victim = await User.findOne({
                userId: interaction.options.get("user").value,
            });
            const victimDm = await client.users
                .fetch(interaction.options.get("user").value)
                .catch(() => null); // to dm the user.

            if (!victim) {
                return interaction.editReply(
                    new EmbedError(
                        "Unfortunately for you they have absolutely nothing for you to steal."
                    ).output
                );
            }
            let blacklist = victim.blacklist;

            if (blacklist && blacklist.ed == true)
                return interaction.editReply(
                    new EmbedError("That user is blacklisted.").output
                );

            let inventory = victim.inventory ?? {}; // victim's inventory

            if (!user || !user.hasOwnProperty("inventory"))
                return interaction.editReply(
                    new EmbedError(
                        "You cannot steal from other people when you've got nothing. That's just unfair :skull:"
                    ).output
                );

            let authorInventory = user.inventory;

            // try shield stop
            let s = await shieldStop(client, interaction, inventory, victim, [
                "You tried to steal from them",
                "to steal from you",
            ]);

            if (s) {
                return;
            }

            // try pyth stop
            let pythResult = await pythStop(
                client,
                interaction,
                inventory,
                victim,
                authorInventory
            );
            switch (pythResult[0]) {
                case true:
                    if (pythResult[1]) {
                        // Pyth stopped, user failed the equation.
                        return await pythStopFailMessage(interaction);
                    }
                    break;
                case false:
                    if (pythResult[1]) {
                        // Pyth tried to stop, but user succeeded.
                        interaction = pythResult[1];
                        break;
                    } else if (!pythResult[1] && pythResult[2] == false) {
                        // They didn't have a pyth in their inventoy, so just continue.
                        break;
                    } else {
                        // No interaction response (timeout). We will jusr resot to them auto loosing
                        return await pythStopFailMessage(interaction);
                    }
            }
            /**
             * @type string
             */
            let randomItemId = getRandomItem(inventory);

            let randomNum =
                Math.floor(Math.random() * inventory[randomItemId]) + 1;

            inventory[randomItemId] -= randomNum;
            authorInventory[randomItemId] += randomNum;

            await victimDm
                .send({
                    content: "Stolen fr.",
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("You have been stolen from!")
                            .setDescription(
                                `<@${interaction.user.id}> stole ${comma(
                                    randomNum
                                )} ${all[randomItemId].name}${
                                    randomNum > 1 ? "s" : ""
                                } from you!`
                            )
                            .setFooter({
                                text: `Server = ${interaction.member.guild.name}`,
                            }),
                    ],
                })
                .catch(() => null);

            const image = await emojiToImage(client, all[randomItemId].emoji);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Thief.")
                        .setDescription(
                            `You just stole ${randomNum}  ${
                                all[randomItemId].name
                            }${randomNum > 1 ? "s" : ""} from <@${
                                origInt.options.get("user").value
                            }>!`
                        )
                        .setColor("Green")
                        .setThumbnail(image),
                ],
            });

            await User.save(user);
            await User.save(victim);
        } catch (error) {
            await errorHandler(error, client, origInt, EmbedBuilder);
        }
    },
});

steal.noSelfAt = true;
steal.noBotAt = true;
steal.blacklist = true;

module.exports = steal;
