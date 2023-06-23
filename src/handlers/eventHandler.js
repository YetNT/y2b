const path = require("path");
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
                        await eventFunction(client, arg);
                        console.log("dbPost has been loaded");
                    } else {
                        continue;
                    }
                } else {
                    await eventFunction(client, arg);
                }
            }
        });
    }
};
