const isCommand = false;
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

const ids = {
    answer: "answer",
    igiveup: "igiveup",
};

/**
 * Parses somethig like 1,1 to 1.1
 * @param {string} input
 * @returns
 */
function parseNumber(input) {
    // Replace commas with dots and remove any non-digit or non-dot characters
    let normalized = input.replace(",", ".").replace(/[^\d.]/g, "");

    // Parse the normalized string to a float, then to an integer
    let number = parseFloat(normalized);

    // Return the integer part of the number
    return Math.round(number);
}

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

function generateEquation() {
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    const a = Math.floor(Math.random() * 10) + 1; // coefficient of x (1 to 10)
    const b = Math.floor(Math.random() * 10); // constant on the left-hand side (0 to 9)
    const c = Math.floor(Math.random() * 20) + 1; // constant on the right-hand side (1 to 20)

    let equation, solution;

    switch (operator) {
        case "+":
            equation = `Solve for x: ${a}x + ${b} = ${c}`;
            solution = (c - b) / a;
            break;
        case "-":
            equation = `Solve for x: ${a}x - ${b} = ${c}`;
            solution = (c + b) / a;
            break;
        case "*":
            equation = `Solve for x: ${a} * x = ${c}`;
            solution = c / a;
            break;
    }

    solution = Math.round(solution);

    return { equation, solution };
}

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
            const math = generateEquation();
            const modal = new ModalBuilder()
                .setCustomId("pythStopModal")
                .setTitle("Math! (Round to whole number.)");
            const answerInput = new TextInputBuilder()
                .setCustomId("answer")
                .setStyle(TextInputStyle.Short)
                .setLabel(math.equation);

            modal.addComponents(
                new ActionRowBuilder().addComponents(answerInput)
            );
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
                                if (parseNumber(input) == math.solution) {
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
