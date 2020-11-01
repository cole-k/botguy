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
exports.simpleMessage = void 0;
const botbuilder_1 = require("botbuilder");
function simpleMessage(text, context, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.sendActivity(botbuilder_1.MessageFactory.text(text, text));
        // ensure next BotHandler is run.
        yield next();
    });
}
exports.simpleMessage = simpleMessage;
//# sourceMappingURL=utils.js.map