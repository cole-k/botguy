// set up environment
//require('dotenv').config();

let DEFAULT_MEMEIFY_TIMES = 3;

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
    // The first word's the command
    command = words[0].toLowerCase();
    // The rest are the arguments
    args = words.slice(1);
    switch(command) {
        case '!m':
            memeify(args,session);
            break;
        case '!memeify':
            memeify(args,session);
            break;
        case '!whois':
            whois(args,session);
            break;
    }
});
