const { withoutShield, all } = require("../../../../utils/misc/items/getItems");
const { r } = require("../../../../utils/misc/items/rarity");

/**
 *
 * @param {{*}} obj
 */
function pickRandomItem(obj) {
    // Get all keys except "shield" and filter out those with value 0
    const keys = Object.keys(obj).filter(
        (key) =>
            key !== "shield" && obj[key] !== 0 && all[key].canBeStolen !== false
    );

    // Randomly select from the filtered keys
    const randomIndex = Math.floor(Math.random() * keys.length);

    // Return the selected key
    return keys[randomIndex];
}

function getRandomNumberBasedOnRarity(rarity) {
    let min = 1;
    let max;

    switch (rarity) {
        case r.common:
            max = 20;
            break;
        case r.uncommon:
            max = 15;
            break;
        case r.rare:
            max = 10;
            break;
        case r.epic:
            max = 6;
            break;
        case r.insane:
            max = 3;
            break;
        case r.godly:
            max = 1;
            break;
        default:
            throw new Error("Invalid rarity level");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomItem(inventory) {
    const availableItems = Object.keys(inventory).filter(
        (item) => item !== "shield" && inventory[item] > 0
    );

    if (availableItems.length === 0) {
        throw new Error("No items available in inventory");
    }

    const weightedItems = availableItems.flatMap((item) => {
        const rarity = withoutShield[item].rarity;
        const weight = getRandomNumberBasedOnRarity(rarity);
        return Array(weight).fill(item);
    });

    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    return weightedItems[randomIndex];
}

module.exports = {
    isCommand: false,
    pickRandomItem,
    getRandomItem,
    getRandomNumberBasedOnRarity,
};
