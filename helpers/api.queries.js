const axios = require("axios");

class Api {
    static getChats(token){
        return axios({method : 'get', url : process.env.API_URL + "/user/chats", headers: {'Authorization' : 'Bearer ' + token}})
    }

    static getMessages(token, id){
        return  axios({method : 'get', url :  process.env.API_URL + "/user/chat/"  + id , headers: {'Authorization' : 'Bearer ' + token}})
    }

    static getDevices(token){
        return  axios({method : 'get', url :  process.env.API_URL + "/devices" , headers: {'Authorization' : 'Bearer ' + token}})
    }
}

module.exports = {Api};
