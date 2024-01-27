const User = require("../../models/User");
const strToMilli = require("../formatters/strToMilli");
const cds = require("../misc/cooldowns");
require("dotenv").config();
const { devs } = require("../../../config.json");

/**
 *
 * @param {String | number} time Can be a strin glike '2min' or '9d'
 * @param {Interaction} interaction
 * @param {String} name The command's name, if it is complex, set to the object name
 * @param {String} complex If the name is complex like "challenge.lol" set name to "challenge" and this to "lol"
 * @returns
 */
const newCooldown = async (time, interaction, name, complex = false) => {
    let query = {
        userId: interaction.user.id,
    };
    let date = Date.now();
    let user = await User.findOne(query);
    let cooldown = user.cooldown;

    if (complex === false || complex === undefined) {
        if (
            cooldown &&
            cooldown[name] &&
            new Date(cooldown[name]).getTime() > date
        ) {
            return;
        }
    } else {
        if (
            cooldown &&
            cooldown[name][complex] &&
            new Date(cooldown[name][complex]).getTime() > date
        ) {
            return;
        }
    }

    let cooldownTime;
    if (typeof time == "string") {
        cooldownTime = strToMilli(time);
    } else if (typeof time === "number") {
        cooldownTime = time;
    } else {
        throw `wtf is "${time}"`;
    }

    if (cooldown) {
        complex === false || complex === undefined
            ? (cooldown[name] = new Date(date + cooldownTime))
            : (cooldown[name][complex] = new Date(date + cooldownTime));
        user.cooldown = cooldown;
        await User.save(user);
    } else {
        if (!user) {
            if (complex === false || complex === undefined) {
                user = User.newDoc({
                    ...query,
                    cooldown: { [name]: new Date(date + cooldownTime) },
                });
            } else {
                user = User.newDoc({
                    ...query,
                    cooldown: {
                        [name]: {
                            [complex]: new Date(date + cooldownTime),
                        },
                    },
                });
            }
        } else {
            if (complex === false || complex === undefined) {
                cooldown = {
                    [name]: new Date(date + cooldownTime),
                };
            } else {
                cooldown = {
                    [name]: {
                        [complex]: new Date(date + cooldownTime),
                    },
                };
            }
        }
        user.cooldown = cooldown;
        console.log(cooldown);
        await User.save(user);
    }
};

/**
 *
 * @param {String} name The command's name.
 * @param {Interaction} interaction
 * @param {EmbedBuilder} EmbedBuilder
 * @param {any} complex If the name is complex like "challenge.lol" set name to "challenge" and this to "lol"
 * @param {String} custom Set's a custom cooldown message
 * @returns
 */
const checkCooldown = async (
    name,
    client,
    interaction,
    EmbedBuilder,
    complex = false,
    custom = null
) => {
    if (
        client.token === process.env.TOKEN &&
        devs.includes(interaction.user.id)
    ) {
        console.log("mhm");
        // beta bot, so dont cooldown devs for testing reasons.
        return;
    }
    let query = {
        userId: interaction.user.id,
    };
    let date = new Date(Date.now());
    let description = ``;

    let user = await User.findOne(query);
    let cooldown = user.cooldown;
    if (!cooldown) {
        return 0;
    }
    let result =
        complex === false || complex === undefined
            ? cooldown[name]
            : cooldown[name][complex];
    result = new Date(result) /*.getMilliseconds()*/;

    if (cooldown && result) {
        let remainingTime = result - date;
        let endTime = Math.floor((Date.now() + remainingTime) / 1000);
        if (custom !== null) {
            description = `${custom} <t:${endTime}:R>`;
        } else {
            description = `Slow down bro. This command has a cooldown, you will be able to run this command <t:${endTime}:R>`;
        }
        if (remainingTime > 0) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Cooldown")
                        .setDescription(description)
                        .setColor("Random"),
                ],
            });
            return 0;
        }
    } else {
        return;
    }
};

const Cooldowns = Object.freeze(cds);

module.exports = { newCooldown, checkCooldown, Cooldowns };
