import { TurnContext } from 'botbuilder';
export declare function simpleMessage(text: string, context: TurnContext): Promise<void>;
interface Mention {
    name: string;
    id: string;
}
export declare function extractMentions(context: TurnContext): Array<Mention>;
export declare function nubBy(array: any, selector: (entry: any) => any): any[];
export {};
