import { MessageFactory } from 'botbuilder';

export async function simpleMessage(text: string, context, next) {
    await context.sendActivity(MessageFactory.text(text, text));
    // ensure next BotHandler is run.
    await next();
}
