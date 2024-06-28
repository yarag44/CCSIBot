import { constants } from '../../constants'
import axios from 'axios';

//const { constants } = require('../../constants/constants');
//const axios = require('axios'); 


export class KBDExecutions {

    constructor() {

    }

  async Select_Articles_CCSIBOT(params) {

    var objConstants = new constants(); 

    let jsVar = {
    
      "Option": params.Option,
      "idArticle": params.idArticle,
      "idCategories":params.idCategories,
      "idStatus": params.idStatus,
      "title": params.title,
      "criteria": params.criteria
  
    }

    // console.log('Enviado JSVAR Select_Articles_CCSIBOT');
     console.log(jsVar);

    //let url = objConstants.retpath_url() + 'Article/Select_Articles_CCSIBOT';
    let url = objConstants.retpath_url() +'Article/Select_Articles_CCSIBOT';
    
    //console.log('URL Generada');
    //console.log(url);


    let resultData = []

    await (await objConstants.NAuthAxios()).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
        resultData = response.data;
      }
      ).catch(async (error) => {
    
        // let jsErr = {
    
        //   "jsonsend": constant.validationField(JSON.stringify(jsVar)),
        //   "resultstatus": constant.validationField(error.toString()),
        //   "followapifunction":constant.validationField(url)
          
        // }
    
        //await constant.exp_Insert_ErrorControl(jsErr);
    
    
      } );



//     let resultData = []

//     //try {
// //let resultAxios =
//          await axios({
//             method: 'post',
//             url: url,
//             data: jsVar
//         }).then(response =>{

//             console.log(response);
            
//             for(let item of response.data.data)
//             {
//                 resultData.push(item);
//             }

//         }) ;

      
        //resultData = resultAxios.data 

    // } catch (error) {
    //     console.log('Exeution Error');
    //     console.log(error);
    // }

    

    // console.log(result);

    //return resultAxios.data
    return resultData;
  }


  async Select_Catalogs(params) {

    var objConstants = new constants(); 

    let jsVar = {
      "option": params.option
    }

    // console.log('Enviado JSVAR Select_Articles_CCSIBOT');
    // console.log(jsVar);

    //let url = objConstants.retpath_url() + 'Article/Select_Articles_CCSIBOT';
    let url = objConstants.retpath_url() +'Catalog/Select_Catalogs';
    
    //console.log('URL Generada');
    //console.log(url);

    let resultData = []

    await (await objConstants.NAuthAxios()).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
        resultData = response.data;
      }
      ).catch(async (error) => {
    
        // let jsErr = {
    
        //   "jsonsend": constant.validationField(JSON.stringify(jsVar)),
        //   "resultstatus": constant.validationField(error.toString()),
        //   "followapifunction":constant.validationField(url)
          
        // }
    
        //await constant.exp_Insert_ErrorControl(jsErr);
    
    
      } );
    


    //let resultData = []

    //try {
        // let resultAxios = await axios({
        //     method: 'post',
        //     url: url,
        //     data: jsVar
        // }).then(response =>{

        //     const { data } = response




        //     // data.forEach(element => {
        //     //     resultData.push(element);
        //     // });

        //     // for(let item of response.data)
        //     // {
        //     //     resultData.push(item);
        //     // }

        // }) ;


    //     resultData = resultAxios.data 

    // } catch (error) {
    //     console.log('Exeution Error');
    //     console.log(error);
    // }

    

    // console.log(result);

    //return resultAxios.data;
    return resultData;
  }


}






  //module.exports.KBDExecutions = KBDExecutions;