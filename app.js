// set up environment
//require('dotenv').config();

var restify = require('restify');
var builder = require('botbuilder');
var ArgParser = require('./argparse.js');

let DEFAULT_MEMEIFY_TIMES = 3;
// talk abut hardcoding amiright
// let ADMIN_ID = 'cole.cherian1';

function transpose(matrix) {
    var output = [];
    // we want the row's length
    for(i = 0; i < matrix[0].length; i++) {
        output.push([]);
    }

    for(i = 0; i < matrix.length; i++) {
        for(j = 0; j < matrix[0].length; j++) {
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

// detonates a string
function detonate(args, session) {
    var parsedIntArgs = parseIntArg(args, 'detonate', 0, session),
        str = parsedIntArgs[0],
        type = parsedIntArgs[1],
        reverse = false,
        tranpose = true;
    // Type 2 means tranpose, type -1 means reverse, type -2 means reverse and transpose
    switch (type) {
        case -2:
            reverse = true;
            transpose = false;
            break;
        case -1:
            reverse = true;
            break;
        case 2:
            tranpose = false;
            break;
        default:
            break;
    }
    let chars = [...str];
    var output = [];
    for(i = 0; i < chars.length; i++) {
        // just a tad obfuscated-looking
        spaces = ' '.repeat(chars.length - (i+1))
        output[i] =  spaces + [...chars[i].repeat(i+1)].join(' ') + spaces;
    }
    // order matters
    if(reverse) {
        output = output.reverse();
    }
    if(transpose) {
        // tranpose the array once we split the strings into character arrays so it becomes truly 2D
        let transposed = transpose(output.map( (row) => {return [...row];}));
        // now convert back to a string
        output = transposed.map( (row) => {return row.join('')});
    }
    // join the array back
    output = output.join('\n\n');
    console.log(output);
    session.send(getSendersFirstName(session) + ' says: \n\n'.concat(output));
}

// memeifies a string
function memeify(args,session) {
    var parsedIntArgs = parseIntArg(args, 'memeify', DEFAULT_MEMEIFY_TIMES, session),
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
    for(i = 0; i <= times; i++){
        var word = chars.join(' '.repeat(i));
        word = ' '.repeat(times - i) + word;
        output.push(word);
    }
    if(reverse) {
        output = output.reverse();
    }
    // Add "empty string" to the beginning of the output
    output.unshift(getSendersFirstName(session) + ' says:');
    session.send(output.join('\n\n'));
    console.log('Memeify successful, output: ');
    console.log(output.join('\n'));
}

var whoisParser = new ArgParser();
whoisParser.addArg(['here'], (args,session) => {
    session.send('I am, ' + getSendersFirstName(session) + '.');
});
whoisParser.addArg(['botguy'], (args,session) => {
    session.send('A helpful bot. Maybe.');
});

// whois
function whois(args,session) {
    whoisParser.parse(args,session);
}

function listNiceOnes(session) {
    niceOnesArray = [];
    Object.keys(session.conversationData.niceOne).forEach( function(key) {
        niceOnesArray.push([key,session.conversationData.niceOne[key]]);
    });
    var output = niceOnesArray.sort( function (a,b) {return b[1] - a[1];} );
    outputMessage = ['Nice ones:'];
    output.forEach( function(item) {
        outputMessage.push(item[0] + ': ' + item[1]);
    });
    session.send(outputMessage.join('\n\n'));
}

function getNiceOnes(user, session) {
    var userKey = user.toLowerCase();
    // If given 'me', try to get the nice ones for the user's first name
    if(userKey === 'me'){
        user = getSendersFirstName(session);
        userKey = user.toLowerCase();
    // otherwise, just get the user's nice ones
    } else if(userKey === '') {
        listNiceOnes(session);
    } else {
        let niceOnes = session.conversationData.niceOne[userKey];
        if(!niceOnes){
            niceOnes = 0;
        }
        session.send('Nice ones for ' + user + ': ' + niceOnes);
    }
}

function addNiceOne(user, session) {
    if(user === '') {
        // because it's called with @botguy niceone,
        // make this the default
        addNiceOne('botguy', session);
        return;
    }
    userKey = user.toLowerCase();
    if(!session.conversationData.niceOne[userKey]) {
        console.log("Key " + userKey + " doesn't exist, creating...");
        session.conversationData.niceOne[userKey] = 1;
    } else {
        session.conversationData.niceOne[userKey] += 1;
    }
    session.save();
    session.send('👍 Nice one, ' + user + '. \n\nCurrent nice ones: ' + session.conversationData.niceOne[userKey]);
}

function subtractNiceOne(user, session) {
    if (user === '') {
        return -1;
    }
    var userKey = user.toLowerCase();
    if (session.conversationData.niceOne[userKey]) {
        session.conversationData.niceOne[userKey] -= 1;
        session.send('👎 Not so nice one, ' + user + '. \n\nCurrent nice ones: ' + session.conversationData.niceOne[userKey] + '.');
        if (session.conversationData.niceOne[userKey] == 0) {
            delete session.conversationData.niceOne[userKey];
            session.send('User ' + user + "'s nice one value fell to zero, removing from the list...");
        }
    }
}

niceOneParser = new ArgParser(addNiceOne);
niceOneParser.addArg(['m','minus'],subtractNiceOne);
niceOneParser.addArg(['get'],getNiceOnes);
niceOneParser.addArg(['list'],(args, session) => {listNiceOnes(session);});

function niceOne(args,session) {
    if (!session.conversationData.niceOne) {
        console.log("Key niceOne doesn't exist, creating...");
        session.conversationData.niceOne = {};
    }
    niceOneParser.parse(args,session);
}


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var parser = new ArgParser();
parser.addArg(['m', 'memeify'], memeify);
parser.addArg(['n1', 'niceone'], niceOne);
parser.addArg(['whois'], whois);
parser.addArg(['d', 'detonate'], detonate);

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    // Split on spaces
    var words = session.message.text.split(' ');
    if(words[0] === '@botguy') {
        // cut off the @botguy part of the message
        words = words.slice(1);
    }
    words = words.join(' ');
    parser.parse(words,session);
});
