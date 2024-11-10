const sellPercentage = 0.45;
const { Item, Rarity } = require("y2b-shared");
let shield = new Item(
    false,
    "Shield",
    "It's a shield, not really anything else to it",
    ["Will protect you from any robbery"],
    1500,
    false,
    "shield",
    Rarity.common
);
let shieldhp = new Item(
    false,
    "Shield's HP",
    "The amount of hp your shield has before it breaks. It lowers when somebody attempts to rob you.",
    [],
    150,
    false,
    "shieldhp",
    Rarity.common
);
let rock = new Item(
    true,
    "Rock",
    "It's a rock. Nothing more, nothing less.",
    ["Can be turned into crystals using /crystalize"],
    50,
    false,
    "rock",
    Rarity.common,
    "<:rock:1106937815738110055>",
    true
);
let string = new Item(
    true,
    "String",
    "String.",
    [],
    70,
    false,
    "string",
    Rarity.common,
    "<:string:1304768309027405834>"
);
let slingshot = new Item(
    false,
    "Slingshot!",
    "Oh damn, a whole slingshot",
    ["Shoot shi wit a slingshot"],
    410,
    false,
    "slingshot",
    Rarity.common,
    "<:slingshot:1305163884184866836>",
    true,
    {
        _amt: 1,
        stick: 1,
        string: 2,
    }
);
let stick = new Item(
    true,
    "Stick",
    "A stick that was torn of a branch. Pretty rare if you ask me",
    [],
    100,
    false,
    "stick",
    Rarity.common,
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
    Rarity.rare,
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
    Rarity.uncommon,
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
    Rarity.rare,
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
    Rarity.common,
    ":battery:"
);
let greenCrystal = new Item(
    false,
    "Green Crystal",
    "*Villager Noises*",
    [],
    -1,
    rock.price + 5,
    "greenCrystal",
    Rarity.rare,
    "<:greencrystal:1137408975470600272>"
);
let orangeCrystal = new Item(
    false,
    "Orange Crystal",
    "Shii an orange crystal, reflective!",
    ["Can be sold"],
    -1,
    rock.price + 10,
    "orangeCrystal",
    Rarity.rare,
    "<:orangecrystal:1137408967681769492>"
);
let whiteCrystal = new Item(
    true,
    "White Crystal",
    "Holy Moly Shiny!",
    [],
    -1,
    400_000,
    "whiteCrystal",
    Rarity.epic,
    "<:whitecrystal:1137408970391310447>"
);
let floCoin = new Item(
    false,
    "Flo's Spinning Coin",
    "Can you please stop laughing so hard that you pooped into space?\n- Flo",
    [],
    27_000_000,
    false,
    "floCoin",
    Rarity.godly,
    "<a:flocoin:1138787029560336474>",
    true
);
let floBirthday = new Item(
    false,
    "Flo's Lost birthday present",
    "Once upon a time, a guy named Flo got a birthday present from his friend yet",
    [],
    27_119_000,
    true,
    "floBirthday",
    Rarity.insane,
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
    Rarity.rare,
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
    Rarity.rare,
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
    Rarity.rare,
    "<:c_:1234557839230631959>"
);

let pythagorean = new Item(
    false,
    "Pythagorean Theorem",
    "a² + b² = c²",
    [
        "Allows your inventory to be protected by a random mathematical equation.",
    ],
    -1,
    2_000_000,
    "pythagorean",
    Rarity.rare,
    ":triangular_ruler:",
    false,
    {
        _amt: 1,
        a: 1,
        b: 4,
        c: 9,
    }
);
/**
 * @type {[key: string]: Item}
 */
module.exports = {
    shield,
    shieldhp,
    rock,
    stick,
    gem,
    coal,
    donut,
    battery,
    greenCrystal,
    whiteCrystal,
    orangeCrystal,
    floCoin,
    floBirthday,
    a,
    b,
    c,
    pythagorean,
    string,
    slingshot,
};
