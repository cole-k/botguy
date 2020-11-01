import { simpleMessage } from './utils';
import { CommandParser } from './CommandParser';
const db = require('../models/index.js');

export class NiceOneHandler {
    parser: CommandParser;
    constructor() {
        this.parser = new CommandParser( async (command, _params, context, next) => {
            // default response
            await simpleMessage(`Unrecognized command: ${ command }.`, context, next);
        });
        this.parser.addArg(['list'], async (params, context, next) => await listNiceOnes(params, context, next));
    }

    async handle(param: string, context, next) {
        if (param === '') {
            // Special case: if there is no body, message looks like @botguy
            // niceone, which means it is a niceone for botguy himself.
            await addNiceOne(context.activity.recipient.id, context.activity.recipient.name, context, next);
        } else {
          await this.parser.parse(param, context, next);
        }
    }
}

async function addNiceOne(userId, userName, context, next) {
    console.log(`looking up nice ones for ${ userName }, id: ${ userId }.`);
    await db.User.findOrCreate({where: {skypeId: userId},
                                defaults: {niceOnes: 0,
                                           name: userName}
    });
    console.log("looked up nice ones.");
    await db.User.increment('niceOnes', {
        where: {skypeId: userId},
        by: 1,
        returning: true
    }).then( async ([rows, _count]) => {
        const row = rows[0][0];
        await simpleMessage(`Nice one, ${ row.name }. Count: ${ row.niceOnes }.`, context, next);
    });
}

async function listNiceOnes(count, context, next) {
    let limit = 20;
    if (count !== '') {
        limit = parseInt(count);
        if (isNaN(limit)) {
            await simpleMessage(`Unrecognized count: ${ count }`, context, next);
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
        await simpleMessage(messageArr.join('\n\n'), context, next);
    });
}
