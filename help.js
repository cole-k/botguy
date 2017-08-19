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
        ` Learn more about a particular command with {code}help command{code}\n
        {code}COMMANDNAME (alts) [flags] args{code} - description\n
        {code}memeify (m) [n] string{code}- 'memeifies' a string\n
        {code}detonate (d) [n] string{code} - 'detonates' a string\n
        {code}whois string{code} - ask about a person\n
        {code}niceone (n1) [minus get list] person{code} - give or list niceones\n
        {code}yam (y) [random featured get post]{code} - retrieves or posts to the meme machine\n
        `
    );
}

module.exports = help;
