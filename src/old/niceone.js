var helper = require('./helper.js'),
    ArgParser = require('./argparse.js'),
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
        user = helper.getSendersFirstName(session);
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

module.exports = niceOne;
