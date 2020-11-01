var helper = require('./helper.js');

// detonates a string
function detonate(args, session) {
    var parsedIntArgs = helper.parseIntArg(args, 'detonate', 0, session),
        str = parsedIntArgs[0],
        type = parsedIntArgs[1],
        reverseOutput = false,
        transposeOutput = true;
    // Type 2 means tranpose, type -1 means reverse, type -2 means reverse and transpose
    switch (type) {
        case -2:
            reverseOutput = true;
            transposeOutput = false;
            break;
        case -1:
            reverseOutput = true;
            break;
        case 2:
            transposeOutput = false;
            break;
        default:
            break;
    }
    let chars = [...str];
    var output = [];
    for(var i = 0; i < chars.length; i++) {
        // just a tad obfuscated-looking
        spaces = ' '.repeat(chars.length - (i+1))
        output[i] =  spaces + [...chars[i].repeat(i+1)].join(' ') + spaces;
    }
    // order matters
    if(reverseOutput) {
        output = output.reverse();
    }
    if(transposeOutput) {
        // tranpose the array once we split the strings into character arrays so it becomes truly 2D
        let transposed = helper.transpose(output.map( (row) => {return [...row];}));
        // now convert back to a string
        output = transposed.map( (row) => {return row.join('')});
    }
    // join the array back
    output = output.join('\n\n');
    console.log(output);
    session.send(helper.getSendersFirstName(session) + ' says: \n\n'.concat(output));
}

module.exports = detonate;
