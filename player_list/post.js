const db1 = require('./db');
module.exports = {

	initializeServer : function () {
		db1.connection.query("update game_user set online='N', is_playing='N'");
	},

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

		db1.connection.query("select username from game_user where online=? and is_playing=?", ["Y","N"], (err, rows) => {
			if (err == null) {
				console.log("Online players list request ", rows);
				callback(rows)
			}
			else {
				console.log("couldn't get posts using getpost");
				callback(false)
			}
		});

	},

	getLeaderBoard: function (callback) {

		db1.connection.query("select username,games_played,points from game_user ORDER BY points DESC", (err, rows) => {
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
	isOnline: function (msg, callback) {

		db1.connection.query("select online from game_user where username=?", [msg], (err, rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var online = red[0]['online'];
			if (online == "Y") {
				callback(true);
			}
			else {
				callback(false);
			}
		});

	},

	setId: function (id, username,callback) {
		console.log("starting to set id of ", username, " to ", id, "in sql request");
		db1.connection.query("update game_user set online=?,id=? where username=?", ["Y", id, username], (err, rows) => {
			if (err == null) {
				console.log("Set the id of ", username, "to", id);
				callback();
			}
			else {
				console.log(" not able to set the id.");
				console.error(err);
				//return null;
			}
		});
	},

	changePoints: function (username, val) {
		// console.log("starting to set id of ", username, " to ", id, "in sql request");
		db1.connection.query("select points,games_played from game_user where username=?", [username], (error,row) => {
			var result = JSON.stringify(row);
			var red = JSON.parse(result);
			var points = red[0]['points'];
			var games = red[0]['games_played'];
				points=points+Number(val);
			games=games+1;
			console.log("change points",points,games,result,red,error,username,val);
			db1.connection.query("update game_user set points=?, is_playing='N', opponent='nil', games_played=? where username=?", [points,games,username]);
		});
	},

	setIs_playing: function (val, username,callback) {
		// console.log("starting to set id of ", username, " to ", id, "in sql request");
		db1.connection.query("update game_user set is_playing=? where username=?", [val , username], (err, rows) => {
			callback();
		});
	},

	setOpponent: function (val, username,callback) {
		// console.log("starting to set id of ", username, " to ", id, "in sql request");
		db1.connection.query("update game_user set opponent=? where username=?", [val, username], (err, rows) => {
			callback();
		});
	},

	getOpponent: function (user,callback) {
		db1.connection.query("select opponent from game_user where username=?", [user], (err, rows) => {
			if (err) throw err;
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var opponent = red[0]['opponent'];
			callback(opponent);
		});
	},

	deletePostSocket: function (id, callback) {
		db1.connection.query("update game_user set online='N' where id=?", [id], (err, rows) => {
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

	dropTable : function (user,callback) {
		var sqlq = "drop table "+user;
		db1.connection.query(sqlq, (err,rows) => {
			if (err) callback(false);
			else callback(true);
		});
	},

	initializetGame	: function (first,second,callback) {
		var sqlq1 = "create table "+first+" (row_no INT, col_1 INT default 0, col_2 INT default 0, col_3 INT default 0, col_4 INT default 0, col_5 INT default 0, col_6 INT default 0, col_7 INT default 0, col_8 INT default 0, add_info_1 INT default 0,add_info_2 INT default 0)";
		db1.connection.query(sqlq1, (err,row) => {
			var sqlq11 = "insert into "+first+" (row_no) values (1)";
			var sqlq12 = "insert into "+first+" (row_no) values (2)";
			var sqlq13 = "insert into "+first+" (row_no) values (3)";
			var sqlq14 = "insert into "+first+" (row_no) values (4)";
			var sqlq15 = "insert into "+first+" (row_no) values (5)";
			var sqlq16 = "insert into "+first+" (row_no) values (6)";
			var sqlq17 = "insert into "+first+" (row_no) values (7)";
			var sqlq18 = "insert into "+first+" (row_no) values (8)";
			db1.connection.query(sqlq11, (e,r) => {});
			db1.connection.query(sqlq12, (e,r) => {});
			db1.connection.query(sqlq13, (e,r) => {});
			db1.connection.query(sqlq14, (e,r) => {});
			db1.connection.query(sqlq15, (e,r) => {});
			db1.connection.query(sqlq16, (e,r) => {});
			db1.connection.query(sqlq17, (e,r) => {});
			db1.connection.query(sqlq18, (e,r) => {});
		});
		var sqlq2 = "create table "+second+" (row_no INT, col_1 INT default 0, col_2 INT default 0, col_3 INT default 0, col_4 INT default 0, col_5 INT default 0, col_6 INT default 0, col_7 INT default 0, col_8 INT default 0, add_info_1 INT default 0,add_info_2 INT default 0)";
		db1.connection.query(sqlq2, (err,row) => {
			var sqlq21 = "insert into "+second+" (row_no) values (1)";
			var sqlq22 = "insert into "+second+" (row_no) values (2)";
			var sqlq23 = "insert into "+second+" (row_no) values (3)";
			var sqlq24 = "insert into "+second+" (row_no) values (4)";
			var sqlq25 = "insert into "+second+" (row_no) values (5)";
			var sqlq26 = "insert into "+second+" (row_no) values (6)";
			var sqlq27 = "insert into "+second+" (row_no) values (7)";
			var sqlq28 = "insert into "+second+" (row_no) values (8)";
			db1.connection.query(sqlq21, (e,r) => {});
			db1.connection.query(sqlq22, (e,r) => {});
			db1.connection.query(sqlq23, (e,r) => {});
			db1.connection.query(sqlq24, (e,r) => {});
			db1.connection.query(sqlq25, (e,r) => {});
			db1.connection.query(sqlq26, (e,r) => {});
			db1.connection.query(sqlq27, (e,r) => {});
			db1.connection.query(sqlq28, (e,r) => {});
		});
		console.log("Inititalized game between ", first, " and ", second);
		callback(true);
	},

	getBlock : function (user,row,col,callback) {
		var col_no = 'col_'+col;
		var sqlq = "select "+col_no+" from "+user+" where row_no=?";// might be an error
		db1.connection.query(sqlq,[row], (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check = red[0][col_no];
			callback(check);
			console.log(user,"'s opponent tried to hit ",row,",",col,"output=",check);
		});
	},

	gameOver : function (user,callback) {// yaha dikhat he bas
		var sqlq ="select row_no from "+user+" where col_1 = 1 or col_2 = 1 or col_3 = 1 or col_4 = 1 or col_5 = 1 or col_6 = 1 or col_7 = 1 or col_8 = 1";
		db1.connection.query(sqlq, (err,rows) => {
			if (err) throw err;
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			// console.log("inside gameOver",rows,result,red,red.length,sqlq);
			if (red.length == 0) {
				callback(true);
				console.log("game Over ",user," lost");
			}
			else {
				callback(false);
			}
		});
	},

	setBlockColour : function (user,i,j,colour,callback) {
		var col_no = 'col_'+j;
		var sqlq = "update "+user+" set "+col_no+"=? where row_no=?";
		console.log("setBlockcolour of user,i,j,colour: ",user,i,j,colour);
		db1.connection.query(sqlq,[colour,i], (err,rows) => {
			if (err) throw err;
			console.log(col_no,i,colour,user,"yo");
			callback(true);
		});
	},

	setadd_info : function (user, i, val,col) {
		var sqlq = "update "+user+" set add_info_"+col+"=? where row_no=?";
		db1.connection.query(sqlq,[val,i], (err,rows) => {if (err) throw err});
		console.log("updated add_info of u,i",user,i);
	},

	getadd_info : function (user, i, shape,col, callback) {
		var sqlq = "select add_info_"+col+" from "+user+" where row_no=?";
		db1.connection.query(sqlq,[i], (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			var check = red[0]['add_info_'+col];
			console.log("retriving getaddd_info of user,i,shape:",user,i,shape," return check :",check);
			callback(check);
		});
	},

	checkGameStart : function (user, callback) {
		console.log("checking if all ships are placed in sea grid of ",user);
		var sqlq = "select row_no from "+user+" where row_no>2 and add_info_1=1";
		db1.connection.query(sqlq, (err,rows) => {
			var result = JSON.stringify(rows);
			var red = JSON.parse(result);
			if (red.length == 6) {
				callback(true);
			}
			else callback(false);
		});
	},


	checkBlocks_rec : function (user,shape,i,j,Blocks,callback) {
		console.log(Blocks);// for debug
		if (Blocks.length == 0) callback(true);
		else {
			console.log("Checking ",i+Blocks[0][0],",",j+Blocks[0][1]," of user ",user,"to place shape ",shape)
			var x = Blocks[0][0]+i;
			var y = Blocks[0][1]+j;
			if (x < 1 || x > 8 || y < 1 || y > 8) {
				callback(false);
			}
			else {
				var col_no = 'col_' + y;
				// var sqlq = "select ? from "+user+" where row_no=?";
				var sqlq = "select "+col_no+" from "+user+" where row_no="+x;
				db1.connection.query(sqlq, (err,rows) => {
					var result = JSON.stringify(rows);
					var red = JSON.parse(result);
					var check = red[0][col_no];
					// console.log(result,col_no,check,x,y,red);
					if (check != 0) {
						callback(false);
					}
					else {
						this.checkBlocks_rec(user,shape,i,j,Blocks.slice(1), function (result) {
							callback(result);
						});// might be error add this. infront
					}
				});
			}
		}
	},

	getPlayerBoard: function (player, i, j, callback) {
		if (i != 8 || j != 8) {
			var hi =this;
			if ( j != 8 ) {
				this.getBlock(player, i, j, function (block) {
					var new_item = [[i,j,block]];
					hi.getPlayerBoard(player, i, j+1, function (result) {
						var ne = result.concat(new_item);
						callback(ne);
					});
				});
			}
			else {
				this.getBlock(player, i, j, function (block) {
					var new_item = [[i,j,block]];
					hi.getPlayerBoard(player, i+1, 1, function (result) {
						var ne = result.concat(new_item);
						callback(ne);
					});
				});
			}
		}
		else {
			this.getBlock(player, i, j, function (block) {
				var new_item = [[i,j,block]];
				callback(new_item);
			});
		}
	}

	// checkBlocks : function (user,i,j,Blocks,callback) {
	// 	var ans = 1;
	// 	Blocks.forEach ( function (entry) {
	// 		var x = entry[0]+i;
	// 		var y = entry[1]+j;
	// 		if (x < 1 || x > 8 || y < 1 || y > 8) {
	// 			ans = 0;

	// 		}
	// 		else {
	// 			var col_no = 'col_' + y;
	// 			// var sqlq = "select ? from "+user+" where row_no=?";
	// 			var sqlq = "select "+col_no+" from "+user+" where row_no="+x;
	// 			db1.connection.query(sqlq, (err,rows) => {
	// 				var result = JSON.stringify(rows);
	// 				var red = JSON.parse(result);
	// 				var check = red[0][col_no];
	// 				console.log(result,col_no,check,x,y,red);
	// 				if (check != 0) {
	// 					ans = 0;
	// 				}
	// 			});
	// 		}
	// 	});
	// 	console.log(ans,"yo");
	// 	if (ans == 1) callback(true);
	// 	else callback(false);
	// },

}


