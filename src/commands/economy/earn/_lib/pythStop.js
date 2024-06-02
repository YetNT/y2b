const isCommand = false;
const rndInt = require("../../../../utils/misc/rndInt");
const {
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    Client,
    CommandInteraction,
    ModalSubmitInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageComponentInteraction,
    Embed,
} = require("discord.js");
const { InteractionType, CommandInteractionObject } = require("ic4d");
const { comma } = require("../../../../utils/formatters/beatify");
const User1 = require("../../../../models/User");
const { Inventory, User } = require("../../../../models/cache");

const modal = new ModalBuilder()
    .setCustomId("pythStopModal")
    .setTitle("This inventory is protected!");
const answerInput = new TextInputBuilder()
    .setCustomId("answer")
    .setLabel("Answer the following question:")
    .setStyle(TextInputStyle.Short);
modal.addComponents(new ActionRowBuilder().addComponents(answerInput));

const ids = {
    answer: "answer",
    igiveup: "igiveup",
};

const cmdIntObjs = [
    new CommandInteractionObject({
        customId: ids.answer,
        authorOnly: true,
        type: InteractionType.Button,
        callback: async (interaction) => {},
    }),
    new CommandInteractionObject({
        customId: ids.igiveup,
        authorOnly: true,
        type: InteractionType.Button,
        callback: async (interaction) => {},
    }),
];

const actionrow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId(ids.answer)
        .setLabel("Answer Equation")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId(ids.igiveup)
        .setLabel("I give up")
        .setStyle(ButtonStyle.Danger)
);

/**
 * Info: Since this uses a modal, you cannot defer the reply before sending it to the user. Therefore you have to move the defer reply AFTER this executes, whether it does or not. You can use editreply since this makes a reply.
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {Inventory} inventory
 * @param {User} victim
 * @param {User} authorInventory
 * @returns {Promise<[boolean, ModalSubmitInteraction | null, boolean?]>} A promise that resolves to an array containing a boolean and an interaction or null
 */
async function pythStop(
    client,
    interaction,
    inventory,
    victim,
    authorInventory
) {
    return new Promise(async (resolve, reject) => {
        let pythStop = false;
        const victimDm = await client.users
            .fetch(interaction.options.get("user").value)
            .catch(() => null); // to dm the user.

        if (inventory && inventory.pythagorean > 0) {
            const res = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Oh dang!")
                        .setDescription(
                            `**${victimDm.username}** has a pythagorean inventory! This means if you'd like to rob them you have to answer the question correctly first!`
                        )
                        .setColor("Random"),
                ],
                components: [actionrow],
            });
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            try {
                /**
                 * @type {MessageComponentInteraction}
                 */
                const confirmation = await res.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 60_000,
                });

                switch (confirmation.customId) {
                    case ids.igiveup:
                        resolve([pythStop, null]);
                        break;
                    case ids.answer:
                        await confirmation.showModal(modal);
                        const filter = (modalInteraction) =>
                            modalInteraction.customId === "pythStopModal" &&
                            modalInteraction.user.id === interaction.user.id;

                        confirmation
                            .awaitModalSubmit({ time: 60_000, filter })
                            .then(async (modalInteraction) => {
                                const input =
                                    modalInteraction.fields.getTextInputValue(
                                        "answer"
                                    );

                                if (!filter(modalInteraction)) return;
                                if (input == "qwerty") {
                                    // correct answer, return false
                                    await modalInteraction.reply({
                                        content: "_ _",
                                        // replies with blank content so that the code in the previous file can just edit the reply.
                                    });
                                    await interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setTitle("GG")
                                                .setDescription(
                                                    "You answered it correctly, you may proceed."
                                                )
                                                .setColor("Yellow"),
                                        ],
                                        components: [],
                                    });
                                    pythStop = false;

                                    resolve([pythStop, modalInteraction]);
                                } else {
                                    // incorrect answer, return true
                                    await modalInteraction.reply({
                                        content: "You failed lmao.",
                                    });
                                    pythStop = true;
                                    resolve([pythStop, modalInteraction]);
                                }
                            })
                            .catch((err) => {
                                // No input was received.
                                resolve([pythStop, null]);
                                return;
                            });
                        break;
                }
            } catch (e) {
                console.warn(e);
            }
        } else {
            resolve([pythStop, null, false]);
        }
    });
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function pythStopFailMessage(interaction) {
    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle("You Failed!")
                .setDescription(
                    `You either failed the math equation or failed to answer in time. Better luck next time`
                )
                .setColor("DarkRed"),
        ],
        components: [],
    });
}

module.exports = {
    isCommand,
    pythStop,
    arr: [ids, cmdIntObjs, actionrow],
    pythStopFailMessage,
};
