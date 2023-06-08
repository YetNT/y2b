const { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const errorHandler = require('../../utils/errorHandler')
const rndInt = require('../../utils/rndInt')
const User = require('../../models/User')
const reward = 5000
const { coin } = require("../../utils/beatify")
const { newCooldown, checkCooldown } = require("../../utils/cooldown")

const createButtonActionRows = (rightButton) => {
    let wrongButtonArr = [
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_1"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_2"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_3"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_4"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_5"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_6"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_7"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_8"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_9"),
        new ButtonBuilder().setLabel("is it this?").setStyle(ButtonStyle.Danger).setCustomId("wrong_10")
    ]

    let correctRow = new ActionRowBuilder()
    let correctRowShow = new ActionRowBuilder()

    let randomIntForButton = rndInt(1, 5)
    for (let i = 0; i < 5; i++) {
        let randomed = false

        if (randomed == false && i == randomIntForButton) {
            correctRow.addComponents(rightButton.setStyle(ButtonStyle.Danger))
            randomed = true
        } else {
            correctRow.addComponents(wrongButtonArr[i])
        }
    }

    for (let i = 0; i < 5; i++) {
        let randomed = false

        if (randomed == false && i == randomIntForButton) {
            correctRowShow.addComponents(new ButtonBuilder().setCustomId("right").setLabel("iit was this").setDisabled(true).setStyle(ButtonStyle.Success))
            randomed = true
        } else {
            correctRowShow.addComponents(wrongButtonArr[i+5].setDisabled(true))
        }
    }
    
    return [correctRow,correctRowShow]
}

module.exports = {
    name:"challenge",
    description:"Challenges (contains subcommands)",
    options: [
        {
            name: "buttons",
            description: "Click the right button for a reward!",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            let subcommand = interaction.options.getSubcommand();

            if (subcommand === "buttons") {
                const cooldownResult = await checkCooldown('challenge', interaction, EmbedBuilder, 'buttons');
                if (cooldownResult === 0) {
                  return;
                }
                const rightButton = new ButtonBuilder().setCustomId("right").setLabel("is it this?")

                let rowArr = createButtonActionRows(rightButton)
                let response = await interaction.editReply(
                    {
                        embeds : [ new EmbedBuilder().setTitle("Can you click the button").setDescription(`Only real people click the correct button.\nIf you get it right the cooldown is \`30mins\`. If you get it wrong the cooldown is \`10mins\``) ],
                        components: [rowArr[0]]
                    }
                )

                const collectorFilter = i => i.user.id === interaction.user.id;
    
                try {
                    const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
    
                    if (confirmation.customId === 'right') {
                        let user = await User.findOne({userId:interaction.user.id})
                        if (user) {
                            user.balance += reward
                        } else {
                            user = new User({
                                userId: interaction.user.id,
                                balance: reward
                            })
                        }
    
                        await confirmation.update({
                            embeds: [ new EmbedBuilder()
                                .setTitle("Congratulations!")
                                .setDescription(`Hmm seems like you clicked the right button, fair game \n**+**${coin(reward)}`)
                            ],
                            components: [] 
                        });

                        newCooldown('30min', interaction, "challenge.buttons")
                    } else {
    
                        await confirmation.update({
                            embeds: [ new EmbedBuilder()
                                .setTitle("Unlucky")
                                .setDescription("looks like you clicked the wrong button, sad")
                            ],
                            components: [rowArr[1]] 
                        });

                        newCooldown('10min', interaction, "challenge", "buttons")
                    }
    
                } catch (e) { // User did not confirm whether they want to share the coins or not
                    await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription("Confirmation not received within 1 minute, cancelling") ], components: [], });
                    console.log(e)
                }
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder)
        }
    }
}
