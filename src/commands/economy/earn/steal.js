const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
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
const {
    pickRandomItem,
    getRandomItem,
    getRandomNumberBasedOnRarity,
} = require("./_lib/stealFuncs");

const steal = new SlashCommandObject({
    name: "steal",
    description: "Steal from user's inventory!",
    // devOnly: true,
    // testOnly: true,

    options: [
        {
            name: "user",
            description: "robbery",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    // blacklist: true,
    callback: async function (client, interaction) {
        await interaction.deferReply();
        if (interaction.user.bot) {
            return interaction.editReply(
                new EmbedError("You can't rob bots tf").output
            );
        }

        //        const cooldownResult = await checkCooldown(
        //            "steal",
        //            client,
        //            interaction,
        //            EmbedBuilder,
        //            false,
        //            "Ay dawg u've robbed good cash. Wait a while."
        //        );
        //        if (cooldownResult === 0) {
        //            return;
        //        }
        //
        //        await newCooldown(Cooldowns.steal, interaction, "steal");

        try {
            let user = await User.findOne({ userId: interaction.user.id });
            let victim = await User.findOne({
                userId: interaction.options.get("user").value,
            });

            if (!user || !user.hasOwnProperty("inventory"))
                return interaction.editReply(
                    new EmbedError(
                        "You cannot steal from other people when you've got nothing. That's just unfair :skull:"
                    ).output
                );

            let authorInventory = user.inventory;

            if (!victim || !victim.hasOwnProperty("inventory")) {
                return interaction.editReply(
                    new EmbedError(
                        "You cannot steal from a someone who has absolutely nothing to steal."
                    ).output
                );
            }

            let inventory = victim.inventory; // victim's inventory

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
            let randomItem = getRandomItem(inventory);

            let randomNum =
                Math.floor(Math.random() * inventory[randomItem]) + 1;

            await interaction.editReply(
                `Ur gonna steal ${randomNum} ${all[randomItem].name}`
            );
        } catch (error) {
            await errorHandler(error, client, interaction, EmbedBuilder, true);
        }
    },
});

steal.noSelfAt = true;
steal.noBotAt = true;

module.exports = steal;
