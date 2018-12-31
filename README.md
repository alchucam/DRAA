# DRAA
visualization of DNA, RNA and Amino Acids sequences with user interface

## run environment
for react, in client folder, run
```
npm start
```
for node, in server folder, run
```
nodemon server.js
node server.js
```

## heroku environment
add "start":"node server.js" under scripts in server/package.json
```
heroku create
git push heroku master
```


##What was done: (Self Note)
### Server side (Node.js)
### Setup
```
npm install --save pg dotenv
```

#### mysql.
Since MySQL 8.0, uses a new default authentication plugin (caching sha2 password),
needs to create a new user with a password of mysql_native_password:
https://stackoverflow.com/questions/50373427/node-js-cant-authenticate-to-mysql-8-0
```
CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

Since MySQL 8.0, you can no longer create a user using the GRANT command. use create user followed by the GRANT statement in root.
```
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' WITH GRANT OPTION;
```

You can check the users' privileges using the following commands
```
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
```

You can check the current port mysql is using by
```
SHOW GLOBAL VARIABLES LIKE 'PORT';
```

For the project, create tables with following sql commands
```
CREATE TABLE IF NOT EXISTS draatb (
	ID INT AUTO_INCREMENT,
	DNAsequence VARCHAR(255) NOT NULL,
  RNAsequence VARCHAR(255) NOT NULL,
  AAsequence VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID)
)
```
basic mysql commands:
https://www.a2hosting.com/kb/developer-corner/mysql/managing-mysql-databases-and-users-from-the-command-line
<br/>
https://www.pantz.org/software/mysql/mysqlcommands.html

#### interaction between frontend and backend
https://stackoverflow.com/questions/41332643/sending-data-to-database-in-react-js-web-application
<br/>
https://hashnode.com/post/how-can-use-react-js-node-js-mysql-together-cjdlfbukh01vqn9wuaucmng6h
