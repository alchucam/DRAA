# DRAA
Interactive tools of concurrent translation/transcription between DNA, RNA and Amino Acids sequences,
along with visualization of mutated sequences

## Description

In the main page, user can type any of DNA, RNA or Amino Acids sequences, and the application will convert the sequence to the other types of sequences concurrently.
With MySQL database connected, user can save and load up to 5 recent sequences.
In the mutate page, the sequence from the main page can be mutated with the small probability (3%) per character per generation (1 second).
Such mutated sequence is visualized with a chart, showing the types of sequence mutation.
Lastly, a repair function to repair the mutated sequence is implemented with genetic algorithm

## run environment : development
for react, in client folder, run
```
npm start
```
for node, in server folder, run
```
nodemon server.js
node server.js
```

## heroku environment : production
add "start":"node server.js" under scripts in server/package.json
```
heroku create
git push heroku master
```

## Programming Language

JavaScript

## Tools/IDE

React.js, Node.js, Express.js, MySQL, Heroku, Atom

<br/>
## What was done : Self Note

### env
https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html

### Server side (Node.js) : Setup
```
npm install --save pg dotenv
```

#### mysql
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
