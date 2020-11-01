export declare class CommandParser {
    args: Record<string, (param: string, context: any, next: any) => void>;
    onParseFailure: (command: string, param: string, context: any, next: any) => void;
    constructor(onParseFailure?: (_command: any, _param: any, _context: any, _next: any) => Promise<void>);
    addArg(args: string[], callback: any): void;
    parse(message: string, context: any, next: any): Promise<void>;
}
