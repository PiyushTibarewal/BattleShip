const db1 = require('./db');

module.exports = {
	signup: function (username, password, callback) {
		db1.connection.query("SELECT count(username) as count FROM game_user WHERE username = ?", [username], (err, rows) => {
			var str1 = JSON.stringify(rows);
			var json = JSON.parse(str1);
			console.log(json[0]);
			console.log("HTRBW");
			if (json[0]['count'] == 0 && err == null) {
				db1.connection.query("INSERT INTO game_user (`username`,`password`) VALUES (?,?)", [username, password], (e, r) => {
					if (e) {
						callback(false);
												
						}
					else {
						callback(true);
						console.log("Saved the user sign up details.");
					}
				});
			}
			else {
				callback(false);
				console.log('returning false for signup');
			}
		});
	},
	getUserInfo: function (username, callback) {
		try {
			result = db1.query("select * from game_user where username=?", [username]);
			if (result == null) {
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

	updateProfile: function (name, password, username, callback) {
		try {
			result = db1.query("update game_user set username=?,password=? where username=?", [name, password, username])
			console.log("Updated user details usng updateprofile");

			callback(true)
		}
		catch (err) {
			console.error(err);
			callback(false);
			return null
		}

	},
	validateSignIn: function (username, password, callback) {

		db1.connection.query("SELECT count(username) as count FROM game_user WHERE username = ? AND password = ?", [username, password], (err, result, fields) => {
			var str1 = JSON.stringify(result);
			var json = JSON.parse(str1);
			if (json[0]['count'] != 0 && err == null) {
				db1.connection.query("update game_user set online=? where username=?", ["Y", username], (e, r) => {
					if (e == null) {
						console.log('returning true for validatesignin')
						callback(true)
					}
					else {
						console.error(err);
						callback(false);
					}
				});
			}
			else {
				console.log('returning false for validatesignin')
				callback(false)
			}

		});
	}
}


