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


module.exports = TwitterActions;




