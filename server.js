// server.js
// This is an express server app running on the web server.
// This copy of server is for the food site.
var express = require("express");
var app = express();

// Sets up a middleware function that allows web pages served 
//      from any origin to access the resources from the server
// Allow some HTTP methods that are allowed to be used when 
//      accessing the resources from the server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});


// Serve any static files from the public dir
app.use(express.static("public"));

// The mysql object allows one to talk to a running
// instance of a MySQL server.
var mysql = require("mysql2");

// Creates our /names endpoint. This endpoint will respond with a
// json representation of the food names. This is an array of objects,
// all of which have just a 'name' attribute.
// e.g.  [{"name"="Banana"}, {"name"="Peanut Butter"}]
app.get("/names", getFoodNames);
function getFoodNames( req, res) {
    console.log("getFoodNames called");

    // The connection object allows one to connect to
    // the given MySQL server (in this case on localhost)
    // with the given user and password, looking at the
    // specified database.
    var conn = mysql.createConnection( {
        host: "localhost",
        user: "afolabi1",
        password: "$311oy075",
        database: "afolabifoods"
            });
    // Calling the connect function causes the connection
    // object (in the variable 'conn') to actually connect
    // with the credentials specified.
    conn.connect( function( err) {
        if( err) {
            //textForClient += "Error connecting: " + err;
        }
        else {
            //textForClient += "Connection established";
        }});
    // Here is the sql query that we want to run.
    var sql = "select name, cal from food";

    // this function is to be run when the query returns a result.
    function selectNameFromFood(err,rows) {
        console.log("selectNameFromFood called");
        if( err) {  
            // send back an error code in result
        }
        else {
            res.send( JSON.stringify( rows));
        }      
    }

    // this statement actually runs the query on mysql.
    conn.query( sql, selectNameFromFood);

    // this statement will close the connection.
    conn.end();

}

// Creates our /data endpoint. This endpoint will respond with a
// json representation of the food requested by the 'food' parameter. 
// This response is an array of a single food object.
// e.g.  [{"id"="1", "name"="Banana", "size"="3", 
//         "sizeunit"="cups  ", "cal"="160","sodium"="35"}]
app.get("/data", getFoodData);
function getFoodData( req, res) {
    // Grab the parameter to this query, the food name.
    let requestedFood = req.query.food;
    console.log("getFoodData called with food=" + req.query.food);
    
    // Create and connect a connection to the MySQL server.
    var conn = mysql.createConnection( {
        host: "localhost",
        user: "afolabi1",
        password: "$311oy075",
        database: "afolabifoods"
            });
    conn.connect( function( err) {
        if( err) {
            //textForClient += "Error connecting: " + err;
        }
        else {
            //textForClient += "Connection established";
        }});
        
    // Here is the sql query that we want to run.
    var sql = "select * from food where name = \"" + requestedFood + "\"";
    // Run the query on mysql.
    conn.query( sql, function (err,rows) {
            console.log("selectDataFromFood called");
            if( err) {  
                // send back an error code in result
            }
            else {
                // Send back the rows (an array of row objects) as a JSON string
                res.send( JSON.stringify( rows));
            }      
        }
    );
    // Close the connection.
    conn.end();
}

// Creates our /delete endpoint. This endpoint will respond with a
// json representation of the food requested by the 'food' parameter. 

app.get("/delete", deleteFoodData);
function deleteFoodData( req, res) {
    // Grab the parameter to this query, the food name.
    let requestedFood = req.query.food;
    console.log("DELETE FoodData called with food=" + req.query.food);
    
    // Create and connect a connection to the MySQL server.
    var conn = mysql.createConnection( {
        host: "localhost",
        user: "afolabi1",
        password: "$311oy075",
        database: "afolabifoods"
            });
    conn.connect( function( err) {
        if( err) {
            //textForClient += "Error connecting: " + err;
        }
        else {
            //textForClient += "Connection established";
        }});
        
    // Here is the sql query that we want to run.
    var sql = "delete from food where name = \"" + requestedFood + "\"";
    // Run the query on mysql.
    conn.query( sql, function (err,rows) {
            console.log("selectDataFromFood called");
            if( err) {  
                // send back an error code in result
            }
            else {
                // Send back the rows (an array of row objects) as a JSON string
                res.send( JSON.stringify( rows));
            }      
        }
    );
    // Close the connection.
    conn.end();
}

// Creates our /edit endpoint. This endpoint will respond with a
// json representation of the food requested by the 'food', 'size', 'sizeunit', 'cal', 'sodium'  parameters. 
app.get("/edit", editFoodData);
function editFoodData(req, res) {
    let requestedFood = req.query.food;
    let requestedSize = req.query.size;
    let requestedSizeUnit = req.query.sizeunit;
    let requestedCal = req.query.cal;
    let requestedSodium = req.query.sodium;
    console.log(
      "Edit FoodData called with name=" +
        requestedFood +
        ", size=" +
        requestedSize +
        ", sizeunit=" +
        requestedSizeUnit +
        ", cal=" +
        requestedCal +
        ", sodium=" +
        requestedSodium
    );
  
    var conn = mysql.createConnection({
      host: "localhost",
      user: "afolabi1",
      password: "$311oy075",
      database: "afolabifoods",
    });
  
    conn.connect(function (err) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return;
      }
      console.log("Connected as id " + conn.threadId);
  
      var sql =
        "UPDATE foods SET size = ?, sizeunit = ?, cal = ?, sodium = ? WHERE name = ?";
  
      var values = [
        requestedSize,
        requestedSizeUnit,
        requestedCal,
        requestedSodium,
        requestedFood,
      ];
  
      conn.query(sql, values, function (err, result) {
        if (err) {
          console.error("Error updating food item: " + err.stack);
          return;
        }
        console.log(
          "Updated food item: " + result.affectedRows + " rows affected"
        );
        res.send();
      });
  
      console.log("Done with edit endpoint");
      conn.end();
    });
}

// Creates our /add endpoint. This endpoint will respond with a
// json representation of the food requested by the 'food', 'size', 'sizeunit', 'cal', 'sodium'  parameters. 
app.get("/add", addFoodData);
function addFoodData( req, res) {
    // Grab the parameter to this query, the food name.

    var requestedFood = req.query.food;
    var requestedSize = req.query.size;
    var requestedsizeUnit = req.query.sizeunit;
    var requestedCal = req.query.cal;
    var requestedSodium = req.query.sodium;

    console.log("Add FoodData called with food=" + req.query.food);
    
    // Create and connect a connection to the MySQL server.
    var conn = mysql.createConnection( {
        host: "localhost",
        user: "afolabi1",
        password: "$311oy075",
        database: "afolabifoods"
    });
    conn.connect( function( err) {
        if( err) {
            //textForClient += "Error connecting: " + err;
        }
        else {
            //textForClient += "Connection established";
        }});
        
    // Here is the sql query that we want to run.
    var sql = "INSERT INTO food (name, size, sizeunit, cal, sodium) VALUES ?";
    var values = [[requestedFood, requestedSize, requestedsizeUnit, requestedCal, requestedSodium]];
    // Run the query on mysql.
    conn.query(sql, [values], function(err, result) {
        if (err) throw err;
        res.send("Food item added successfully!");
      });

    console.log("Done with edit endpoint" + req.query.food);

    // Close the connection.
    conn.end();
}


// Start the web server running on port 3022
app.listen(3022);

