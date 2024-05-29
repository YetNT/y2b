const isCommand = false;
const rndInt = require("../../../../utils/misc/rndInt");
const { EmbedBuilder, Client, CommandInteraction } = require("discord.js");
const { comma } = require("../../../../utils/formatters/beatify");
const User1 = require("../../../../models/User");
const { Inventory, User } = require("../../../../models/cache");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {Inventory} inventory
 * @param {User} victim
 * @param {string[]} errorMsg The first one in the string array is the returned string, and the other is the one returned in the victim's DM
 * @returns
 */
async function shieldStop(client, interaction, inventory, victim, errorMsg) {
    let shieldStop = false;
    const victimDm = await client.users
        .fetch(interaction.options.get("user").value)
        .catch(() => null); // to dm the user.

    if (inventory.shield.amt > 0 && inventory.shield.hp > 0) {
        let damage = rndInt(
            Math.floor(inventory.shield.hp / 2),
            inventory.shield.hp
        );
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(
                    errorMsg[0] +
                        ` but this user had a shield! You damaged their shield by **${comma(
                            damage
                        )}%**`
                ),
            ],
        });
        inventory.shield.hp -= damage;

        await victimDm
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Your shield has been damaged!")
                        .setDescription(
                            `<@${interaction.user.id}> tried ` +
                                errorMsg[1] +
                                ` but instead damaged your shield by **${comma(
                                    damage
                                )}%**`
                        )
                        .setFooter({
                            text: `Server = ${interaction.member.guild.name}`,
                        }),
                ],
            })
            .catch(() => null);
        await User1.save(victim);
        if (inventory.shield.hp == 0) {
            inventory.shield.amt -= 1;
            inventory.shield.hp = 500;
            await interaction.followUp("You broke this user's shield.");
            await User.save(victim);

            await victimDm
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Your shield has been broken!")
                            .setDescription(
                                `<@${interaction.user.id}> managed to break your shield! You now have **${inventory.shield.amt}** shields left.`
                            )
                            .setFooter({
                                text: `Server = ${interaction.member.guild.name}`,
                            }),
                    ],
                })
                .catch(() => null);
        }
        shieldStop = true;
    }
    return shieldStop;
}

module.exports = { isCommand, shieldStop };
