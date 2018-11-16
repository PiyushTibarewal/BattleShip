//var mongodb = require('mongodb');
//var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var url = 'mongodb://localhost:27017/Blog';
const db1 = require('./db');
module.exports = {
	addPost: function(title, subject, callback){
		// MongoClient.connect(url, function(err, db) {
		  	// db.collection('post').insertOne( {
                //  try{
	//	cnt = db1.query("select count(id) from posts")
                db1.connection.query("INSERT INTO posts (title,subject) values (?,?)",[title,subject],(err,rows) => {
            //   "title": title,
			// 	"subject": subject
			//if(err == null){
		    		//callback(true)
		    	//}			
			//}catch(err){
				//assert.equal(err, null);
		    	//console.log("Saved the blog post details.");
		    	if(err == null){
				console.log("post added using addpost");
		    		callback(true)
		    	}
		    	else{
				console.log("post not added using addpost");
		    		callback(false)
		    	}
			});
	},
	
	updatePost: function(id, title, subject, callback){
		//try{
			db1.connection.query("update posts set title=?,subject=? where id=?",[title,subject,id],(err,rows) => {
			//if(err == null){
		    		//callback(true)
		    	//}			
		
	//catch(err){
//				assert.equal(err, null);
		    	//console.log("Saved the blog post details.");
		    	if(err == null){
				console.log("Saved the blog post details using updatepost");
		    		callback(true)
		    	}
		    	else{
				console.log(" not Saved the blog post details using updatepost");
		    		callback(false)
		    	}
			});
	},
	
	getEmail: function(id,callback){
		console.log("getting email of socid ",id);
		db1.connection.query("select username from game_user where id=?",[id],(err,rows) => {
			if (err == null){
	console.log("get posts using getpost");
	var result=JSON.stringify(rows);
  var red=JSON.parse(result);
//   console.log(red[0]);
  if (red[0]!=undefined)
			 callback(red[0]['username']);
	else callback(false);
	}
else{
	console.log("couldn't get posts using getpost");
			return NULL;
	}
		});
	},
// getEmail: function(id){
// 	db1.connection.query("select username from game_user where id=?",id,(err,rows) => {
// 		if (err == null){
// console.log("get posts using getpost");
// var result=JSON.stringify(rows);
// var red=JSON.parse(result);
// 			 return red[0]['username'];
// }
// else{
// console.log("couldn't get posts using getpost");
// 		return NULL;
// }
// 	});
// },
	getId: function(username,callback){
		db1.connection.query("select id from game_user where email=?",username,(err,rows) => {
			if (err == null){
	console.log("get posts using getpost");
	var result=JSON.stringify(rows);
  var red=JSON.parse(result);
				 callback(red[0]['id']);
	}
else{
	console.log("couldn't get posts using getpost");
			return NULL;
	}
		});
	},

	getPost: function(callback){
		
		// MongoClient.connect(url, function(err, db){
			//  db.collection('post', function (err, collection) {
                
                db1.connection.query("select username,email from game_user where online=?",["Y"],(err,rows) => {
                    if (err == null){
			console.log("get posts using getpost");
                    	callback(rows)
			}
		else{
			console.log("couldn't get posts using getpost");
                    callback(false)
			}
                });
		    
	},
	getLeaderBoard: function(callback){
		
		// MongoClient.connect(url, function(err, db){
			//  db.collection('post', function (err, collection) {
                
                db1.connection.query("select username,email,games_played,games_won from game_user ORDER BY games_won",(err,rows) => {
                    if (err == null){
			console.log("get leaderboard using getLeaderBoard");
                    	callback(rows)
			}
		else{
			console.log("couldn't get posts using getpost");
                    callback(false)
			}
                });
		    
	},
	
	setId: function(id,username){
		console.log("starting to set id of ",username," to ",id,"in sql request");
			db1.connection.query("update game_user set online=?,id=? where email=?",["Y",id,username], (err,rows) => {
			if(err == null){
				console.log("Upadted the post.  / setted id of ",username ,"to" ,id);
		    	}
			else{
		    		console.log(" not updates the post.");
				console.error(err);
				//return null;
		    	}
		});							

},
deletePost: function(id,callback){
	db1.connection.query("update game_user set online=? where email=?",["N",id], (err,rows) => {
	if(err == null){
		console.log("Deleted the post.",id);
			callback(true);
		}
	else{
			console.log(" not Deleted the post.");
		//console.error(error);
			callback(false);
		//return null;
		}
});							

},
deletePostSocket: function(id,callback){
	db1.connection.query("update game_user set online=? where id=?",["N",id], (err,rows) => {
	if(err == null){
		console.log("Deleted the post_socket.",id);
			callback(true);
		}
	else{
			console.log(" not Deleted the post.");
		//console.error(error);
			callback(false);
		//return null;
		}
});							

},
			
	
	getPostWithId: function(id, callback){
		db1.connection.query("select * from posts where id=?",[id],(err,rows) => {
			
		    	if(err == null){
				console.log("Retrived the entry using getpostwithid");
		    		callback(rows)
		    	}
		    	else{
		    		callback(false)
		    	}
	});
}
	}


