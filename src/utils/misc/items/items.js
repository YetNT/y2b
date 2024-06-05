const sellPercentage = 0.45;
const { r } = require("./rarity");

class Item {
    /**
     *
     * @param {boolean} canBeStolen
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
        canBeStolen,
        name,
        description,
        uses,
        price,
        canBeSold = false,
        id,
        rarity,
        emoji = undefined,
        useable = false,
        craftingRecipe = {}
    ) {
        this.canBeStolen = canBeStolen == true ? true : false;
        this.craftingRecipe =
            Object.entries(craftingRecipe).length === 0
                ? undefined
                : craftingRecipe;
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
        this.image = undefined;
    }
}

let shield = new Item(
    false,
    "Shield",
    "It's a shield, not really anything else to it",
    ["Will protect you from any robbery"],
    1500,
    false,
    "shield",
    r.common
);
let shieldhp = new Item(
    false,
    "Shield's HP",
    "The amount of hp your shield has before it breaks. It lowers when somebody attempts to rob you.",
    [],
    150,
    false,
    "shieldhp",
    r.common
);
let rock = new Item(
    true,
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
    true,
    "Stick",
    "A stick that was torn of abranch. Pretty rare if you ask me",
    [],
    100,
    false,
    "stick",
    r.common,
    "<:stick:1106945454572314695>"
);
let gem = new Item(
    true,
    "Gem",
    "shine",
    [],
    -1,
    2.8e4,
    "gem",
    r.rare,
    ":gem:",
    false,
    {
        _amt: 1,
        greenCrystal: 20,
        whiteCrystal: 2000,
    }
);
let coal = new Item(
    true,
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
    true,
    "Donut",
    "Yay a donut! Wait why tf can you forge it with coal and a mineral?",
    ["When you fail to rob a user, one donut is subtracted instead of fines."],
    -1,
    false,
    "donut",
    r.rare,
    "<:donut:1109381339947487374>",
    false,
    {
        _amt: 1,
        gem: 2_000,
        coal: 20,
    }
);
let battery = new Item(
    true,
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
    false,
    "Green Crystal",
    "DAMN DAT SHI RARE!",
    [],
    -1,
    2_000_000,
    "greenCrystal",
    r.epic,
    "<:greencrystal:1137408975470600272>"
);
let wCrystal = new Item(
    true,
    "White Crystal",
    "Woah a white crystal. Not bad, not bad",
    [],
    -1,
    rock.price + 5,
    "whiteCrystal",
    r.rare,
    "<:whitecrystal:1137408970391310447>"
);
let oCrystal = new Item(
    false,
    "Orange Crystal",
    "Shii an orange crystal, reflective!",
    ["Can be sold"],
    -1,
    rock.price + 10,
    "orangeCrystal",
    r.rare,
    "<:orangecrystal:1137408967681769492>"
);
let floCoin = new Item(
    false,
    "Flo's Spinning Coin",
    "Can you please stop laughing so hard that you pooped into space?\n- Flo",
    [],
    27_000_000,
    false,
    "floCoin",
    r.godly,
    "<a:flocoin:1138787029560336474>"
);
let flobirthday = new Item(
    false,
    "Flo's Lost birthday present",
    "Once upon a time, a guy named Flo got a birthday present from his friend yet",
    [],
    27_119_000,
    true,
    "floBirthday",
    r.insane,
    ":gift:"
);

let a = new Item(
    true,
    "a",
    "A. Literally just the letter a",
    [],
    1_450_000,
    true,
    "a",
    r.rare,
    "<:_aa_:1234557798432636989>"
);

let b = new Item(
    true,
    "b",
    "B. Literally just the letter b",
    [],
    1_000_000,
    true,
    "b",
    r.rare,
    "<:b_:1234557821954297937>"
);

let c = new Item(
    true,
    "c",
    "C. Literally just the letter c",
    [],
    1_100_000,
    true,
    "c",
    r.rare,
    "<:c_:1234557839230631959>"
);

let pythagorean = new Item(
    false,
    "Pythagorean Theorem",
    "The Pythagorean Theorem is a formula that can be used to calculate the length of the hypotenuse of a right triangle. a² + b² = c²",
    [
        "Allows your inventory to be protected by a random mathematical equation.",
    ],
    -1,
    2_000_000,
    "pythagorean",
    r.rare,
    ":triangular_ruler:",
    false,
    {
        _amt: 1,
        a: 1,
        b: 4,
        c: 9,
    }
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
    floBirthday: flobirthday,
    a: a,
    b: b,
    c: c,
    pythagorean: pythagorean,
};
