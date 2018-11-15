var mysql = require('mysql');

var con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'paytak',
    database: 'Anurag'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE game_user (id VARCHAR(255), username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), online VARCHAR(255), games_played INT, games_won INT, is_playing VARCHAR(255), opponent VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});