const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const errorHandler = require("../../../utils/handlers/errorHandler");
const User = require("../../../models/User");
const Items = require("../../../utils/misc/items/items.js");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../utils/handlers/cooldown");
const { SlashCommandObject } = require("ic4d");

/**
 *
 * @param {User.inventory} inventory
 * @param {number} amt
 * @returns
 */
async function crystalizeRocks(inventory, amt, user) {
    // Calculate the number of rocks that will become orange crystals (2-9%)
    const orangeCrystals = Math.floor(((Math.random() * 8 + 2) / 100) * amt);

    // Calculate the number of rocks that will become white crystals (20-40%)
    const whiteCrystals = Math.floor(((Math.random() * 21 + 20) / 100) * amt);

    // The remaining rocks will stay as rocks
    const remainingRocks = amt - (orangeCrystals + whiteCrystals);

    // Calculate quantities based on user input (amt)
    const orangeCrystalsUser = Math.min(orangeCrystals, amt);
    const whiteCrystalsUser = Math.min(whiteCrystals, amt - orangeCrystalsUser);
    const remainingRocksUser = Math.min(
        remainingRocks,
        amt - (orangeCrystalsUser + whiteCrystalsUser)
    );

    inventory.rock -= orangeCrystalsUser + whiteCrystalsUser;
    inventory.orangeCrystal += orangeCrystalsUser;
    inventory.whiteCrystal += whiteCrystalsUser;

    await User.save(user);

    return {
        orangeCrystals: orangeCrystalsUser,
        whiteCrystals: whiteCrystalsUser,
        rocks: remainingRocksUser,
    };
}

const crystalize = new SlashCommandObject({
    name: "crystalize",
    description: "Crystalize your rocks.",
    options: [
        {
            name: "amount",
            description: "Amount of rocks you'd like to crystalize",
            required: true,
            type: ApplicationCommandOptionType.Number,
            min_value: 50,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            const amt = interaction.options.get("amount").value;
            let query = {
                userId: interaction.user.id,
            };

            const user = await User.findOne(query);
            const inventory = user.inventory;
            if (!inventory)
                return interaction.editReply({
                    content: "You have.. no items?",
                    ephemeral: true,
                });
            if (inventory.rock < 50)
                return interaction.editReply({
                    content: "You don't own 50 or more rocks",
                    ephemeral: true,
                });
            if (amt > inventory.rock)
                return interaction.editReply({
                    content: `You don't have ${amt} rocks. ||You're short of ${
                        amt - inventory.rock
                    } rocks||`,
                    ephemeral: true,
                });

            const cooldownResult = await checkCooldown(
                "crystalize",
                client,
                interaction,
                EmbedBuilder,
                false,
                "The lab don't got infinite time, others gotta crystalize too. Your up next in "
            );
            if (cooldownResult === 0) {
                return;
            }

            await interaction.editReply("Crystalizing...");
            let result = await crystalizeRocks(inventory, amt, user);
            wait(5000);
            await interaction.editReply({
                content: "_ _",
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Crystalization Results")
                        .setDescription(
                            `x${result.orangeCrystals} ${Items.orangeCrystal.emoji} Orange Crystals\n` +
                                `x${result.whiteCrystals} ${Items.whiteCrystal.emoji} White Crystals\n` +
                                `x${result.rocks} ${Items.rock.emoji} remaining rocks.`
                        )
                        .setColor("#00aaff"),
                ],
            });

            await newCooldown(Cooldowns.crystalize, interaction, "crystalize");
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});
crystalize.category = "economy";
crystalize.blacklist = true;

module.exports = crystalize;
