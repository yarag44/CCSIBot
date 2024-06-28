import { ActivityHandler, MessageFactory, CardFactory } from 'botbuilder';
import {GoCCSIDialog} from './goCCSIDialog';

const WELCOMED_USER = 'welcomedUserProperty';

export class EchoBot extends ActivityHandler {
    
    conversationState: any;
    userState:any;
    dialogState:any;
    previousIntent:any;
    conversationData:any;
    goCCSIDialog:any;  
    welcomedUserProperty: any;

    constructor(conversationState,userState) {
        super();

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.conversationState = conversationState;
        this.userState= userState;
        this.dialogState= conversationState.createProperty("dialogState");
        this.goCCSIDialog = new GoCCSIDialog(conversationState,userState);
    
        this.previousIntent = this.conversationState.createProperty("previousIntent");
        this.conversationData = this.conversationState.createProperty("conversationData");
    
       

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // const replyText = `Echo: ${ context.activity.text }`;
            // await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.

            await this.dispatchToIntentAsync(context);


            await next();
        });

        this.onDialog(async (context, next) => {

            await this.conversationState.saveChanges(context,false);
            await this.userState.saveChanges(context,false);
            await next();

        });

        this.onMembersAdded(async (context, next) => {

              //const membersAdded = context.activity.membersAdded;
              await this.sendWelcomeMessage(context);

              // for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
              //     if (membersAdded[cnt].id !== context.activity.recipient.id) {
              //         await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
              //     }
              // }
              // By calling next() you ensure that the next BotHandler is run.
              await next();


            // const membersAdded = context.activity.membersAdded;
            // const welcomeText = 'Hello and welcome!';
            // for (const member of membersAdded) {
            //     if (member.id !== context.activity.recipient.id) {
            //         await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            //     }
            // }
            // // By calling next() you ensure that the next BotHandler is run.
            // await next();
        });
    }

    async sendWelcomeMessage(turnContext) {
        const {activity} = turnContext;

         for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Welcome to CCSIBot !!!.`; //${activity.membersAdded[idx].name}
                await turnContext.sendActivity(welcomeMessage);

                const rulesCCSIBotStart = 'CCSIBot provide all information about our Knowledgebase.'
                await turnContext.sendActivity(rulesCCSIBotStart);
                
                const rulesCCSIBotStep1 = "All information on this site is for the exclusive use of Call Center Services International employees.The misuse or sharing without formal authorization constitutes a violation of the internal information security regulations and may have legal consequences.";
                await turnContext.sendActivity(rulesCCSIBotStep1);

                const rulesCCSIBotStep2 = "@Copyright 2024. GoCCSI All Rights Reserved.";
                await turnContext.sendActivity(rulesCCSIBotStep2);
                
                const rulesCCSIBotStep3 = "Operative : Click option about your concern.";
                await turnContext.sendActivity(rulesCCSIBotStep3);

                await this.sendSuggestedActions(turnContext);
                //await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            }
        }


    }

    async sendSuggestedActions(turnContext) {
        var reply = MessageFactory.suggestedActions(['View Categories'],'What would you like to know today?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToIntentAsync(context){

        var currentIntent = '';
        const previousIntent = await this.previousIntent.get(context,{});
        const conversationData = await this.conversationData.get(context,{});

        if(previousIntent.intentName && conversationData.endDialogProp === false)
        {
            currentIntent = previousIntent.intentName;
        }
        else if (previousIntent.intentName && conversationData.endDialogProp === true)
        {
            currentIntent = context.activity.text;
        }
        else
        {
            currentIntent = context.activity.text;
            await this.previousIntent.set(context,{intentName : context.activity.text});
        }

        console.log('data dispatchToIntentAsync');
        
        console.log(currentIntent);
        console.log(conversationData.endDialogProp);

        switch(currentIntent)
        {

            case 'View Categories':
                //console.log('Selecciono GoCCSI');
                // console.log('Palabra Recibida' + context.activity.text);
                // console.log('GoCCSI');
                // console.log(this.dialogState);

                await this.conversationData.set(context, {endDialogProp : false});
                await this.goCCSIDialog.run(context,this.dialogState);

                //console.log('this.goCCSIDialog.isDialogComplete()');
                
                //console.log(this.goCCSIDialog.isDialogComplete());
                
                conversationData.endDialogProp = this.goCCSIDialog.isDialogComplete();
                if(conversationData.endDialogProp===true)
                {
                    await this.sendSuggestedActions(context);
                }
                
            break;

            default:

                await this.conversationData.set(context, {endDialogProp : false});
                await this.goCCSIDialog.run(context,this.dialogState);

                //console.log('this.goCCSIDialog.isDialogComplete()');
                
                //console.log(this.goCCSIDialog.isDialogComplete());
                
                // const rulesCCSIBotStep = "Incorrect Option. Please Click Option Bellow ? ";
                // await context.sendActivity(rulesCCSIBotStep);

                conversationData.endDialogProp = this.goCCSIDialog.isDialogComplete();
                if(conversationData.endDialogProp===true)
                {
                    await this.sendSuggestedActions(context);
                }    


                //console.log('Did Not match CCSIBot');
            break;


        }


    }



}
