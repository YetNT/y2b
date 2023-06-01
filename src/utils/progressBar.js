// Once i get my npm account back, ill upload this code to npmas progressbar.js and remove this code.

/**
 * @param {Integer} percentage How much of the progress bar should be filled. (A number between 1 and 100)
 * @param {Integer} barWidth How long should the bar be?
 * @param {String} emptyChars What should be displayed for parts of the bar that are empty.
 * @param {String} fullChars What should be displayed for parts of the bar that is filled.
 * @param {Boolean} returnAr Return an array in stead of a string
 * @param {String[]} firstEdgeOverride Override first bar char with something else. Make sure it is similar to this ```["emptyChar", "fullChar"]```.
 * @param {String[]} lastEdgeOverride Override first bar char with something else. Make sure it is similar to this ```["emptyChar", "fullChar"]```.
 * 
 * @returns Array or String when `returnAr` is specified
 */
const progressBar = (percentage, barWidth, emptyChars, fullChars, returnAr = false, firstEdgeOverride, lastEdgeOverride) => { // (Percent of the bar you want full (out of 100), Amount of units in the bar)
    // checks
    if (percentage > 100 || percentage < 0 || typeof percentage !== 'number') {
        console.error(`percentage should be a valid integer/float between 0 and 100.`)
        let out = ``
        percentage > 100 ? out = `${percentage} > 100` : percentage < 0 ? out = `${percentage} < 0` : out = `percentage is currently a ${typeof percentage}`
        console.error(out)
        return;
    }
    
    if (typeof barWidth !== 'number') {
        console.error(`Barwidth should be a valid Int`)
        return
    }
    
    if (typeof fullChars !== 'string' || typeof emptyChars !== 'string') {
        console.error(`emptyChar (param 3) and fullChar (param 4) should be of type String`)
        return
    }
    
    if ((firstEdgeOverride !== undefined) && (firstEdgeOverride.length !== lastEdgeOverride.length)) {
        console.error(`Overrides should only be 2 elements long.`)
        return;
    }
    // logic
    var units = Math.floor((percentage / 100) * barWidth) // Amount of units that will be shaded (Do Not Edit)
    var bar = []
    let empty = "", filled = "";
      
    for ( i = 0; i < barWidth; i++) {
    
        if (emptyChars == undefined && fullChars == undefined) {
            empty = "empty", filled = "filled"
        } else {
            empty = emptyChars, filled = fullChars
        }
        
        if ( i < units) { // push the filled char
            if (typeof firstEdgeOverride !== "undefined" && typeof lastEdgeOverride !== "undefined") {
                i == 0 ? bar.push(firstEdgeOverride[1]) : i == barWidth - 1 ? bar.push(lastEdgeOverride[1]) : bar.push(filled)
            } else {
                bar.push(filled)
            }
        } else { // push the empty char
            if (typeof firstEdgeOverride !== "undefined" && typeof lastEdgeOverride !== "undefined") {
                i == 0 ? bar.push(firstEdgeOverride[0]) : i == barWidth - 1 ? bar.push(lastEdgeOverride[0]) : bar.push(empty)
            } else {
                bar.push(empty)
            }
        }
    }
    
    if (returnAr == true) {
        return bar
    } else {
        return bar.join("")
    }
    
}

module.exports = { progressBar }
    