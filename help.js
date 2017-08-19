'use strict';

var ArgParser = require('./argparse.js');

var parser = new ArgParser(helpDefault);
/*parser.addArg(['memeify','m'],helpMemeify);
parser.addArg(['detonate','d'],helpDetonate);
parser.addArg(['whois'],helpWhois);
parser.addArg(['niceone','n1'],helpNiceOne);
parser.addArg(['yam','y'],helpYam);*/

function help(args, session) {
    parser.parse(args,session);
}

function helpDefault(args, session) {
    session.send(
        ` Learn more about a particular command with _help command_
        COMMANDNAME (alts) [flags] args - description
        memeify (m) [n] string- 'memeifies' a string\n
        detonate (d) [n] string - 'detonates' a string\n
        whois string - ask about a person\n
        niceone (n1) [minus get list] person - give or list niceones\n
        yam (y) [random featured get post] - retrieves or posts to the meme machine\n
        `
    );
}

module.exports = help;
