const sellPercentage = 0.45;
const r = Object.freeze({
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    epic: "Epic",
    insane: "Insane",
    godly: "Godly",
});

class Item {
    /**
     *
     * @param {string} name
     * @param {string} description
     * @param {string[]} uses
     * @param {number} price
     * @param {boolean|number} canBeSold
     * @param {string} id
     * @param {string} rarity
     * @param {string} emoji
     */
    constructor(
        name,
        description,
        uses,
        price,
        canBeSold = false,
        id,
        rarity,
        emoji = undefined,
        useable = false
    ) {
        this.name = name;
        this.description = description;
        this.uses = uses;
        this.price = price;
        this.sell =
            canBeSold == false
                ? -1
                : typeof canBeSold == "number"
                ? canBeSold
                : Math.round(price * sellPercentage);
        this.id = id;
        this.rarity = rarity;
        this.emoji = emoji !== undefined ? emoji : undefined;
        this.useable = useable === false ? false : true;
    }
}

let shield = new Item(
    "Shield",
    "It's a shield, not really anything else to it",
    ["Will protect you from any robbery"],
    1500,
    false,
    "shield",
    r.common
);
let shieldhp = new Item(
    "Shield's HP",
    "The amount of hp your shield has before it breaks. It lowers when somebody attempts to rob you.",
    [],
    150,
    false,
    "shieldhp",
    r.common
);
let rock = new Item(
    "Rock",
    "It's a rock. Nothing more, nothing less.",
    ["Can be turned into crystals using /crystalize"],
    50,
    false,
    "rock",
    r.common,
    "<:rock:1106937815738110055>"
);
let stick = new Item(
    "Stick",
    "A stick that was torn of abranch. Pretty rare if you ask me",
    [],
    100,
    false,
    "stick",
    r.common,
    "<:stick:1106945454572314695>"
);
let gem = new Item("Gem", "shine", [], 6000, true, "gem", r.rare, ":gem:");
let coal = new Item(
    "Coal",
    "COAL",
    [],
    1200,
    true,
    "coal",
    r.uncommon,
    "<:coal:1106946918954827956>"
);
let donut = new Item(
    "Donut",
    "Yay a donut!",
    ["When you fail to rob a user, one donut is subtracted instead of fines."],
    42e5,
    true,
    "donut",
    r.rare,
    "<:donut:1109381339947487374>"
);
let battery = new Item(
    "Lithium-ion battery",
    "Wtf a battery",
    [],
    500,
    true,
    "battery",
    r.common,
    ":battery:"
);
let gCrystal = new Item(
    "Green Crystal",
    "DAMN DAT SHI RARE!",
    ["Can be sold"],
    -1,
    2_000_000,
    "greenCrystal",
    r.epic,
    "<:greencrystal:1137408975470600272>"
);
let wCrystal = new Item(
    "White Crystal",
    "Woah a white crystal. Not bad, not bad",
    ["Can be sold"],
    -1,
    rock.price + 5,
    "whiteCrystal",
    r.rare,
    "<:whitecrystal:1137408970391310447>"
);
let oCrystal = new Item(
    "Orange Crystal",
    "Shii an orange crystal, reflective!",
    ["Can be sold"],
    -1,
    rock.price + 10,
    "orangeCrystal",
    r.rare,
    "<:orangecrystal:1137408967681769492>"
);
// eslint-disable-next-line no-unused-vars
let floCoin = new Item(
    "Flo's Spinning Coin",
    "Can you please stop laughing so hard that you pooped into space?\n- Flo",
    [],
    27_000_000,
    false,
    "floCoin",
    r.godly,
    "<a:flocoin:1138787029560336474>"
);
module.exports = {
    shield: shield,
    shieldhp: shieldhp,
    rock: rock,
    stick: stick,
    gem: gem,
    coal: coal,
    donut: donut,
    battery: battery,
    greenCrystal: gCrystal,
    whiteCrystal: wCrystal,
    orangeCrystal: oCrystal,
    floCoin: floCoin,
};
