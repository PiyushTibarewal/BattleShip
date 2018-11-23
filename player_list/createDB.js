var mysql = require('mysql');
var username=null;
var password=null;

function prompt(question, callback) {
  var stdin = process.stdin,
      stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  stdin.once('data', function (data) {
      callback(data.toString().trim());
  });
}
prompt('please enter your mysql username', function (input) {
  console.log(input);
  username=input;
  // process.exit();

prompt('please enter your mysql password',function (input) {
  password=input;


var con = mysql.createConnection({
  host: "localhost",
  user: username,
  password: password
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a database named "Anurag":*/
  con.query("CREATE DATABASE Anurag", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

var con1 = mysql.createConnection({
  host: '127.0.0.1',
  user: username,
  password: password,
  database: 'Anurag'
});

con1.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE game_user (id VARCHAR(255), username VARCHAR(255), password VARCHAR(255), online VARCHAR(255) default 'N', games_played INT default 0, points INT default 0, is_playing VARCHAR(255) default 'N', opponent VARCHAR(255) default 'nil' )";
  con1.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

process.exit();
});
});