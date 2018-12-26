const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

var con = mysql.createConnection({
  host: "localhost",
  user: "foo",
  password: "bar",
  port:3306,
  database: "draadb",
});

con.connect(function(err){
  if (err) throw err;
  console.log("Connected");
});

app.use(bodyParser.json());

//listen to POST requests to /
app.post('/', function(req,res){
  // Get sent data.
  var data = req.body;
  // var data =datatemp;
  //[[a,b,c]] will be flat down to (a,b,c)
  var values = [];
  values.push([data[0].DNAsequence, data[0].RNAsequence, data[0].AAsequence]);

  // Perform a MySQL query.

  // con.query('SELECT DNAsequence, COUNT(DNAsequence) FROM draatb GROUP BY DNAsequence HAVING COUNT(DNAsequence) > 1 INTO @dup;');
  // con.query('SELECT MAX(id) FROM draatb INTO @last;');
  // con.query('DELETE FROM draatb WHERE DNAsequence = @last;');


  //keep the latest 5 queries, and delete the rest.
  // con.query('SELECT MIN(id) FROM draatb ORDER BY id DESC LIMIT 5 INTO @latest;');
  // con.query('DELETE FROM draatb WHERE id < @latest;');
  con.query('DELETE FROM draatb WHERE id NOT IN (SELECT * FROM (SELECT id FROM draatb ORDER BY id DESC LIMIT 5) AS t1);');
  //insert the data
  con.query('INSERT INTO draatb (DNAsequence, RNAsequence, AAsequence) VALUES ?', [values], function(err, result){
  });

  //check the duplicates, delete the duplicates
  con.query('SELECT MAX(id) FROM draatb INTO @lastid;');
  con.query('SELECT DNAsequence FROM draatb WHERE id=@lastid INTO @lastdna;');
  con.query('DELETE FROM draatb WHERE id < @lastid AND DNAsequence = @lastdna;');
  res.end('Success');
});

app.get('/get', function(req,res){
  con.query('SELECT * FROM draatb ORDER BY id DESC LIMIT 5', (err, result) => {
    if (err) {
      console.log(err);
      res.json({"error": true});
    }
    else {
      console.log(result);
      res.send(result);
    }
  });
});

var server = app.listen(port, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("DRAA app listening at http://%s:%s", host, port);
})
