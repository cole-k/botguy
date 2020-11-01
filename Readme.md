# botguy

botguy (Skype handle: `thebotguy`) is a Skype bot I've built for a Skype group chat that my friends and I use daily.

He does a lot of odd jobs (in both senses of the word), like allow users to commend each other by saying "nice one" ([niceone.js](/niceone.js)) or query and post to our - sigh - meme machine ([yam.js](/yam.js)), which I refuse to link to but you can find a link to in my code.

You probably are confused and maybe a little disgusted by botguy's existence. I don't blame you. However, what little capacity for shame I possessed was stripped from me when frugality took the reins (seeing as private repos would cost me).

botguy will continue to evolve until he either

1. Reaches completion (likelihood: 0-1%)
2. Is abandoned by me (likelihood: 10-20%)
3. Is abandoned when our group disintigrates or finally migrates to a better group chat platform not supported by Microsoft's botframework (likelihood: 0-10%)

If this repo looks dead, one of these three things probably happened, even though I gave each a relativley low chance.

I'll try to keep this readme updated with botguy's most salient features, though the most up-to-date description of what botguy does will likely be in the help file ([help.js](/help.js)).

This bot has been created using [Bot Framework](https://dev.botframework.com).

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```

## To run the bot

- Install modules

    ```bash
    npm install
    ```
- Start the bot

    ```bash
    npm start
    ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.9.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Deploy the bot to Azure

### Publishing Changes to Azure Bot Service

    ```bash
    # build the TypeScript bot before you publish
    npm run build
    ```

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [TypeScript](https://www.typescriptlang.org)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)
