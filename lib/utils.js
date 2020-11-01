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
exports.nubBy = exports.extractMentions = exports.simpleMessage = void 0;
const botbuilder_1 = require("botbuilder");
const botbuilder_2 = require("botbuilder");
function simpleMessage(text, context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.sendActivity(botbuilder_1.MessageFactory.text(text, text));
    });
}
exports.simpleMessage = simpleMessage;
function extractMentions(context) {
    let rawMentions = botbuilder_2.TurnContext.getMentions(context.activity);
    // strip the mention of the bot if in a group
    if (context.activity.conversation.isGroup) {
        rawMentions = rawMentions.slice(1);
    }
    return rawMentions.flatMap((rawMention) => {
        const nameResult = />(.+)</.exec(rawMention.text);
        if (nameResult === null) {
            console.log(`ERR: extractMentions name regex does not match ${rawMention.text}. Skipping mention.`);
            // Empty array means nothing is returned, since everything gets
            // flatMapped.
            return [];
        }
        // Note this is a singleton array, but gets flatMapped.
        return [{
                // First capture group is the name.
                name: nameResult[1],
                id: rawMention.mentioned.id
            }];
    });
}
exports.extractMentions = extractMentions;
function nubBy(array, selector) {
    const map = new Map();
    array.forEach((entry) => {
        const selected = selector(entry);
        if (!(selected in map)) {
            map[selected] = entry;
        }
    });
    return [...map.values()];
}
exports.nubBy = nubBy;
//# sourceMappingURL=utils.js.map