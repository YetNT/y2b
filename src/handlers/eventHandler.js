const path = require("path");
const fs = require("fs");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
    const eventFolders = getAllFiles(
        // eslint-disable-next-line no-undef
        path.join(__dirname, "..", "events"),
        true
    );

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                if (eventFile.includes("dbPost") == true) {
                    if (client.application.id == "701280304182067251") {
                        //so that stats publish code doesn't execute on beta bot
                        await eventFunction.post(client, arg); //dbPost exports 2 things, express middleware for topgg listener and discordbotlist shit, so use .post
                        console.log("dbPost has been loaded");
                    } else {
                        continue;
                    }
                } else if (fs.lstatSync(eventFile).isDirectory()) {
                    //skip sub directories for subcommands
                    continue;
                } else {
                    await eventFunction(client, arg);
                }
            }
        });
    }
};
