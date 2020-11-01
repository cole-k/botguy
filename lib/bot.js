"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotGuyBot = void 0;
const botbuilder_1 = require("botbuilder");
const botbuilder_core_1 = require("botbuilder-core");
const CommandParser_1 = require("./CommandParser");
const niceone_1 = require("./niceone");
const utils_1 = require("./utils");
class BotGuyBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        const parser = new CommandParser_1.CommandParser((command, _params, context, next) => __awaiter(this, void 0, void 0, function* () {
            // default response
            yield utils_1.simpleMessage(`Unrecognized command: ${command}.`, context, next);
        }));
        parser.addArg(['whois'], (param, context, next) => __awaiter(this, void 0, void 0, function* () {
            let replyText = 'Did you meant to ask ```whois here``` ?';
            if (param.toLowerCase() === 'here') {
                replyText = `I am, ${context.activity.from.name}.`;
            }
            yield utils_1.simpleMessage(replyText, context, next);
        }));
        const niceOneHandler = new niceone_1.NiceOneHandler();
        // probably needed to capture the closure...
        parser.addArg(['niceone', 'n1'], (param, context, next) => __awaiter(this, void 0, void 0, function* () { return niceOneHandler.handle(param, context, next); }));
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Received message from id: ${context.activity.from.id}, name: ${context.activity.from.name}`);
            console.log(`Message contents: ${context.activity.text}`);
            botbuilder_core_1.TurnContext.getMentions(context.activity).forEach((mention) => console.log('Mentioned ${ mention.name } (id ${ mention.id })'));
            const messageArgs = context.activity.text.split(' ');
            // strip the mention if it's there
            if (messageArgs[0] === 'realbotguy' || messageArgs[0] === '@realbotguy') {
                messageArgs.slice(1);
            }
            yield parser.parse(messageArgs.join(' '), context, next);
        }));
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
exports.BotGuyBot = BotGuyBot;
//# sourceMappingURL=bot.js.map