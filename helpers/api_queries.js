const axios = require("axios");

class ApiQueries{
    static getChats(token){
        return axios({method : 'get', url : "http://127.0.0.1:8000/api/chat/list", headers: {'Authorization' : 'Bearer ' + token}})
    }

    static getMessages(token, id){
        return  axios({method : 'get', url : "http://127.0.0.1:8000/api/chat/"  + id + "/messages", headers: {'Authorization' : 'Bearer ' + token}})
    }
}

module.exports = {ApiQueries};
