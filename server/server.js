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
  //keep the latest 5 queries, and delete the rest.
  con.query('SELECT MAX(id)-4 FROM draatb INTO @latest;');
  con.query('DELETE FROM draatb WHERE id < @latest;');
  //insert the data
  con.query('INSERT INTO draatb (DNAsequence, RNAsequence, AAsequence) VALUES ?', [values], function(err, result){
  });
  res.end('Success');
});


var server = app.listen(port, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("DRAA app listening at http://%s:%s", host, port);
})
