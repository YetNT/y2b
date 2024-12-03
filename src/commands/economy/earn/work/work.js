const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../../../models/User");
const { coin } = require("../../../../utils/formatters/beatify");
const {
    newCooldown,
    checkCooldown,
    Cooldowns,
} = require("../../../../utils/handlers/cooldown");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");
const { makeChoices, rnd } = require("./workUtil");
const battery = require("../../items/use/battery");

const choices = makeChoices();

const work = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work for cash")
        .addStringOption((option) =>
            option
                .setName("job")
                .setDescription("Where do you want to work.")
                .setRequired(true)
                .setChoices(...choices)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            const cooldownResult = await checkCooldown(
                "work",
                client,
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
            let payment = reply.payment;
            let work = reply.answer.replace("{AMT}", `${coin(payment)}`);

            earn == true
                ? embed.push(
                      new EmbedBuilder()
                          .setTitle("Nice work")
                          .setColor("Green")
                          .setDescription(work)
                  )
                : embed.push(
                      new EmbedBuilder()
                          .setTitle("... work")
                          .setColor("Red")
                          .setDescription(work)
                  );

            let user = await User.findOne(query);

            if (user) {
                if (earn === true) {
                    let bActive = battery.info.isActive(user);
                    let bInfo = battery.info.calc(payment);
                    embed[0] = bActive
                        ? embed[0].setDescription(
                              embed[0].data.description + bInfo.info
                          )
                        : embed[0];
                    interaction.editReply({ embeds: embed });

                    user.balance += bActive ? payment + bInfo.num : payment;
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
