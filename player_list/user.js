var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var url = 'mongodb://localhost:27017/Blog';
const db1 = require('./db');

module.exports = {
	signup: function(name, email, password){
		db1.connection.query("SELECT count(username) as count FROM game_user WHERE LOWER(email) = ?", [email],(err,rows) => {
		//console.log(cnt);
		var str1=JSON.stringify(rows);
		var json =  JSON.parse(str1);
		console.log(json[0]);
		if(json[0]['count'] == 0 && err ==null){
			
					// callback(false)
		
			db1.connection.query("INSERT INTO game_user (`username`,`email`,`password`) VALUES (?,?,?)", [name,email,password],(e,r) => {
			if (e) throw e;
			else{
			console.log("Saved the user sign up details.");}
		});
}
	else{
			console.log('returning false for signup')			
		}
	});
	},
	getUserInfo: function(username, callback){
		try{
			result = db1.query("select * from game_user where email=?",[username]);
			if(result == null){
				console.log('returning false for getuserinfo')
				callback(false)
				}
			else {
				console.log('returning true for getuserinfo')
				callback(result);
				}
		}
		catch (error) {
				console.error(error);
				return null;
			}
	},
	
	updateProfile: function(name, password, username, callback){
		try{			
		result = db1.query("update game_user set username=?,password=? where email=?",[name,password,username])
                    console.log("Updated user details usng updateprofile");
		    	
		    		callback(true)
		    	}
		    	catch(err){
				console.error(err);
		    		callback(false);
				return null
		    	}
                
	},
	validateSignIn: function(username, password,callback){
		
	db1.connection.query("SELECT count(username) as count FROM game_user WHERE LOWER(email) = ? AND password = ?", [username,password],(err,result,fields) => {
			var str1=JSON.stringify(result);
			var json =  JSON.parse(str1);
			if(json[0]['count'] !=0 && err==null){
				db1.connection.query("update game_user set online=? where LOWER(email)=?",["Y",username],(e,r)=>{
				if (e == null){
				console.log('returning true for validatesignin')
				//console.log(json[0])
				callback(true)
				}
			else{
				console.error(err);
		    		callback(false);
				}	
			});
}
			else{	
				//console.log(json[0])
				console.log('returning false for validatesignin')
				callback(false)
			}
		
	});
}
}


