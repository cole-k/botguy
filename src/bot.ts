import { ActivityHandler, MessageFactory } from 'botbuilder';
import { TurnContext } from 'botbuilder-core';
import { CommandParser } from './CommandParser';
import { NiceOneHandler } from './niceone';
import { simpleMessage } from './utils';

export class BotGuyBot extends ActivityHandler {
    constructor() {
        super();
        const parser = new CommandParser( async (command, _params, context, next) => {
            // default response
            await simpleMessage(`Unrecognized command: ${ command }.`, context, next);
        });
        parser.addArg(['whois'], async (param, context, next) => {
            let replyText = 'Did you meant to ask ```whois here``` ?';
            if (param.toLowerCase() === 'here') {
                replyText = `I am, ${ context.activity.from.name }.`;
            }
            await simpleMessage(replyText, context, next);
        });
        const niceOneHandler = new NiceOneHandler();
        // probably needed to capture the closure...
        parser.addArg(['niceone', 'n1'], async (param, context, next) => niceOneHandler.handle(param, context, next));
        this.onMessage(async (context, next) => {
            console.log(`Received message from id: ${ context.activity.from.id }, name: ${ context.activity.from.name }`);
            console.log(`Message contents: ${ context.activity.text }`);
            TurnContext.getMentions(context.activity).forEach( (mention) => console.log(`Mentioned ${ mention.name } (id ${ mention.id })`));
            let message = context.activity.text;
            const messageArgs = context.activity.text.split(' ');
            // strip the mention if it's there
            if (messageArgs[0] === 'realbotguy' || messageArgs[0] === '@realbotguy') {
                let message = messageArgs.slice(1).join(' ');
            }
            await parser.parse(message, context, next);
        });

        // this.onMembersAdded(async (context, next) => {
        //     const membersAdded = context.activity.membersAdded;
        //     const welcomeText = 'Hello and welcome!';
        //     for (const member of membersAdded) {
        //         if (member.id !== context.activity.recipient.id) {
        //             await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
        //         }
        //     }
        //     // By calling next() you ensure that the next BotHandler is run.
        //     await next();
        // });
    }
}
