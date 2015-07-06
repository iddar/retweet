
// client.get("algo", function(err, reply) {
//     console.log(err);
// });

// client.set("missingkey", "Hola mundo");

// client.get("missingkey", function(err, reply) {
//     console.log(reply);
// });

var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function db() {
	
	this.set = function(key, vaule){
		client.get(key, function(err, reply) {
			var collection = [];

    	if(reply != null){
    		collection = JSON.parse(reply);
    	}

    	collection.push(vaule);
    	var dataString = JSON.stringify(collection)
    	client.set(key, dataString);
		});
  }

  this.get = function(key, callback){
		client.get(key, function(err, reply) {
    		var collection = JSON.parse(reply);
    		callback(err, collection.reverse());
		});
  }
}


module.exports = new db();