// set up environment
//require('dotenv').config();

var restify = require('restify');
var builder = require('botbuilder');
var ArgParser = require('./argparse.js');

let DEFAULT_MEMEIFY_TIMES = 3;
// talk abut hardcoding amiright
// let ADMIN_ID = 'cole.cherian1';

// retrieve a sender's first name
function getSendersFirstName(session) {
    let name = session.message.user.name;
    return name.split(' ')[0];
}

// memeifies a string
function memeify(args,session) {
    if(args.length === 0){
        session.send('Too few arguments provided, memeify failed.');
        return -1;
    } else {
        let times = args.length == 1 ? DEFAULT_MEMEIFY_TIMES : parseInt(args[0]); 
        let str = args.length == 1 ? args.join(' ') : args.slice(1).join(' ');
        // make an array out of the rest of the arguments
        let chars = [...str];
        console.log('Memeify command received with times argument: ' + times + ' and the string argument: ' + str);
        if (times === NaN) {
            session.send('Invalid number, memeify failed.');
            return -1;
        }
        var output = [];
        for(i = 0; i <= times; i++){
            var word = chars.join(' '.repeat(i));
            word = ' '.repeat(times - i) + word;
            output.push(word);
        }
        // Add "empty string" to the beginning of the output
        output.unshift(getSendersFirstName(session) + ' says:');
        session.send(output.join('\n\n'));
        console.log('Memeify successful, output: ');
        console.log(output.join('\n'));
        return 0;
    }
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
