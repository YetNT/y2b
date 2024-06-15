const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../../models/User");
const Items = require("../../../utils/misc/items/items");
const { itemNames } = require("../../../utils/misc/items/getItems");
const { comma, shopify } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");

const sellable = itemNames(2);

class EmbedError {
    constructor(text) {
        this.output = {
            embeds: [new EmbedBuilder().setDescription(text)],
        };
    }
}
const sell = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("sell")
        .setDescription("Sell an item for some coins")
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("Which item you selling?")
                .setRequired(true)
                .setChoices(...sellable)
        )
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How much of this item are you selling?")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const item = interaction.options.get("item").value;
            const amount = interaction.options.get("amount").value;
            const cost = Items[item].sell * amount;
            let emoji = Items[item].emoji != undefined ? Items[item].emoji : "";
            let query = {
                userId: interaction.user.id,
            };

            let user = await User.findOne(query);
            let inventory = user.inventory;

            if (!inventory)
                return await interaction.editReply(
                    new EmbedError(
                        "What you selling when you have no inventory? :skull:"
                    ).output
                );
            if (amount < 0)
                return interaction.editReply(
                    new EmbedError("Don't sell amounts lower than 0").output
                );
            if (inventory[item] < amount)
                return await interaction.editReply(
                    new EmbedError(
                        `You do not have that many ${Items[item].emoji} ${Items[item].name}s!`
                    ).output
                );

            if (user) {
                user.balance += cost;
            } else {
                user = User.newDoc({
                    ...query,
                    balance: cost,
                });
            }

            inventory[item] -= amount;

            await User.save(user);

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("W Sell")
                        .setDescription(
                            `Succesfully sold \`${comma(amount)}\` ${emoji} ${
                                Items[item].name
                            } for ${shopify(cost)}`
                        )
                        .setColor("Green"),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

sell.blacklist = true;
sell.category = "economy";

module.exports = sell;
