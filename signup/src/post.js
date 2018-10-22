var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// var url = 'mongodb://localhost:27017/Blog';
const db1 = require('./db');


module.exports = {
	addPost: function(title, subject, callback){
		// MongoClient.connect(url, function(err, db) {
		  	// db.collection('post').insertOne( {
                  try{
                result = db1.query("INSERT INTO posts (`title`,`subject`) values (?,?)",[title,subject])
            //   "title": title,
			// 	"subject": subject
			}catch(err){
				assert.equal(err, null);
		    	console.log("Saved the blog post details.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			}
	},
	getPost: function(callback){
		
		// MongoClient.connect(url, function(err, db){
			//  db.collection('post', function (err, collection) {
                
                db1.query("select * from posts",(err,rows) => {
                    if (err)
                    throw err;
                    callback(rows)
                });
		    
	}
}