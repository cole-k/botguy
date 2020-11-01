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
exports.NiceOneHandler = void 0;
const utils_1 = require("./utils");
const CommandParser_1 = require("./CommandParser");
const db = require('../models/index.js');
class NiceOneHandler {
    constructor() {
        this.parser = new CommandParser_1.CommandParser((_command, _params, context, next) => __awaiter(this, void 0, void 0, function* () {
            yield addNiceOneForEachUniqueMention(context);
            yield next();
        }));
        this.parser.addArg(['list'], (params, context, next) => __awaiter(this, void 0, void 0, function* () {
            yield listNiceOnes(params, context);
            yield next();
        }));
    }
    handle(param, context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (param === '') {
                // Special case: if there is no body, message looks like @realbotguy
                // niceone, which means it is a niceone for realbotguy himself.
                yield addNiceOne(context.activity.recipient.id, context.activity.recipient.name, context);
                yield next();
            }
            else {
                yield this.parser.parse(param, context, next);
            }
        });
    }
}
exports.NiceOneHandler = NiceOneHandler;
function addNiceOne(userId, userName, context) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(`looking up nice ones for ${ userName }, id: ${ userId }.`);
        yield db.User.findOrCreate({ where: { skypeId: userId },
            defaults: { niceOnes: 0,
                name: userName }
        });
        // console.log("looked up nice ones.");
        yield db.User.increment('niceOnes', {
            where: { skypeId: userId },
            by: 1,
            returning: true
        }).then(([rows, _count]) => __awaiter(this, void 0, void 0, function* () {
            const row = rows[0][0];
            yield utils_1.simpleMessage(`Nice one, ${row.name}. Count: ${row.niceOnes}.`, context);
        }));
    });
}
function addNiceOneForEachUniqueMention(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const uniqueMentions = utils_1.nubBy(utils_1.extractMentions(context), (mention) => mention.id);
        if (uniqueMentions.length === 0) {
            yield utils_1.simpleMessage(`Nice one, ${context.activity.from.name}, you didn't mention anyone to receive a nice one.`, context);
            return;
        }
        yield uniqueMentions.forEach((mention) => __awaiter(this, void 0, void 0, function* () {
            yield addNiceOne(mention.id, mention.name, context);
        }));
    });
}
function listNiceOnes(count, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let limit = 20;
        if (count !== '') {
            limit = parseInt(count);
            if (isNaN(limit)) {
                yield utils_1.simpleMessage(`Unrecognized count: ${count}`, context);
                return;
            }
        }
        yield db.User.findAll({
            attributes: ['name', 'niceOnes'],
            order: [['niceOnes', 'DESC']],
            limit: limit
        }).then((rows) => __awaiter(this, void 0, void 0, function* () {
            let messageArr = rows.map((row) => `${row.name}: ${row.niceOnes}`);
            messageArr.unshift('Nice ones');
            yield utils_1.simpleMessage(messageArr.join('\n\n'), context);
        }));
    });
}
//# sourceMappingURL=niceone.js.map