import { ActivityHandler, MessageFactory } from 'botbuilder';
import { CommandParser } from './commandparser';
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
            await parser.parse(context.activity.text, context, next);
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
