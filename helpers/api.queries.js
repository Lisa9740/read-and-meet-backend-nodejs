const axios = require("axios");

class Api {
    static getChats(token){
        return axios({method : 'get', url : process.env.API_URL + "/chat/list", headers: {'Authorization' : 'Bearer ' + token}})
    }

    static getMessages(token, id){
        return  axios({method : 'get', url :  process.env.API_URL + "/chat/"  + id + "/messages", headers: {'Authorization' : 'Bearer ' + token}})
    }
}

module.exports = {Api};
