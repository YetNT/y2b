const all = require("./items");
const rndInt = require("../rndInt");

let { shield, shieldhp, ...withoutShield } = all;

const itemNames = (onlyForSale = false) => {
    /*
    if onlyForSale = 0 / false | Get All Items
    if onlyForSale = 1 / true | Get only items For Sale
    if onlyForSale = 2 | Get only items that you can sell
    */
    // let { shield, shieldhp, ...newInv } = all;

    let r = [];
    for (let item in all) {
        if (onlyForSale === true || onlyForSale === 1) {
            if (all[item].price == -1) continue;
        }
        if (onlyForSale === 2) {
            if (all[item].sell == -1) continue;
        }
        r.push({
            name: all[item].name,
            value: all[item].id,
        });
    }

    return r;
};

const getForgableItemNames = () => {
    let r = [];
    for (let i in all) {
        let item = all[i];
        if (item.craftingRecipe === undefined) continue;
        r.push({
            recipe: item.craftingRecipe,
            item: item,
        });
    }

    return r;
};

const itemNamesNoShield = () => {
    // eslint-disable-next-line no-unused-vars
    let { shield, shieldhp, ...newInv } = all;

    let r = [];
    for (let item in newInv) {
        r.push({
            name: newInv[item].name,
            value: newInv[item].id,
        });
    }

    return r;
};

/**
 *
 * @returns {{name: String, id: String}} Returns a random item.
 */
const randomItem = () => {
    // eslint-disable-next-line no-unused-vars
    let { shield, shieldhp, ...newInv } = all;
    const itemIds = Object.values(newInv).map((item) => item.id);
    const itemNames = Object.values(newInv).map((item) => item.name);

    const int = rndInt(1, itemIds.length);

    return {
        name: itemNames[int - 1],
        id: itemIds[int - 1],
    };
};

/**
 *
 * @param {*} obj Recipe object
 * @param {User} user User object
 */
function getRecipeItems(obj, user = undefined) {
    let str = ["\n"];
    let keys = Object.keys(obj);
    for (const key of keys) {
        if (key == "_amt" || key == "amt") continue;
        let amtNeeded = obj[key]; // amount needed by the recipe
        let userAmt = user !== undefined ? user.inventory[key] : undefined; // amount the user has
        let amtStr =
            userAmt !== undefined
                ? `\`${userAmt}/${amtNeeded}\``
                : `\`${amtNeeded}\``;

        let emoji = all[key].emoji;
        let itemName = all[key].name;
        let itemStr = `${amtStr} ${emoji} ___${itemName}___`;
        str.push(itemStr);
    }

    return str.join("\n");
}

module.exports = {
    all,
    withoutShield,
    itemNames,
    getRecipeItems,
    itemNamesNoShield,
    randomItem,
    getForgableItemNames,
};
