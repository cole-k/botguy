import { ActivityHandler, MessageFactory } from 'botbuilder';
import { CommandParser } from './CommandParser';
import { NiceOneHandler } from './niceone';
import { simpleMessage, nubBy } from './utils';

export class BotGuyBot extends ActivityHandler {
    constructor() {
        super();
        const parser = new CommandParser( async (command, _params, context, next) => {
            // default response
            await simpleMessage(`Unrecognized command: ${ command }.`, context);
            await next();
        });
        parser.addArg(['whois'], async (param, context, next) => {
            let replyText = 'Did you meant to ask ```whois here``` ?';
            if (param.toLowerCase() === 'here') {
                replyText = `I am, ${ context.activity.from.name }.`;
            }
            await simpleMessage(replyText, context);
            await next();
        });
        const niceOneHandler = new NiceOneHandler();
        // probably needed to capture the closure...
        parser.addArg(['niceone', 'n1'], async (param, context, next) => niceOneHandler.handle(param, context, next));
        this.onMessage(async (context, next) => {
            console.log(`Received message: ${ context.activity.text } from ${ context.activity.from.name }, id: ${ context.activity.from.id }`);
            let message = context.activity.text;
            const messageArgs = context.activity.text.split(' ');
            // strip the mention of the bot if in a group
            if (context.activity.conversation.isGroup) {
                message = messageArgs.slice(1).join(' ');
            }
            await parser.parse(message, context, next);
        });
    }
}
