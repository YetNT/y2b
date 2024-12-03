/**
 * @param {String} input Input
 */
module.exports = (input) => {
    let ar = input.match(/([0-9]*\.?[0-9]+)([a-zA-Z]+)/);
    if (!ar) return 0;

    let value = parseFloat(ar[1]);
    let unit = ar[2].toLowerCase();

    switch (unit) {
        case "s":
        case "seconds":
            return value * 1000;
        case "min":
        case "minutes":
        case "mins":
            return value * 60000;
        case "h":
        case "hour":
        case "hours":
            return value * 3.6e6;
        case "d":
        case "day":
        case "days":
            return value * 8.64e7;
        case "w":
        case "week":
        case "weeks":
            return value * 6.048e8;
        case "m":
        case "month":
        case "months":
            return value * 2.628e9;
        default:
            return 0; // Invalid input, return 0 or handle the error as desired
    }
};

function lol(input) {
    var ar = input.match(/([0-9]*\.?[0-9]+)([a-zA-Z]+)/);
    if (!ar) return 0;

    var value = parseFloat(ar[1]);
    var unit = ar[2].toLowerCase();

    switch (unit) {
        case "s":
        case "seconds":
            return value * 1000;
        case "min":
        case "minutes":
        case "mins":
            return value * 60000;
        case "h":
        case "hour":
        case "hours":
            return value * 3.6e6;
        case "d":
        case "day":
        case "days":
            return value * 8.64e7;
        case "w":
        case "week":
        case "weeks":
            return value * 6.048e8;
        case "m":
        case "month":
        case "months":
            return value * 2.628e9;
        default:
            return 0;
    }
}
