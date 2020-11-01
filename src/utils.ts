import { MessageFactory } from 'botbuilder';
import { TurnContext } from 'botbuilder';

export async function simpleMessage(text: string, context: TurnContext) {
    await context.sendActivity(MessageFactory.text(text, text));
}

interface Mention {
    name: string,
    id: string
}

export function extractMentions(context: TurnContext): Array<Mention> {
    let rawMentions = TurnContext.getMentions(context.activity);
    // strip the mention of the bot if in a group
    if (context.activity.conversation.isGroup) {
        rawMentions = rawMentions.slice(1);
    }
    return rawMentions.flatMap( (rawMention) => {
        const nameResult = />(.+)</.exec(rawMention.text);
        if (nameResult === null) {
            console.log(`ERR: extractMentions name regex does not match ${ rawMention.text }. Skipping mention.`);
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

export function nubBy(array, selector: (entry) => any) {
    const map = new Map();
    array.forEach( (entry) => {
        const selected = selector(entry);
        if (!map.has(selected)) {
            map.set(selected, entry);
        }
    });
    // probably better to return an iterable, but I want to chck if the length
    // is 0.
    return [... map.values()];
}
