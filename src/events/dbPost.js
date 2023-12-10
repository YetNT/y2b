const { createDjsClient, upvoteListener } = require("discordbotlist");
const { AutoPoster } = require("topgg-autoposter");
const express = require("express");
const Topgg = require("@top-gg/sdk");
const User = require("../models/User");
const { EmbedBuilder } = require("discord.js");
const { coin } = require("../utils/formatters/beatify");

const webhook = new Topgg.Webhook(process.env.TOPGG_auth);

const post = async (client) => {
    const commands = await client.application?.commands.fetch();
    const dbl = createDjsClient(process.env.DBL_TOKEN, client);

    const newArray = commands.map((obj) => {
        const { name, type, description, options } = obj;
        return {
            name: name,
            type: type,
            description: description,
            options: options,
        };
    });

    let i = 0;

    AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
        if (i < 3) {
            console.log(`Posted stats to Top.gg! ${i}`);
            i++;
        }
    });

    dbl.postBotCommands(newArray);
    dbl.startPosting();
};
let amt = 10_000;
/**
 *
 * @param {Client} client discord client
 * @param {string} userId Userid of who voted
 * @param {string} siteName "top.gg" or "discordbotlist"
 */
const response = async (client, userId, siteName) => {
    let query = { userId: userId };
    let dm = await client.users.fetch(userId).catch(() => null);

    let user = await User.findOne(query);
    if (user) {
        user.balance += amt;
    } else {
        user = User.newDoc({
            userId: userId,
            balance: amt,
        });
    }
    await User.save(user);
    await dm
        .send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Thank you for your support!")
                    .setDescription(
                        `Thanks for voting for the bot on ${siteName}.\nIn return you received ${coin(
                            amt
                        )}`
                    )
                    .setColor("LightGrey"),
            ],
        })
        .catch((/*Bot couldnt dm user*/) => null);
};

const setRoutes = (client) => {
    const app = express();

    app.post(
        "/topgg-stats",
        webhook.listener(async (vote) => {
            // vote.user
            await response(client, vote.user, "top.gg");
        })
    );

    app.post(
        "/dbl",
        upvoteListener(process.env.DBL_auth, async (vote) => {
            //vote.id
            await response(client, vote.id, "discordbotlist");
        })
    );

    return app;
};

module.exports = { post, setRoutes };
