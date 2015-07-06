var Twitter = require('twitter');
var Moment = require('moment');
var Redis = require('./redis');


var client = new Twitter({
	consumer_key:        'ueVR6Kqpdh1nqwt2xmuC1Szgt',
	consumer_secret:     'zbaqnQfMD2QsqgavDiWrJvGQWfeiaTVaO3KoyAWfegTl9SQr55',
	access_token_key:    '29404429-xTBpEdqFQkG6d4IAuxg7HEtqTL0PgfHH454tOm5sT',
	access_token_secret: 'zYW191tBsvzEqUkmuoBsdJ6EXy11CBRsrOMmgJYXFdh6D'
});

var TwitterActions = {

	// Regresa un twit espesifico
	getTweetInfo: function getTweetInfo (tweetId, callback) {
		var params = {id: tweetId};
		client.get('statuses/show', params, function(error, tweet, response){
			var data = {
				tweet: tweet.text,
				user: tweet.user.name,
				avatar: tweet.user.profile_image_url,
				retweets: tweet.retweet_count,
				id: tweetId,
				date: Moment().format()
			};
			delete tweet;
			Redis.set("tweets", data);
			callback(error, data);
		});
	},

	getRetweeters: function getRetweeters (tweetId, callback) {
		var params = {id: tweetId};
		client.get('statuses/retweeters/ids', params, function(error, retweeters, response){
			var graph = {nodes: [], links: []};
			retweeters.ids.map(function map (item, key) {
				graph.nodes.push({
            "name": item+"",
                "group": key % 10
        });
        if (!key) return;
        graph.links.push({
            "source": key,
            "target": Math.round(key / 10),
            "value": 1
        });
			})

			var data = {  
				ids: retweeters.ids,
				nextCursor: retweeters.next_cursor,
				graph: graph
			}

			callback(error, data);

		});
	}

};


// 	var prms = [
// 		{source_screen_name: "LeZelt", target_screen_name: "iddar"},
// 		{source_screen_name: "xataka", target_screen_name: "iddar"}
// 	];
// function getRelation (params, callback) {
// 	console.log(params);
// 	client.get('friendships/show', params, callback); 
// }

// async.eachSeries(prms, getRelation, function (err, results) {
//     // Here, results is an array of the value from each function
//     console.log("error:",err); // outputs: ['two', 'five']
//     console.log("algo:",results); // outputs: ['two', 'five']
// });


// {
//  "nodes": [
//  {
//    "name": "Myriel",
//    "group": 1
//  }],
//  "links": [{
//    "source": 1,
//    "target": 0,
//    "value": 1
//  }]
// }



module.exports = TwitterActions;

// var params = {id: '266031293945503744'};
// // Regresa un twit espesifico
// client.get('statuses/show', params, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Numero de tws", tweets.retweet_count);
// });


//Regresa loos ID de quienes retwitiaron



// var params = {id: '615276040684969984', count: 10, stringify_ids: true};

// Regresa un twit espesifico
// client.get('statuses/show/', params, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Numero de tws", tweets.retweet_count);
// });

//Regresa loos ID de quienes retwitiaron
// client.get('statuses/retweeters/ids', params, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Cuenta de tws", tweets.ids.length);

// });

// var prms = {user_id: 492000836};


//Devuelve la informacion de un usuario en espesifico
// client.get('users/show', prms, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Cuenta de tws", tweets);

// });




// Encuentro relaciones
// var prms = {source_screen_name: "LeZelt", target_screen_name: "iddar"};

// client.get('friendships/show', prms, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Cuenta de tws", JSON.stringify(tweets));

// }); 



// var prms = {screen_name: "LeZelt,jesuslozcor,Sabasacustico,mauryscr,iddar"};

// client.get('friendships/lookup', prms, function(error, tweets, response){
//   if (error) {
//     console.log("Error");
//     return;
//   }
//   console.log("Cuenta de tws", JSON.stringify(tweets));

// });