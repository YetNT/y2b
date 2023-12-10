const badgesJSON = require("./badges.json");
const User = require("../../../models/User");

/**
 *
 * @param {String} userId User's ID to give badge to
 * @param {String} badgeId Valid badge ID
 *
 * Gives a user a badge without telling them. Will error if badge ID is not found in `./badges.json`
 *
 * @returns True if badge has already been awarded.
 *
 * Example :
 * ```
 * await giveBadge(interaction.user.id, devBadge)
 * ```
 */
const giveBadge = async (userId, badgeId) => {
    let badgesObj = Object.values(badgesJSON);
    let badgeIds = [];

    for (let i = 0; i < badgesObj.length; i++) {
        badgeIds.push(badgesObj[i].id);
    }

    if (!badgeIds.includes(badgeId)) {
        throw new Error(`Badge id (${badgeId}) not found!`);
    }

    let user = await User.findOne({ userId: userId });
    let badges = user.badges;

    if (badges) {
        if (badges[badgeId] == true) {
            return true;
        } else {
            badges[badgeId] = true;
        }
    } else {
        if (!user) {
            user = User.newDoc({
                userId: userId.toString(),
                badges: {
                    [badgeId]: true,
                },
            });
        } else {
            badges = {
                [badgeId]: true,
            };
        }
    }

    await User.save(user);
};

/**
 *
 * @param {Interaction} interaction Pass interaction
 * @param {EmbedBuilder} EmbedBuilder Pass EmbedBuilder
 * @param {String} userId User's ID
 * @param {String} badgeId Badge ID
 * @param {Boolean} ephemeral Sets the ephemeral
 *
 * NOTE: This does assume that you have replied to the interaction already, which is why it sends a follow up message.
 *
 * Example usage. :
 * ```
 * await awardBadge(interaction, EmbedBuilder, interaction.user.id, devBadge)
 * ```
 */
const awardBadge = async (
    interaction,
    EmbedBuilder,
    userId,
    badgeId,
    ephemeral = false
) => {
    const a = await giveBadge(userId, badgeId);
    if (a == true) {
        return;
    } else {
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("BADGE EARNED")
                    .setDescription(
                        `Congrats you just earned the **${badgesJSON[badgeId].name}** badge!`
                    )
                    .setColor("Yellow"),
            ],
            ephemeral: ephemeral,
        });
    }
};

module.exports = { giveBadge, awardBadge };
