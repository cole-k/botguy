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
const CommandParser_1 = require("./CommandParser");
const niceone_1 = require("./niceone");
const utils_1 = require("./utils");
class BotGuyBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        console.log(utils_1.nubBy([1, 2, 3, 4], (x) => x));
        console.log(utils_1.nubBy([1, 2, 3, 4], (x) => 0));
        const parser = new CommandParser_1.CommandParser((command, _params, context, next) => __awaiter(this, void 0, void 0, function* () {
            // default response
            yield utils_1.simpleMessage(`Unrecognized command: ${command}.`, context);
            yield next();
        }));
        parser.addArg(['whois'], (param, context, next) => __awaiter(this, void 0, void 0, function* () {
            let replyText = 'Did you meant to ask ```whois here``` ?';
            if (param.toLowerCase() === 'here') {
                replyText = `I am, ${context.activity.from.name}.`;
            }
            yield utils_1.simpleMessage(replyText, context);
            yield next();
        }));
        const niceOneHandler = new niceone_1.NiceOneHandler();
        // probably needed to capture the closure...
        parser.addArg(['niceone', 'n1'], (param, context, next) => __awaiter(this, void 0, void 0, function* () { return niceOneHandler.handle(param, context, next); }));
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Received message: ${context.activity.text} from ${context.activity.from.name}, id: ${context.activity.from.id}`);
            let message = context.activity.text;
            const messageArgs = context.activity.text.split(' ');
            // strip the mention of the bot if in a group
            if (context.activity.conversation.isGroup) {
                message = messageArgs.slice(1).join(' ');
            }
            yield parser.parse(message, context, next);
        }));
    }
}
exports.BotGuyBot = BotGuyBot;
//# sourceMappingURL=bot.js.map