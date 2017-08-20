'use strict';
var helper = require('./helper.js');
let DEFAULT_MEMEIFY_TIMES = 3;

// memeifies a string
function memeify(args,session) {
    var parsedIntArgs = helper.parseIntArg(args, 'memeify', DEFAULT_MEMEIFY_TIMES, session),
        str = parsedIntArgs[0],
        times = parsedIntArgs[1],
        reverse = false;
    if(times < 0) {
        reverse = true
        times = Math.abs(times);
    }
    if(times == 0) {
        times = DEFAULT_MEMEIFY_TIMES;
    }
    // make an array out of the rest of the arguments
    let chars = [...str];
    console.log('Memeify command received with times argument: ' + times + ' and the string argument: ' + str);
    var output = [];
    for(var i = 0; i <= times; i++){
        var word = chars.join(' '.repeat(i));
        word = ' '.repeat(times - i) + word;
        output.push(word);
    }
    if(reverse) {
        output = output.reverse();
    }
    // Add who's sending it to the beginning of the output
    output.unshift(helper.getSendersFirstName(session) + ' says:');
    session.send(output.join('\n\n'));
    console.log('Memeify successful, output: ');
    console.log(output.join('\n'));
}

module.exports = memeify;
