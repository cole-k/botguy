import { simpleMessage, extractMentions, nubBy } from './utils';
import { CommandParser } from './CommandParser';
const db = require('../models/index.js');

export class NiceOneHandler {
    parser: CommandParser;
    constructor() {
        this.parser = new CommandParser( async (_command, _params, context, next) => {
            await addNiceOneForEachUniqueMention(context);
            await next();
        });
        this.parser.addArg(['list'], async (params, context, next) => {
            await listNiceOnes(params, context);
            await next();
        });
    }

    async handle(param: string, context, next) {
        if (param === '') {
            // Special case: if there is no body, message looks like @realbotguy
            // niceone, which means it is a niceone for realbotguy himself.
            await addNiceOne(context.activity.recipient.id, context.activity.recipient.name, context);
            await next();
        } else {
          await this.parser.parse(param, context, next);
        }
    }
}

async function addNiceOne(userId, userName, context) {
    // console.log(`looking up nice ones for ${ userName }, id: ${ userId }.`);
    await db.User.findOrCreate({where: {skypeId: userId},
                                defaults: {niceOnes: 0,
                                           name: userName}
    });
    // console.log("looked up nice ones.");
    await db.User.increment('niceOnes', {
        where: {skypeId: userId},
        by: 1,
        returning: true
    }).then( async ([rows, _count]) => {
        const row = rows[0][0];
        await simpleMessage(`Nice one, ${ row.name }. Count: ${ row.niceOnes }.`, context);
    });
}

async function addNiceOneForEachUniqueMention(context) {
    const uniqueMentions = nubBy(extractMentions(context), (mention) => mention.id);
    if ( uniqueMentions.length === 0 ) {
        await simpleMessage(`Nice one, ${ context.activity.from.name }, you didn't mention anyone to receive a nice one.`, context);
        return;
    }
    await uniqueMentions.forEach( async (mention) => {
        await addNiceOne(mention.id, mention.name, context);
    });
}

async function listNiceOnes(count, context) {
    let limit = 20;
    if (count !== '') {
        limit = parseInt(count);
        if (isNaN(limit)) {
            await simpleMessage(`Unrecognized count: ${ count }`, context);
            return;
        }
    }
    await db.User.findAll({
        attributes: ['name', 'niceOnes'],
        order: [['niceOnes', 'DESC']],
        limit: limit
    }).then( async (rows) => {
        let messageArr = rows.map( (row) => `${ row.name }: ${ row.niceOnes }`);
        messageArr.unshift('Nice ones');
        await simpleMessage(messageArr.join('\n\n'), context);
    });
}
