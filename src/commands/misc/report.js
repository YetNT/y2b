const errorHandler = require("../../utils/handlers/errorHandler")
const { EmbedBuilder } = require("discord.js")

const subcommands = require("./reportSubcommands/index")

function arrToObj(originalArray) {
    const transformedObject = {};

    originalArray.forEach(item => {
        transformedObject[item.name] = {
            id: item.id,
            name: item.name,
            moderated: item.moderated,
            emoji: {
                id: item.emoji.id,
                name: item.emoji.name
            }
        };
    });

    return transformedObject;
}

module.exports = {
	name:"report",
	description: "Report stuff (Contains subcommands)",
	options: [subcommands.bug.body, subcommands.user.body, subcommands.server.body],
	blacklist: true,

	callback: async (client, interaction) => {
		await interaction.deferReply();
		try {
			const forum = client.channels.cache.get("1172574488362242098")
			const tagsObj = arrToObj(forum.availableTags)
			
			const tags = {
				"bug":tagsObj.Bug.id,
				"server":tagsObj.server.id,
				"user":tagsObj.user.id
			}
			
			let subcommand = interaction.options.getSubcommand()
			switch (subcommand) {
				case "bug":
					await subcommands.bug.callback(client, interaction, forum, tags)
					break;
				case "user":
					await subcommands.user.callback(client, interaction, forum, tags)
					break;
				case "server":
					await subcommands.server.callback(client, interaction, forum, tags)
					break;
			}
		} catch (error) {
			errorHandler(error, client, interaction, EmbedBuilder)
		}
	}
}
