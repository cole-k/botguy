'use strict';

function transpose(matrix) {
    var output = [];
    // we want the row's length
    for(var i = 0; i < matrix[0].length; i++) {
        output.push([]);
    }

    for(var i = 0; i < matrix.length; i++) {
        for(var j = 0; j < matrix[0].length; j++) {
            output[j].push(matrix[i][j]);
        }
    }
    return output;
}

// retrieve a sender's first name
function getSendersFirstName(session) {
    let name = session.message.user.name;
    return name.split(' ')[0];
}

function parseIntArg(args, name, defaultVal, session) {
    if(args.length === 0){
        session.send('Too few arguments provided, ' + name + ' failed.');
        return -1;
    } else {
        args = args.split(' ');
        var int = parseInt(args[0]);
        // if you can't parse the first arg as an int, use the default number
        if(isNaN(int)){ 
            int = defaultVal;
        // if you can parse it as an int, don't include it in the output
        } else {
            args = args.slice(1);
        }
        return [args.join(' '), int];
    }

}

module.exports = {transpose, getSendersFirstName, parseIntArg};
