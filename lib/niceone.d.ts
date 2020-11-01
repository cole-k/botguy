import { CommandParser } from './CommandParser';
export declare class NiceOneHandler {
    parser: CommandParser;
    constructor();
    handle(param: string, context: any, next: any): Promise<void>;
}
