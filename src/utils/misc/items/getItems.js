const all = require("./items"); // JSON values. it's essentially { [key:[string(item's id)]]: itemObject }
const rndInt = require("../rndInt");

let { shield, shieldhp, ...withoutShield } = all;

const withoutShieldArr = (() => {
    return Object.values(all).filter(
        (v) => v.id !== "shield" && v.id !== "shieldhp"
    );
})();

const items = (() => {
    return Object.values(all);
})();

const itemNames = (onlyForSale = false) => {
    /*
    if onlyForSale = 0 / false | Get All Items
    if onlyForSale = 1 / true | Get only items For Sale
    if onlyForSale = 2 | Get only items that you can sell
    */

    return (
        onlyForSale === true || onlyForSale === 1
            ? Object.values(all).filter((v) => v.price !== -1)
            : onlyForSale === 2
            ? Object.values(all).filter((v) => v.sell !== -1)
            : Object.values(all)
    ).map((v) => {
        return { name: v.name, value: v.id };
    });
};

const getForgableItemNames = () => {
    return Object.values(all)
        .filter((v) => v.craftingRecipe !== undefined)
        .map((v) => {
            return { recipe: v.craftingRecipe, item: v };
        });
};

const itemNamesNoShield = () => {
    return withoutShieldArr.map((v) => {
        return { name: v.name, value: v.id };
    });
};

/**
 *
 * @returns {{name: String, id: String}} Returns a random item.
 */
const randomItem = () => {
    // eslint-disable-next-line no-unused-vars
    const itemIds = withoutShieldArr.map((item) => item.id);
    const itemNames = withoutShieldArr.map((item) => item.name);

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
    return [
        "\n",
        ...Object.keys(obj)
            .filter((v) => v !== "_amt" && v !== "amt")
            .map((key) => {
                let amtNeeded = obj[key]; // amount needed by the recipe
                let userAmt =
                    user !== undefined ? user.inventory[key] : undefined; // amount the user has
                let amtStr =
                    userAmt !== undefined
                        ? `\`${userAmt}/${amtNeeded}\``
                        : `\`${amtNeeded}\``;

                let emoji = all[key].emoji;
                let itemName = all[key].name;
                let itemStr = `${amtStr} ${emoji} ___${itemName}___`;
                return itemStr;
            }),
    ].join("\n");
}

module.exports = {
    withoutShieldArr,
    all,
    items,
    withoutShield,
    itemNames,
    getRecipeItems,
    itemNamesNoShield,
    randomItem,
    getForgableItemNames,
};
