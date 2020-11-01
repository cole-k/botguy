'use strict';

var ArgParser = require('./argparse.js');

var parser = new ArgParser(helpDefault);
parser.addArg(['memeify','m'],helpMemeify);
parser.addArg(['detonate','d'],helpDetonate);
parser.addArg(['whois'],helpWhois);
parser.addArg(['niceone','n1'],helpNiceOne);
parser.addArg(['yam','y'],helpYam);

function help(args, session) {
    parser.parse(args,session);
}

function helpDefault(args, session) {
    session.send(
        `Learn more about a particular command with _help command_\n
        COMMANDNAME (alts) [flags] args - description\n
        memeify  ( m ) [n] string- 'memeifies' a string\n
        detonate ( d ) [n] string - 'detonates' a string\n
        whois person - ask about a person\n
        niceone ( n1 ) [minus get list] person - give or list niceones\n
        yam ( y ) [random featured get post] - retrieves or posts to the meme machine
        `
    );
}

function helpMemeify(args, session) {
    session.send(
        `Memeify: Takes a string and increases the spaces between its characters successively\n
        Called like: (memeify m) [n] string\n
        Flags:\n
              n - integer parameter (negative means reverse) for number of times (default 3)\n
        Args:\n
              string - string to memeify
        `
    );
}

function helpDetonate(args, session) {
    session.send(
        `Detonate: Takes a string and 'detonates' it\n
        Called like: (detonate d) [n] string\n
        Flags:\n
              n - integer parameter for the type of detonation:\n
              -2 takes transpose and reverses, -1 reverses, 2 takes transpose\n
        Args:\n
              string - string to detonate
        `
    );
}

function helpWhois(args, session) {
    session.send(
        `Whois: Takes a person and describes them\n
        Called like: whois person\n
        Supported people: botguy, here
        `
    );
}

function helpNiceOne(args, session) {
    session.send(
        `Niceone: Give or list nice ones\n
        Called like: (niceone n1) [(minus m) get list] person\n
        Flags:\n
              [no flag] - add a nice one to person\n
              minus ( m ) - subtract a niceone from person (works only if person has >= 1 nice ones)\n
              get - get the nice ones of person (called without a person works the same as list)\n
              list - lists all nice ones (takes no argument)\n
        Args:\n
              person - the target person
        `
    );
}

function helpYam(args, session) {
    session.send(
        `Yam: Retrieve or post to the meme machine (meme-machine.xyz)\n
        Called like: (yam y) [(random r) (featured fe) (first f) (post p)] (id lim) meme\n
        Flags:\n
              [no flag] - Gets the meme at id (if given no id, gets a random meme)\n
              random ( r ) - Gets a random meme\n
              featured ( fe ) - Gets a random featured meme\n
              first ( f ) - Gets the first meme\n
              post ( p ) - Posts the meme given\n
              search (s find) - Searches the machine for the meme
        Args:\n
              id - id of the meme to get (only when called without a flag)\n
              lim - the number of results to return for search\n
                    returns all if 0, indexes from behind if negative\n
              meme - text of the meme to post or search
        `
    );
}

module.exports = help;
