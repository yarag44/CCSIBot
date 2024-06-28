import { WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus } from 'botbuilder-dialogs';
import {ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt} from 'botbuilder-dialogs';
import {ActionTypes, ActivityTypes, CardFactory} from 'botbuilder';
//import { htmlToFormattedText }  from 'html-to-formatted-text';
import  { convert } from 'html-to-text';
import { KBDExecutions } from './api/KBD/Articlesapi';


//const { WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

//const { ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');

//const {CardFactory} = require('botbuilder');

//const htmlToFormattedText = require("html-to-formatted-text");

//const { KBDExecutions } = require('../api/KBD/Articlesapi');


//const InfoCard = require('../resources/adaptiveCards/InfoCard');

// const CARDS = {
//     InfoCard
// }


const CHOICE_PROMPT   =  'CHOICE_PROMPT';
const CONFIRM_PROMPT   =  'CONFIRM_PROMPT';
const TEXT_PROMPT   =  'TEXT_PROMPT';
const NUMBER_PROMPT   =  'NUMBER_PROMPT';
const DATETIME_PROMPT   =  'DATETIME_PROMPT';
const WATERFALL_DIALOG   =  'WATERFALL_DIALOG';



export class GoCCSIDialog extends ComponentDialog {

    endDialogProp : any;    
    initialDialogId: string;
    
    constructor(conversationState,userState) {
        super('goCCSIDialog');

        console.log('Constructor la clase');


         //this.conversationState = conversationState;
         //this.conversationData = conversationData;

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new DateTimePrompt(DATETIME_PROMPT));



        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
            this.firstStep.bind(this),
            this.secondStep.bind(this),
            this.thirdStep.bind(this),
            this.confirmStep.bind(this)
            //this.summaryStep.bind(this)
        ]));

           
      
        this.initialDialogId = WATERFALL_DIALOG;
        
       


    }

   


    async run(turnContext,accessor) {

        // console.log('accesor');
        // console.log(accessor);

        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);

        const results = await dialogContext.continueDialog();
        //console.log(results);
        if(results.status === DialogTurnStatus.empty){ 
            await dialogContext.beginDialog(this.id);
        }


    }

    async firstStep (step) {
        
        console.log('first Step');
        //console.log(step);

        var objKDB = new KBDExecutions(); 

        let jsVar = {
            "option" : 0
        }

        let resultKBD = await objKDB.Select_Catalogs(jsVar);

        //console.log(resultKBD);

        //(index + 1).toString() + ' -> ' +
        //xTopic.value.toString() + ' -> ' +

        let arrayTopics = []
        resultKBD && resultKBD.map((xTopic,index) => {

            arrayTopics.push({type: ActionTypes.ImBack, title:  xTopic.label.toString(), value:  xTopic.label.toString()})

            //arrayTopics.push(' -> ' + xTopic.label.toString());
        })
        //console.log(arrayTopics);


        this.endDialogProp= false;

        // const buttons = [
        //     {type: ActionTypes.ImBack, title: '1. Inline Attachment', value: '1'},
        //     {type: ActionTypes.ImBack, title: '2. Internet Attachment', value: '2'},
        //     {type: ActionTypes.ImBack, title: '3. Uploaded Attachment', value: '3'}
        // ];
        //const card =  CardFactory.heroCard('',undefined,arrayTopics,{ text: 'Select Category?' })


        //const reply = {type: ActivityTypes.Message, attachments: [card]};




       let responseStep = await step.context.sendActivity({
            text: step.result,
            attachments : [CardFactory.heroCard('',undefined,arrayTopics,{ text: 'Select Category?' })]
        });

        //step.values.topic = step.result; 
        //return await step.prompt(CHOICE_PROMPT,`Which Topics do you select?`,['GoCCSI','FIS']);

        //return await step.prompt(CHOICE_PROMPT,`Select Category?`,arrayTopics);



        return await step.prompt(TEXT_PROMPT, responseStep);


    }
    
    async secondStep(step) {

        console.log('second Step');
        console.log(step.result);
        
        let arrayCatTopics = []
        var objKBD = new KBDExecutions();

        this.endDialogProp= false;

        //let sidCategory = step.result.value.toString().split(' -> ');
        // let sidCategory = step.result.toString().split(' -> ');

        // console.log(sidCategory.length);
        
        // let idCat = '';
        // if(sidCategory.length >1)
        //     {
                
                //idCat = sidCategory[1]
                let jsVar = {
                    "Option": 0,
                    "idArticle": 0,
                    "idCategories": step.result, //idCat,
                    "idStatus": 0,
                    "title": '',
                    "criteria": ''
                  }
        
                let categoryTopics =  await objKBD.Select_Articles_CCSIBOT(jsVar);
        
                 console.log("categoryTopics");
                   console.log(categoryTopics);
                  
        
               
                arrayCatTopics = []

                categoryTopics && categoryTopics.map((cCatTopic,index) => {
        
                    //cCatTopic.idArticle.toString() + ' -> ' +
                    //cCatTopic.idArticle.toString() + ' -> ' +
                    arrayCatTopics.push({type: ActionTypes.ImBack, title:  cCatTopic.title.toString(), value:  cCatTopic.title.toString()})
        
        
                    //arrayCatTopics.push(' -> ' + cCatTopic.title)
                })

                let responseStep = '';
                if(categoryTopics.length > 0)
                {
                    responseStep = await step.context.sendActivity({
                        text: '',//step.result,
                        attachments : [CardFactory.heroCard('',undefined,arrayCatTopics,{ text: 'Select Article?' })]
                    });
                }
                //let tmpDataSend = responseStep.toString().split(' -> ')
                //console.log(tmpDataSend.length);
                

                //if(tmpDataSend.length > 1)
               

        // }
        //   else

        if(categoryTopics.length <=0)
        {

            //var msg = `No Articles for [ ${sidCategory[1]} ]`;
            var msg = `No Articles Found. Please Select Again !!!  `;
            await step.context.sendActivity(msg);
            this.endDialogProp = true;
            return await step.endDialog();
     
        }
        else
        {
            if(responseStep.toString().length > 0 && categoryTopics.length > 0 )
            {
                // console.log('SPLIT');
                // console.log(tmpDataSend[1]);
                
                //if(tmpDataSend.length > 0)
                    //{return await step.prompt(TEXT_PROMPT, tmpDataSend[1]);}

                    return await step.prompt(TEXT_PROMPT, responseStep);

            }
        }
        // else
        // {

           


            //step.values.topic = step.result; 
            //return await step.prompt(CHOICE_PROMPT,`Topics for ${step.result.value}?`,['How to Login?','How to Check IN/Out?']);


            //return await step.prompt(CHOICE_PROMPT,`Articles for [ ${sidCategory[1]} ] (Type respective Number)?`,arrayCatTopics);


        //}
      
    }

    async thirdStep(step) {

        //  console.log('THIRD Step');
        //  console.log(step.result);
        

        // let sidArticle = step.result.toString().split(' -> ');

        // console.log('sidArticle');
        // console.log(sidArticle[1].toString());
        
        // if(sidArticle.length > 1)
        // {

            var objKBD = new KBDExecutions();

            this.endDialogProp= false;
        //var msg = `You has been selected Topic: [ ${step.result.value} ]`;

            let jsVar = {
                "Option": 0,
                "idArticle": 0,
                "idCategories": '',
                "idStatus": 0,
                "title": step.result, //sidArticle[1].toString(), //step.result.value.toString().replaceAll(' -> ',''),
                "criteria": ''
            }

            let articleData =  await objKBD.Select_Articles_CCSIBOT(jsVar);

        //console.log(articleData);

        // let params = {
        //     title : "GOCCSI - How to Login?",
        //     subTitle : 'Step By step',
        //     imageURL : 'https://storagegoccsi.blob.core.windows.net/containerkbsfiles/kbsfiles/image_20230324145417.jpeg?sv=2021-10-04&si=CCSIPolicy&sr=b&sig=2gBYwnSuhqm1X0HVTQMvJ4KywuFxD30zV7MdKv1KAmU%3D',
        //     description : 'To log in, you must comply with this: You have to be a CCSI employee. Need to have an Employee Number provided by CCSI. You need to have your RFC on hand. You will find your Employee Number and RFC on your CCSI Badge. You will need to complete the following fields. Employee Number, also known as Username: Input your Employee number. Password: Input your RFC And Press the Login button. You will only have to use the RFC the firsth time you login to GoCCSI, if your information its correct, you will be prompted to change your password to one of your liking. To Change your Password you will have to: Input your Current Password (your current password would be your RFC) Input the New Password Once again, input the New Password. (to make sure you spelled it correctly) Please consider this when you create your New Password Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji. If the process was correct, you will get a confirmation alert. Once you acept this you will enter to GoCCSI.net main page. If you have any issues to Login, please reach our Login Issues chat, in this chat we will help you regain access to the platform.'
        // } 


        var jsonAdaptCard =  undefined;

            if(articleData.length> 0)
            {

            const options = {
                wordwrap: 130,
            
            };

            //let desc = htmlToFormattedText(articleData[0].description);
            let desc = convert(articleData[0].description,options);

        //  console.log(desc);


          //desc = desc.replaceAll("\n","<br/>");
        //   desc = desc.replaceAll("<br/><br/>","\n");
        //   desc = desc.replaceAll("<br/>","\n");

          let str = ""
          
          let indexStr = desc.indexOf("\n");



        //   console.log('indexStr');
        //   console.log(indexStr);

          if(indexStr<=0)
          {
            str = JSON.stringify(desc);
          }
          else
          {

            //str = JSON.stringify(desc);
            //str = desc.toString();

            //str = str.replaceAll(/\\n/, /\n/)

            //let strResult = desc.split('\n')

            //let resStr = "" //strResult.join('\n');

            // strResult && strResult.map(xStr => {
            //     resStr = resStr + xStr.toString() + '\n'.toString();
            // })

            //str = resStr; //desc.replaceAll("\"","").replaceAll("\n","");
            //desc = desc.replaceAll("\n","<br/>");
            
            //str = JSON.stringify(desc.replaceAll("\n",""),this.replacer);
            str = JSON.stringify(desc);

            // console.log('stringfy result');
            // console.log(str);


            //str = str.replaceAll("\t","\n")

            // let xTextResult = "";
            // desc && desc.map(xStr => {
            //     xTextResult=xTextResult + xStr;
            // })
            // console.log(xTextResult);

          }

         

          //console.log(str.replaceAll("\"",""));


          //console.log(JSON.stringify(desc).toString().replaceAll("\"",""));

        // let params = {
        //     "title" : articleData[0].title,
        //     "subTitle" : articleData[0].subTitle,
        //     "imageURL" : articleData[0].urlImage,
        //     "description" : str.replaceAll("\"","") //.replaceAll("\'","")//.replaceAll("\\n","\n")
        // } 
        //.replaceAll("\Z","").replaceAll("\K","").replaceAll(" ","").replaceAll("\B","").replaceAll("\i","").replaceAll("\o","").replaceAll("\s","").replaceAll("\e","")    

        // console.log('params');
        // console.log(params);

        //console.log('JSON CARD');
        //console.log(this.AdaptCard(params));

        // console.log('String Before');
        // console.log(str.replace("\"",""));
        let lastIndexStr = str.lastIndexOf("\"");
        let resultStr = str.substring(1,lastIndexStr-1)  
        //console.log(resultStr);
          
          


        //  console.log('Adpapt');
        //console.log(this.AdaptCard(articleData,str.replaceAll("\"","")));  

        //const jsonAdaptCard = JSON.parse(this.AdaptCard(articleData,str));
             jsonAdaptCard = JSON.parse(this.AdaptCard(articleData,resultStr)); //str.replaceAll("\"","")

        //console.log(jsonAdaptCard);
        }

        //console.log(jsonAdaptCard);
        //console.log(CARDS.InfoCard);

               
     


        //}
        //else


        if(articleData.length <= 0)
        {

            var msg = `No Article Found. Please Select Again !!!  `;
            await step.context.sendActivity(msg);
            this.endDialogProp = true;
            return await step.endDialog();

        }
        else
        {

            await step.context.sendActivity({
                text: '', //step.result.value,
                attachments : [CardFactory.adaptiveCard(jsonAdaptCard)]
            });
    
    
            return await step.prompt(CONFIRM_PROMPT,'This solved your question?',['Yes','No']);

        }
        


        //await step.context.sendActivity(msg); //await step.prompt(TEXT_PROMPT,msg); //
       



    }

    replacer(key, value) {
        // Filtering out properties
        // if (value === "</br>") {
        //   return "\n";
        // }

        console.log('entro value');
        console.log(value);

        return value.replaceAll("<br/>",'n');
    }

    async confirmStep(step) {

         console.log('Third Step');
        // console.log(step);
        this.endDialogProp = true;
        // if(step.result === true)
        // {
            var msg = `Thank you for using CCSIBot !!!`;
            await step.context.sendActivity(msg);
        //}
        return await step.endDialog();
        //return this.endDialog;


        // endDialog= false;
        // return await step.prompt(CONFIRM_PROMPT,'This is correct?',['Yes','No']);
        //var msg = `You has been selected Topic: ${step.values.topic};`
        //return await step.prompt(TEXT_PROMPT,msg); //await step.context.sendActivity(msg);
      
    }

    // async summaryStep(step) {

    //     endDialog= true;
    //     if(step.result === true)
    //     {

    //         var msg = `Thnk you for using CCSIBot.`;
    //         await step.context.sendActivity(msg);

    //     }

    //     return await step.endDialog();

    // }


    isDialogComplete() {
        return this.endDialogProp;
    }


    AdaptCard (params,description) {

        return (`{
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": 2,
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "${params[0].title}",
                                    "weight": "Bolder",
                                    "size": "Large",
                                    "spacing": "None",
                                    "wrap": true,
                                    "style": "heading"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "${params[0].subTitle}",
                                    "size": "Medium",
                                    "wrap": true,
                                    "maxLines": 3
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                                {
                                    "type": "Image",
                                    "url": "${params[0].urlImage}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "RichTextBlock",
                    "inlines": [
                        {
                            "type": "TextRun",
                            "text": "${description}"
                        }
                    ],
                    "horizontalAlignment": "Left",
                    "separator": true
                }
            ]
        }`)
    }






}

//module.exports.GoCCSIDialog = GoCCSIDialog;