const db1 = require('./db');
module.exports = {

	getUsername: function (id, callback) {
		console.log("getting username of socid ", id);
		db1.connection.query("select username from game_user where id=?", [id], (err, rows) => {
			if (err == null) {
				console.log("get username using id");
				var result = JSON.stringify(rows);
				var red = JSON.parse(result);
				//   console.log(red[0]);
				if (red[0] != undefined)
					callback(red[0]['username']);
				else callback(false);
			}
			else {
				console.log("couldn't get posts using getpost");
				return NULL;
			}
		});
	},

	getId: function (username, callback) {
		db1.connection.query("select id from game_user where username=?", username, (err, rows) => {
			if (err == null) {
				console.log("get posts using getpost");
				var result = JSON.stringify(rows);
				var red = JSON.parse(result);
				callback(red[0]['id']);
			}
			else {
				console.log("couldn't get posts using getpost");
				return NULL;
			}
		});
	},

	getPost: function (callback) {

		db1.connection.query("select username from game_user where online=?", ["Y"], (err, rows) => {
			if (err == null) {
				console.log("get posts using getpost ", rows);
				callback(rows)
			}
			else {
				console.log("couldn't get posts using getpost");
				callback(false)
			}
		});

	},

	getLeaderBoard: function (callback) {

		db1.connection.query("select username,games_played,points from game_user ORDER BY points", (err, rows) => {
			if (err == null) {
				console.log("get leaderboard using getLeaderBoard");
				callback(rows)
			}
			else {
				console.log("couldn't get posts using getpost");
				callback(false)
			}
		});

	},

	isPlaying: function (msg, callback) {

		db1.connection.query("select is_playing,online from game_user where username=?", [msg], (err, rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check = red[0]['is_playing'];
			var online = red[0]['online'];
			if (check == "Y" && online == "Y") {
				callback(true);
			}
			else {
				callback(false);
			}
		});

	},

	setId: function (id, username) {
		console.log("starting to set id of ", username, " to ", id, "in sql request");
		db1.connection.query("update game_user set online=?,id=? where username=?", ["Y", id, username], (err, rows) => {
			if (err == null) {
				console.log("Set the id of ", username, "to", id);
			}
			else {
				console.log(" not able to set the id.");
				console.error(err);
				//return null;
			}
		});
	},

	deletePost: function (id, callback) {
		db1.connection.query("update game_user set online=? where username=?", ["N", id], (err, rows) => {
			if (err == null) {
				console.log("Deleted the post.", id);
				callback(true);
			}
			else {
				console.log(" not Deleted the post.");
				callback(false);
			}
		});
	},

	deletePostSocket: function (id, callback) {
		db1.connection.query("update game_user set online=? where id=?", ["N", id], (err, rows) => {
			if (err == null) {
				console.log("Deleted the post_socket.", id);
				callback(true);
			}
			else {
				console.log(" not Deleted the post.");
				callback(false);
			}
		});

	},

}


