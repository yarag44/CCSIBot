import axios from 'axios'; 



export class constants {
    IDENVIRONMENT: number; 
    path_url: string;

    constructor() {
       
        this.IDENVIRONMENT = 1;//PRODUCTION
        //export const IDENVIRONMENT = 2;//QA
        //export const IDENVIRONMENT = 3;//DEVELOP
        
        //this.path_url = 'https://localhost:44354/'
        //this.path_url = 'http://localhost:36393/'
        //this.path_url = 'https://prd-bkg-kbs-api.goccsi.net/'
        this.path_url = 'https://demoqa-knowledgebase-api.azurewebsites.net/'
        
        

    }

    retpath_url() {

        return this.path_url;

    }


    async NAuthAxios(){

        // console.log('Log NAuthAxios');
        // console.log(this.path_url);

        var headers = {};
        const authAxios = axios.create({
                            baseURL: this.path_url,
                            //headers: {
                                //Authorization: `Bearer ${reactLocalStorage.get(TOKEN)}`
                                //Authorization: `Bearer ${getTokenNOExpiration}`
                                headers,
                            //}
                        }); 
                
        authAxios.interceptors.response.use(
            (response) =>
                new Promise((resolve, reject) => {
                resolve(response);
                }),
            (error) => {
                if (!error.response) {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
                }
            }
            );
    
    
            return await (authAxios);
    
    }

    // async executionAxios (data) {

    //      axios({
    //         method: 'post',
    //         url: url,
    //         data: data
    //       });


    // }



    //////// Validation fields /////////////////////////////////
     validationField (fieldString) {
            return fieldString.replace('\'','').replace('"','');
    }
}











module.exports.constants = constants;

//  const datesFormat = "MM/dd/yyyy";

//  function formatDate(datetime) {
//     return moment(datetime).format('DD/MM/YYYY');
// }

//  function saveDateTime(datetime) {
//     return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
// }

//  function saveDate(datetime) {
//     return moment(datetime).format('YYYY-MM-DD');
// } 

//  function formatDateTime(datetime) {
//     return moment(datetime).format('DD/MM/YYYY HH:mm:ss');
// }

//  const actualYear = (new Date().getFullYear());

//  function isEmail(data) {
//     return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data);
// }

//  function getImageName(extension) {
//     return 'image_' + moment(new Date()).format('YYYYMMDDHHmmss') + '.' + extension;
// }
