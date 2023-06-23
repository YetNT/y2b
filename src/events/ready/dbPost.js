const { createDjsClient } = require("discordbotlist");
const { AutoPoster } = require("topgg-autoposter");
const express = require("express");
const Topgg = require("@top-gg/sdk");

const app = express();

module.exports = async (client) => {
    const commands = await client.application?.commands.fetch();
    const dbl = createDjsClient(process.env.DBL_TOKEN, client);
    const webhook = new Topgg.Webhook(process.env.TOPGG_auth);

    const newArray = commands.map((obj) => {
        const { name, type, description, options } = obj;
        return {
            name: name,
            type: type,
            description: description,
            options: options,
        };
    });

    app.post(
        "/topgg-stats",
        webhook.listener(async (vote) => {
            let user = await client.users.fetch(vote.id).catch(() => null); // to dm the user.
            user.send("Thanks for voting on top.gg :)").catch(() => null);
            console.log(vote.user);
        })
    ); // attach the middleware

    app.listen(3000); // your port

    AutoPoster(process.env.TOPGG_TOKEN, client).on("posted", () => {
        console.log("Posted stats to Top.gg!");
    });

    dbl.postBotCommands(newArray);
    dbl.startPosting();

    dbl.startPolling(/* optional interval, defaults to every five minutes */);

    dbl.on("vote", async (vote) => {
        let user = await client.users.fetch(vote.id).catch(() => null); // to dm the user.
        user.send("Thanks for voting on dbl:)").catch(() => null);
        console.log(`${vote.username}#${vote.discriminator} voted!`);
    });
};
