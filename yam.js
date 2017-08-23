const req = require('tinyreq'),
    cheerio = require('cheerio'),
    scrape = require('./webscraper.js'),
    helper = require('./helper.js'),
    ArgParser = require('./argparse.js'),
    
    DEFAULT_QUERY_LIMIT = 7;

parser = new ArgParser(defaultYam);
parser.addArg(['random','r'],(args, session) => {randomYam(session)});
parser.addArg(['featured','fe'], (args, session) => {randomFeaturedYam(session)});
parser.addArg(['first','f'], (args,session) => {firstYam(session)});
parser.addArg(['search','s','find'], searchYam);
parser.addArg(['post','p'], postYam); 

function yam(args, session) {
    parser.parse(args,session);
}

function defaultYam(args, session) {
    // if called with no arguments, return a random yam
    if(args.length === 0) {
        randomYam(session);
    }
    let ID = parseInt(args);
    // if we're not given a number or valid ID, do nothing
    if(isNaN(ID)) {
        return -1;
    } else {
       yamWithID(ID, session);
    }
}

function randomYam(session) {
    scrape('http://meme-machine.xyz', {
        key: 'ul'
    }, (err, data) => {
        if (err) { console.log(err);}
        else {
            let regular = data['ul'].last().children('li');
                index = Math.floor(Math.random() * regular.length),
                item = regular.eq(index).children('a').first(),
                id = item.attr('id'),
                yam = 'No. ' + id + ': ' + item.text().replace(/\n/,'');
            session.send(yam);
        }
    });

}

function randomFeaturedYam(session) {
    scrape('http://meme-machine.xyz', {
        key: 'ul'
    }, (err, data) => {
        if (err) { console.log(err);}
        else {
            let featured = data['ul'].first().children('li'),
                index = Math.floor(Math.random() * featured.length),
                item = featured.eq(index).children('a').first(),
                id = item.attr('href').match(/\d+$/),
                yam = 'No. ' + id + ': ' + item.text().replace(/\n/,'');
            session.send(yam);
        }
    });

}

function yamWithID(ID, session) {
    scrape('http://meme-machine.xyz', {
        id: '#'.concat(ID)
    }, (err, data) => {
        if (err) { console.log(err);}
        else {
            let yam = data['#'.concat(ID)].text().replace(/\n/,'');
            if (yam) {
                session.send('No. ' + ID + ': ' + yam);
            }
        }
    });
}

function getFirstYam(callback) {
    scrape('http://meme-machine.xyz', {
        key: 'ul'
    }, (err, data) => {
        if (err) { 
            console.log(err);
        }
        else {
            let regular = data['ul'].last().children('li');
                item = regular.first().children('a').first(),
                id = item.attr('id'),
                yam = item.text().replace(/\n/,'');
            callback(yam,id);
        }
    });
}

function firstYam(session) {
    getFirstYam((yam, id) => {session.send('No. ' + id  + ': ' + yam);});
}

function searchYam(args, session,){ 
    let output = helper.parseIntArg(args, 'Search', DEFAULT_QUERY_LIMIT, session),
        query = output[0],
        limit = output[1];
        
    req('http://meme-machine.xyz', (err, body) => {
        if (err) { return callback(err);}

        let $ = cheerio.load(body),
            regular = $('ul').last().children('li');
            results = regular.filter( (i,el) => {
                return $(el).children('a').first().text().toLowerCase().includes(query.toLowerCase());
            }),
            output = [];
        results.each( (i,el) => {
            let yam = $(el).children('a').first(),
                text = yam.text().replace(/\n/,''),
                id = yam.attr('id');
            output.push('No. ' + id + ': ' + text);
        }); 
        // if less than zero, index from the back
        if(limit < 0) {
            output = output.slice(output.length + limit);
        // otherwise, limit from the front
        } else if(limit >  0) {
            output = output.slice(0,limit);
        }
        // note that if it's equal to 0, we don't slice at all
        if(output.length > 0){
            output.unshift('Showing ' + output.length + ' of ' + results.length);
            session.send(output.join('\n\n'));
        } else {
            session.send('No results found for query: ' + query);
        }
    });
}

function postYam(yam, session) {
     session.send('Attempting to post: ' + yam + '...');
     req({
         url: 'http://meme-machine.xyz',
        method: 'POST',
        data: {'meme': yam}
        },
         (err, body) => {
             if(err) {
                 console.log(err);
             }else {
                var thisYam = yam.replace(/\n/,'')
                getFirstYam( (firstYam, id) => {
                console.log(firstYam, thisYam);
                if (firstYam === thisYam) {
                    session.send('Created No. ' + id + ': ' + yam);
                }
                });
             }
         }
     );
}

module.exports = yam;
