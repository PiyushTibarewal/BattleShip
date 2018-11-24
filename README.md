# BattleShip
As a part of CS251-SSL course workinng on a game called BattleShip.
Ensure that you have node,npm and mysql are installed beforehand in your pc.

Execute the following commands in mysql->
$ CREATE DATABASE Anurag;
$ use Anurag;
$ CREATE TABLE game_user (id VARCHAR(255), username VARCHAR(255), password VARCHAR(255), online VARCHAR(255) default 'N', games_played INT  default 0, points INT default 0, is_playing VARCHAR(255) default 'N', opponent VARCHAR(255) default 'nil'; 

change the username and password to your mysql username and password in db.js.

clone the repo https://anuragk@git.cse.iitb.ac.in/tibarewal/BattleShip.git
and run the following command in the same directory
cd Battleship
cd player_list
npm start


