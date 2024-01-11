const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const User = require("../../../../models/User");
const { coin } = require("../../../../utils/formatters/beatify");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../../utils/handlers/cooldown");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");
const { makeChoices, rnd } = require("./workUtil");


const work = new SlashCommandObject({
    name: "work",
    description: "Work for cash",
    blacklist: true,
    options: [
        {
            name: "job",
            description: "Where do you want to work.",
            required: true,
            choices: makeChoices(),
            type: ApplicationCommandOptionType.String,
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            const cooldownResult = await checkCooldown(
                "work",
                interaction,
                EmbedBuilder
            );
            if (cooldownResult === 0) {
                return;
            }
            let embed = [];
            const query = {
                userId: interaction.user.id,
            };
            let earn = Math.random() <= 0.25 ? false : true;

            let option = interaction.options.get("job").value;
            let reply = rnd(earn, option);
            let payment = reply.payment
            let work = reply.answer.replace("{AMT}", `${coin(payment)}`);

            earn == true
                ? embed.push(
                      new EmbedBuilder()
                          .setTitle("Nice work")
                          .setColor("Green")
                          .setDescription(`${work}`)
                  )
                : embed.push(
                      new EmbedBuilder()
                          .setTitle("... work")
                          .setColor("Red")
                          .setDescription(`${work}`)
                  );

            let user = await User.findOne(query);

            if (user) {
                if (earn === true) {
                    interaction.editReply({ embeds: embed });

                    user.balance += payment;
                } else {
                    interaction.editReply({ embeds: embed });
                    if (/\{AMT\}/.test(reply) == true) user.balance -= payment;
                }

                await User.save(user);
            } else {
                if (earn === true) {
                    interaction.editReply({ embeds: embed });
                    user = User.newDoc({
                        ...query,
                        balance: payment,
                    });
                } else {
                    embed.push(
                        new EmbedBuilder()
                            .setTitle("Saved from debt!")
                            .setDescription(
                                "Due to you being a new user, you've been saved from debt. Lucky"
                            )
                    );
                    interaction.editReply({ embeds: embed });
                    user = User.newDoc({
                        ...query,
                        balance: payment,
                    });
                }

                await User.save(user);
            }

            await newCooldown(Cooldowns.work, interaction, "work");
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});
work.blacklist = true;
work.category = "economy";

module.exports = work;
