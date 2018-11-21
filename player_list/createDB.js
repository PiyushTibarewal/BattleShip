var mysql = require('mysql');

var con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'paytak',
  database: 'Anurag'
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE game_user (id VARCHAR(255), username VARCHAR(255), password VARCHAR(255), online VARCHAR(255) default 'N', games_played INT default 0, points INT default 0, is_playing VARCHAR(255) default 'N', opponent VARCHAR(255) default 'nil' )";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});