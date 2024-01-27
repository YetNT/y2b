const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
} = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const rndInt = require("../../../../utils/misc/rndInt");
const User = require("../../../../models/User");
const reward = 5000;
const { coin } = require("../../../../utils/formatters/beatify");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../../utils/handlers/cooldown");

const createButtonActionRows = (rightButton) => {
    let wrongButtonArr = [
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_1"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_2"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_3"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_4"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_5"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_6"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_7"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_8"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_9"),
        new ButtonBuilder()
            .setLabel("is it this?")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("wrong_10"),
    ];

    let correctRow = new ActionRowBuilder();
    let correctRowShow = new ActionRowBuilder();

    let randomIntForButton = rndInt(1, 5);
    let rndIntForButtArr = randomIntForButton - 1;

    let randomed = false;
    for (let i = 0; i < 5; i++) {
        if (randomed == false && i == rndIntForButtArr) {
            correctRow.addComponents(rightButton.setStyle(ButtonStyle.Danger));
            randomed = true;
        } else {
            correctRow.addComponents(wrongButtonArr[i]);
        }
    }

    randomed = false;

    for (let i = 0; i < 5; i++) {
        if (randomed == false && i == rndIntForButtArr) {
            correctRowShow.addComponents(
                new ButtonBuilder()
                    .setCustomId("right")
                    .setLabel("it was this")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success)
            );
            randomed = true;
        } else {
            correctRowShow.addComponents(
                wrongButtonArr[i + 5].setDisabled(true)
            );
        }
    }

    return [correctRow, correctRowShow];
};

module.exports = {
    body: {
        name: "buttons",
        description: "Click the right button for a reward!",
        type: ApplicationCommandOptionType.Subcommand,
    },
    isCommand: false,
    callback: async (client, interaction) => {
        try {
            const cooldownResult = await checkCooldown(
                "challenge",
                client,
                interaction,
                EmbedBuilder,
                "buttons"
            );
            if (cooldownResult === 0) {
                return;
            }
            const rightButton = new ButtonBuilder()
                .setCustomId("right")
                .setLabel("is it this?");

            let rowArr = createButtonActionRows(rightButton);
            let response = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Can you click the button")
                        .setDescription(
                            `Only real people click the correct button.\nIf you get it right the cooldown is \`30mins\`. If you get it wrong the cooldown is \`10mins\``
                        ),
                ],
                components: [rowArr[0]],
            });

            const collectorFilter = (i) => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 60000,
                });

                if (confirmation.customId === "right") {
                    let user = await User.findOne({
                        userId: interaction.user.id,
                    });
                    if (user) {
                        user.balance += reward;
                    } else {
                        user = User.newDoc({
                            userId: interaction.user.id,
                            balance: reward,
                        });
                    }

                    await confirmation.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Congratulations!")
                                .setDescription(
                                    `Hmm seems like you clicked the right button, fair game \n**+**${coin(
                                        reward
                                    )}`
                                ),
                        ],
                        components: [],
                    });
                    await User.save(user);
                    newCooldown(
                        Cooldowns.challenge.buttons.right,
                        interaction,
                        "challenge",
                        "buttons"
                    );
                } else {
                    await confirmation.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Unlucky")
                                .setDescription(
                                    "looks like you clicked the wrong button, sad"
                                ),
                        ],
                        components: [rowArr[1]],
                    });

                    newCooldown(
                        Cooldowns.challenge.buttons.wrong,
                        interaction,
                        "challenge",
                        "buttons"
                    );
                }
            } catch (e) {
                // User did not confirm whether they want to share the coins or not
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "Confirmation not received within 1 minute, cancelling"
                        ),
                    ],
                    components: [],
                });
                console.log(e);
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};
