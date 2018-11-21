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

	initializetGame	: function (first,second,callback) {

		db1.connection.query("select is_playing from game_user where username=?", [msg], (err, rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check1 = red[0]['is_playing'];
			var check2 = red[1]['is_playing'];
			if (check1 == "N" && check2 == "N") {
				db1.connection.query("create table ? (row_no INT, col_1 INT default 0, col_2 INT default 0, col_3 INT default 0, col_4 INT default 0, col_5 INT default 0, col_6 INT default 0, col_7 INT default 0, col_8 INT default 0, add_info INT default 0)", [first], (err,row) => {
					db1.connection.query("insert into ? ('row_no') values (1)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (2)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (3)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (4)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (5)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (6)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (7)", [first], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (8)", [first], (e,r) => {});
				});
				db1.connection.query("create table ? (row_no INT, col_1 INT default 0, col_2 INT default 0, col_3 INT default 0, col_4 INT default 0, col_5 INT default 0, col_6 INT default 0, col_7 INT default 0, col_8 INT default 0, add_info INT default 0)", [second], (err,row) => {
					db1.connection.query("insert into ? ('row_no') values (1)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (2)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (3)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (4)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (5)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (6)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (7)", [second], (e,r) => {});
					db1.connection.query("insert into ? ('row_no') values (8)", [second], (e,r) => {});
				});
				console.log("Inititalized game between ", first, " and ", second);
				callback(true);
			}
			else {
				callback(false);
			}
		});
	},

	checkBlock : function (user,row,col,callback) {
		var col_no = 'col_'+col;
		db1.connection.query("select ? from ? where row_no=?",[col_no,user,row], (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check = red[0][col_no];
			callback(check);
		});
		console.log("user ",user,"tried to hit ",row,",",col);
	},

	// shipSunk : function () {

	// },

	gameOver : function (user,callback) {
		db1.connection.query("select row_no from ? where col_1 = 1 or col_2 = 1 or col_3 = 1 or col_4 = 1 or col_5 = 1 or col_6 = 1 or col_7 = 1 or col_8 = 1", [user], (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			if (red == NULL) {
				callback(true);
			}
			else {
				callback(false);
			}
		})
	},

	setBlockColour : function (user,i,j,colour) {
		var col_no = 'col_'+j;
		db1.connection.query("update ? set ?=? where row_no=?",[user,col_no,colour,i], (err,rows) => {});

	},

	setadd_info : function (user, i, val) {
		db1.connection.query("update ? set add_info=? where row_no=?",[user,val,i], (err,rows) => {});
	},

	getadd_info : function (user, i, callback) {
		db1.connection.query("select add_info from ? where row_no=?",[user,i], (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check = red[0]['add_info'];
			callback(check);
		});
	},


	checkBlocks : function (user,i,j,Blocks,callback) {
		var ans = 1;
		Blocks.forEach ( function (entry) {
			var x = entry[0]+i;
			var y = entry[1]+j;
			if (x < 1 || x > 8 || y < 1 || y > 8) {
				ans = 0;
			}
			else {
				var col_no = 'col_' + y;
				db1.connection.query("select ? from ? where row_no=?", [col_no,user,x], (err,rows) => {
					var result = JSON.stringify(rows);
					var red = JSON.parse(result);
					var check = red[0][col_no];
					if (check != 0) {
						ans = 0;
					}
				});
			}
		});
		if (ans == 1) callback(true);
		else callfack(false);
	},

}


