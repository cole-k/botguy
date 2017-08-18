// set up environment
//require('dotenv').config();

let DEFAULT_MEMEIFY_TIMES = 3;
// talk abut hardcoding amiright
let ADMIN_ID = 'cole.cherian1';

// retrieve's a sender's first name
function getSendersFirstName(session) {
    let name = session.message.user.name;
    return name.split(' ')[0];
}

// memeifies a string
function memeify(args,session) {
    if(args.length == 0){
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
            console.log(i);
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

// whois
function whois(args,session) {
    if(args.length == 0){
        // don't send a message if the whois command isn't applicable
        return -1;
    } else {
        args = args.join(' ');
        if(args === 'here') {
            session.send('I am, ' + getSendersFirstName(session) + '.');
        }
        if(args === 'botguy') {
            session.send('A helpful bot. Maybe.');
        }
    }
}

function niceone(args,session) {
    if (!args){
        return -1;
    }
    if (!session.conversationData.niceOne) {
        console.log("Key niceOne doesn't exist, creating...");
        session.conversationData.niceOne = {};
    }
    if (args[0].toLowerCase() === 'set') {
        var user =  args.slice(1,-1).join(' ');
        var value = parseInt(args[args.length - 1]);
        session.conversationData.niceOne[user.toLowerCase()] = value;
        session.save();
        session.send('Set the nice ones of ' + user + ' to ' + value + '.');
        return 0;
    }
    // remove a user from the nice ones list 
    if (args[0].toLowerCase() === 'remove') { 
        session.send(message.user);
        if (session.message.user.id === ADMIN_ID){
            var user = args.slice(1).join(' ');
            var userKey = user.toLowerCase();
            if(session.conversationData.niceOne[userKey]){
                delete session.conversationData.niceOne[userKey];
            }
            session.save();
            session.send('Removed user ' + userKey + '.');
            return 0;
        }
        return -1;
    }
    // if called with 'get', get the following key's nice ones.
    if (args[0].toLowerCase() === 'get'){
        var user = args.slice(1).join(' ');
        var userKey = user.toLowerCase();
        // If given 'me', try to get the nice ones for the user's first name
        if(userKey === 'me'){
            user = getSendersFirstName(session);
            userKey = user.toLowerCase();
        }
        // If given nothing, get all the nice ones
        if(userKey === ''){
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
            return 0;
        } else {
            let niceOnes = session.conversationData.niceOne[userKey];
            if(!niceOnes){
                niceOnes = 0;
            }
            session.send('Nice ones for ' + user + ': ' + niceOnes);
            return 0;
        }
    }
    user = args.join(' ');
    userKey = user.toLowerCase();
    if(!session.conversationData.niceOne[userKey]) {
        console.log("Key " + userKey + " doesn't exist, creating...");
        session.conversationData.niceOne[userKey] = 1;
    } else {
        session.conversationData.niceOne[userKey] += 1;
    }
    session.save();
    session.send('Nice one, ' + user + '. \n\n Current nice ones: ' + session.conversationData.niceOne[userKey]);
    return 0;
}

var restify = require('restify');
var builder = require('botbuilder');

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

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    // Split on spaces
    words = session.message.text.split(' ');
    if(words[0] === '@botguy') {
        // cut off the @botguy part of the message
        words = words.slice(1);
    }
    // The first word's the command
    command = words[0].toLowerCase();
    // The rest are the arguments
    args = words.slice(1);
    switch(command) {
        case 'm':
            memeify(args,session);
            break;
        case 'memeify':
            memeify(args,session);
            break;
        case 'whois':
            whois(args,session);
            break;
        case 'niceone':
            niceone(args,session);
            break;
        case 'n1':
            niceone(args,session);
            break;
        case 'n':
            niceone(args,session);
            break;
    }
});
