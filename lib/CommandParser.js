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
exports.CommandParser = void 0;
class CommandParser {
    constructor(onParseFailure = (_command, _param, _context, _next) => __awaiter(this, void 0, void 0, function* () { })) {
        this.args = {};
        this.onParseFailure = onParseFailure;
    }
    addArg(args, callback) {
        args.forEach(arg => this.args[arg] = callback);
    }
    parse(message, context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageArgs = message.split(' ');
            // strip the mention
            if (messageArgs[0] === 'realbotguy' || messageArgs[0] === '@realbotguy') {
                messageArgs.slice(1);
            }
            const command = messageArgs[0];
            const param = messageArgs.slice(1).join(' ');
            if (command in this.args) {
                yield this.args[command](param, context, next);
            }
            else {
                yield this.onParseFailure(command, param, context, next);
            }
        });
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=CommandParser.js.map