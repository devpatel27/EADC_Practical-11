var express = require('express');

var PORT;
var Cloudant = require('@cloudant/cloudant');

if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 8000;
}
//var Cloudant = require('@cloudant/cloudant');
var url = "https://apikey-v2-2g5og6lhx7gzw5hcrp5b23wzdkxx3hfhaesq79zomfpq:73bf86da9af80bffba409952b9bd732e@1808056c-7253-4c4b-9eb4-d76c5a8a5c03-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-2g5og6lhx7gzw5hcrp5b23wzdkxx3hfhaesq79zomfpq";
var password = "73bf86da9af80bffba409952b9bd732e";
var app = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
//app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("Welcome to cloudant database on IBM Cloud");
});



//////////
app.get('/list_of_databases', function (req, res) {
  
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ...
  
  // Lists all the databases.
  cloudant.db.list().then((body) => {
res.send(body);
  }).catch((err) => { res.send(err); });
});
});

///////////////  create database
app.post('/create-database', (req, res) => {
var name=req.body.name;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ...

cloudant.db.create(name, (err) => {
  if (err) {
    res.send(err);
  } else {
res.send("database created")
    
  }
});
});
});    

////////////// insert single document
app.post('/insert-document', function (req, res) {
var id,name,address,phone,age,database_name;
database_name=req.body.db;
id= req.body.id,
        name= req.body.name;
        address= req.body.address;
        phone= req.body.phone;
        age= req.body.age;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).insert({ "name": name, "address": address, "phone": phone, "age": age }, id , (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
});
});   
   




/////   insert bulk documents
app.post("/insert-bulk/:database_name", function (req, res) {
  const database_name = req.params.database_name;
  const students = [];
  
  for (let i = 0; i < 3; i++) {
  const student = {
  _id: req.body.docs[i].id,
  name: req.body.docs[i].name,
  address: req.body.docs[i].address,
  phone: req.body.docs[i].phone,
  age: req.body.docs[i].age,
  };
  
  students.push(student);
  }
  
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
  if (err) {
  return console.log("Failed to initialize Cloudant: " + err.message);
  }
  
  cloudant.use(database_name).bulk({ docs: students }, function (err) {
  if (err) {
  throw err;
  }
  
  res.send("Inserted all documents");
  });
  });
  });



 




//////////////// delete a document
app.delete('/delete-document', function (req, res) {
var id,rev,database_name;
database_name=req.body.db;
id=req.body.id;
rev=req.body.rev;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).destroy(id, rev, function(err) {
  if (err) {
    throw err;
  }

  res.send('document deleted');
});
});
});

////////////////






//////////////// update existing document
app.put('/update-document', function (req, res) {
var id,rev,database_name;
database_name=req.body.db;
id=req.body.id;
rev=req.body.rev;
name = req.body.name;
address =req.body.address;
phone= req.body.phone;
age= req.body.age;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).insert({ _id:id , _rev: rev, "name": name , "age": age, "address": address, "phone": phone }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
});
});


//////////////



app.listen(PORT);
//console.log(message.getPortMessage() + PORT);

