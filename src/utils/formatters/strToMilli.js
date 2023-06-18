/**
 * @param {String} input Input
 */
module.exports = (input) => {
    var ar = input.match(/[a-zA-Z]+|[0-9]+/g);
    var value = +ar[0];
    var unit = ar[1];
  
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
            return value * 3.6e+6;
        case "d":
        case "day":
        case "days":
            return value * 8.64e+7;
        case "w":
        case "week":
        case "weeks":
            return value * 6.048e+8;
        case "m":
        case "month":
        case "months":
            return value * 2.628e+9;
        default:
            return 0; // Invalid input, return 0 or handle the error as desired
    }
};