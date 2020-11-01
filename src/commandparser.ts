export class CommandParser {
    args: Record<string, (param: string, context, next) => void>;
    onParseFailure: (command: string, param: string, context, next) => void;
    constructor(onParseFailure=async (_command, _param, _context, _next) => {}) {
        this.args = {};
        this.onParseFailure = onParseFailure;
    }

    addArg(args: string[], callback) {
        args.forEach( arg => this.args[arg] = callback );
    }

    async parse(message: string, context, next) {
        const messageArgs = message.split(' ');
        // strip the mention
        if (messageArgs[0] === 'realbotguy' || messageArgs[0] === '@realbotguy') {
            messageArgs.slice(1);
        }
        const command = messageArgs[0];
        const param = messageArgs.slice(1).join(' ');
        if (command in this.args) {
            await this.args[command](param, context, next);
        } else {
            await this.onParseFailure(command, param, context, next)
        }
    }
}
