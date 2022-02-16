const db = require("../config/database");

class DbQueries{

   static getUserByAttribute(attr){
       return  db.query("SELECT * FROM `users` WHERE "+ "`" +attr + "` =" + " '" + attr +  "';", { type: db.QueryTypes.SELECT })
    }
}
