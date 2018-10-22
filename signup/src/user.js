var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// var url = 'mongodb://localhost:27017/Blog';
const db1 = require('./db');
// const helper = require('./helper')

module.exports = {
	signup: function(name, email, password){
		var cnt = db1.query(`SELECT count(username) as count FROM users WHERE LOWER(username) = ?`, [name])
		if(cnt > 0){
			console.log('returning false')
					// callback(false)
		}
		else{
			try{
			db1.query("INSERT INTO users (`username`,`email`,`password`) VALUES (?,?,?)", [name,email,password])
			console.log("Saved the user sign up details.");
		}
			catch (error) {
				console.error(error);
				return null;
			}
			
		}
	},
	// getUserInfo: function(username, callback){
	// 	MongoClient.connect(url, function(err, db){
			
	// 		db.collection('user').findOne( { email : username 
	// 		},function(err, result){
	// 			if(result==null){
	// 				console.log('returning false')
	// 				callback(false)
	// 			}
	// 			else{
	// 				console.log('returning true')
	// 				callback(result);
	// 			}
	// 		});
	// 	});
	// },
	// updateProfile: function(name, password, username, callback){
	// 	MongoClient.connect(url, function(err, db) {
	// 	  	db.collection('user').updateOne( 
	// 	  		{ "email": username },
	// 	  		{ $set: 
	// 	  			{ "name" : name,
	// 	  			  "password" : password 
	// 	  			}
	// 	  		},function(err, result){
	// 			assert.equal(err, null);
	// 	    	console.log("Updated user details.");
	// 	    	if(err == null){
	// 	    		callback(true)
	// 	    	}
	// 	    	else{
	// 	    		callback(false)
	// 	    	}
	// 		});
	// 	});
	// },
	validateSignIn: function(username, password,callback){
		try {
			result = db1.query(`SELECT username FROM users WHERE LOWER(username) = ? AND password = ?`, [username,password]);
			if(result==null){
				console.log('returning false')
				callback(false)
			}
			else{
				console.log('returning true')
				callback(true)
			}
		} catch (error) {
			return null;
		}
	}

}