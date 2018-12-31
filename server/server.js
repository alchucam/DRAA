const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const path = require('path');

var con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  port:3306,
  database: process.env.database,
});



//static file declaration
app.use(express.static(path.join(__dirname, '../client/build')));



app.use(bodyParser.json());

//listen to POST requests to /
app.post('/', function(req,res){

  con.connect(function(err){
    if (err) {
      next (err);
    }
    console.log("Connected");
  });

  // Get sent data.
  var data = req.body;

  //[[a,b,c]] will be flat down to (a,b,c)
  var values = [];
  values.push([data[0].DNAsequence, data[0].RNAsequence, data[0].AAsequence]);

  // Perform a MySQL query.
  //keep the latest 5 queries, and delete the rest.
  con.query('DELETE FROM draatb WHERE id NOT IN (SELECT * FROM (SELECT id FROM draatb ORDER BY id DESC LIMIT 5) AS t1);');
  //insert the data
  con.query('INSERT INTO draatb (DNAsequence, RNAsequence, AAsequence) VALUES ?', [values], function(err, result){
    if (err) {
      next(err); //Pass error to express
    }
    console.log(result);
  });

  //check the duplicates, delete the duplicates
  con.query('SELECT MAX(id) FROM draatb INTO @lastid;');
  con.query('SELECT DNAsequence FROM draatb WHERE id=@lastid INTO @lastdna;');
  con.query('DELETE FROM draatb WHERE id < @lastid AND DNAsequence = @lastdna;');

  con.end(function(err){
    if (err) {
      next (err);
    }
    console.log("ended");
  });

  res.end('Success');
});

//listen to GET requests to /get
app.get('/get', function(req,res){
  con.connect(function(err){
    if (err) {
      next (err);
    }
    console.log("Connected");
  });
  
  con.query('SELECT * FROM draatb ORDER BY id DESC LIMIT 5', (err, result) => {
    if (err) {
      console.log(err);
    }

    con.end(function(err){
      if (err) {
        next (err);
      }
      console.log("ended");
    });
    console.log(result);
    res.send(result);

  });
});

//rest of any unmatched route, send it to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
});


var server = app.listen(port, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("DRAA app listening at http://%s:%s", host, port);
})
