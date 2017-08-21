// set up environment
//require('dotenv').config();

/* botguy setup */

let DEBUG = true;

    // modules 
var restify = require('restify'),
    builder = require('botbuilder'),
    ArgParser = require('./argparse.js'),
    helper = require('./helper.js'),
    // individual functions 
    memeify = require('./memeify.js'),
    detonate = require('./detonate.js'),
    niceOne = require('./niceone.js'),
    yam = require('./yam.js'),
    help = require('./help.js');

var parser = new ArgParser();
parser.addArg(['m', 'memeify'], memeify);
parser.addArg(['n1', 'niceone'], niceOne);
parser.addArg(['whois'], whois);
parser.addArg(['d', 'detonate'], detonate);
parser.addArg(['thank','thanks'], thank);
parser.addArg(['e', 'echo'], (arg, session) => {session.send(arg);});
parser.addArg(['h', 'help'], help);
parser.addArg(['y', 'yam'], yam);

// shorter functions are defined in the body to avoid an excess of files

var whoisParser = new ArgParser();
whoisParser.addArg(['here'], (args,session) => {
    session.send('I am, ' + helper.getSendersFirstName(session) + '.');
});
whoisParser.addArg(['botguy'], (args,session) => {
    session.send('A helpful bot. Maybe.');
});

// whois
function whois(args,session) {
    whoisParser.parse(args,session);
}

function thank(args, session) {
    session.send("You're welcome, " + helper.getSendersFirstName(session) + '.');
}

/* Default bot setup */

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

var bot = new builder.UniversalBot(connector, function (session) {
    // Split on spaces
    var words = session.message.text.split(/\s+/);
    if((words[0] === '@botguy') || (words[0] === 'botguy')) {
        // cut off the @botguy part of the message if he's being mentioned
        words = words.slice(1);
    }
    words = words.join(' ');
    // let people know botguy's received a message by sending a typing indicator
    session.sendTyping();
    if (DEBUG) {
        session.send(helper.getSendersFirstName(session) + ' says: ' + session.message.text);
        session.send('Parsing the command: ' + words);
    }
    parser.parse(words,session);
});
