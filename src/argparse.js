'use strict';
class ArgParser {

    constructor(defaultCallback=() => {}) {
        this._args = {};
        this._defaultCallback = defaultCallback;
    }

    setDefaultCallback(defaultCallback) {
        this._defaultCallback = defaultCallback;
    }

    addArg(args,callback) {
        var local_args = this._args
        args.forEach( function(arg) {
            local_args[arg] = callback;
        });
    }

    parse(args, session) {
        var parts = args.split(' '),
            command = parts[0],
            param = parts.slice(1).join(' ');
        // If the command isn't recognized, call the default callback
        if(Object.keys(this._args).indexOf(command) === -1) {
            return this._defaultCallback(args, session);
        } else {
            return this._args[command](param, session);
        }
    }

}

module.exports = ArgParser;
