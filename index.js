var express = require('express');
var Twitter = require('./lib/twitter');
var Redis = require('./lib/redis');


var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var  PORT = process.env.PORT || 3000;

var pub = __dirname + '/static';
app.use(express.static(pub));

app.set('views', __dirname + '/views');

io.on('connection', function(socket){
		console.log('Socket.io Ok');

		showHistory();

		socket.on('tweet', function tweet (tweetId) {
			console.log("El Id es: ", tweetId);
			Twitter.getTweetInfo(tweetId, getTweetInfoCallback);
			Twitter.getRetweeters(tweetId, getRetweeters)
		});

});

function showHistory () {
	Redis.get('tweets', function getTweets (err, tweets) {
		io.emit("history", tweets.slice(0, 3));
	});
}

function getRetweeters (error, data){
		showHistory();
		if (error) {
			io.emit("Error", error);
			return;
		}
		io.emit('graphData', data);
}

function getTweetInfoCallback (error, data){
		if (error) {
			io.emit("Error", error);
			return;
		}
		io.emit('getTweet', data);
}

http.listen(PORT, function serverOn () {
	console.log("http://localhost:" + PORT);
});

