const request = require('request');
const urban = require('urban');
const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
const ytdlsearch = new YouTube();
const fs = require('fs');
var aQueue = [];
var startTime;
var aCurSong = [];
var bPause = false;
var volume = 100;

ytdlsearch.setKey('AIzaSyDMWiz_BDB7ZuTOUuTs5B4ukib_cMyhXIo');

exports.google = function(bot, msg, sSuffix, oAuthDetails) {
	return new Promise((resolve, reject) => {
		let sQuerry = "https://www.googleapis.com/customsearch/v1?key=" 
					+ oAuthDetails.youtube_api_key + "&cx=" 
					+ oAuthDetails.google_custom_search + "&q=" 
					+ (sSuffix.replace(/\s/g, '+')) + "&alt=json&num=10&start=" 
					+ 1;
		google(bot, msg, sQuerry);
	});
}

exports.searchImage = function(bot, msg, sSuffix, oAuthDetails) {
	return new Promise((resolve, reject) => {
		let nPage = 1 + Math.floor(Math.random() * 5) * 10;
		let sQuerry = "https://www.googleapis.com/customsearch/v1?key=" 
					+ oAuthDetails.youtube_api_key + "&cx=" 
					+ oAuthDetails.google_custom_search + "&q=" 
					+ (sSuffix.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start=" 
					+ nPage;
		google(bot, msg, sQuerry);
	});
}

exports.searchGif = function(bot, msg, sSuffix, oAuthDetails) {
	return new Promise((resolve, reject) => {
		let nPage = 1 + Math.floor(Math.random() * 5) * 10;
		let sQuerry = "https://www.googleapis.com/customsearch/v1?key=" 
					+ oAuthDetails.youtube_api_key + "&cx=" 
					+ oAuthDetails.google_custom_search + "&q=" 
					+ (sSuffix.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start="
					+ nPage +"&fileType=gif";
		google(bot, msg, sQuerry);
	});
}

function google(bot, msg, sQuerry) {
	request(sQuerry, function(err, res, body) {
		try {
			var aData = JSON.parse(body);
		} catch (error) {
			console.log(error)
			return;
		}
		if (!aData.items || aData.items.length == 0){
			console.log(aData);
			msg.channel.sendMessage( "No result for '" + sSuffix + "'");
			return;
		}
		let oRandItem = aData.items[Math.floor(Math.random() * aData.items.length)];
		msg.channel.sendMessage(oRandItem.title + '\n' + oRandItem.link);
	});
}

exports.urban = function(bot, msg, sSuffix) {
	let sQuery = sSuffix == "" ? urban.random() : urban(sSuffix);
	sQuery.first(function(response) {
		if (response) {
			let sResult = "Urban Dictionary: **" + response.word + "**\n\n" + response.definition;
			if (response.example) {
				sResult = sResult + "\n\n__Example__:\n" + response.example;
			}
			msg.channel.sendMessage(sResult);
			} else {
				msg.channel.sendMessage("No matches found");
			}
		}
	);
}

exports.getSong = function (bot, msg) {
	if (aCurSong.length == 4) {
		downloadFromYT(bot, msg, aCurSong[0]);
	} else {
		msg.channel.sendMessage("No song seems to be currently playing or no song has played since my last restart :(");
	}
}

exports.downloadMP3 = function(bot, msg, sSuffix) {
	downloadFromYT(bot, msg, sSuffix);
}

function promiseTitle(sSuffix) {
	return new Promise(function (resolve, reject) {
		ytdl.getInfo(sSuffix, function(err, info) {
			try {
				if (err) reject(err);
				resolve([info.title, info.length_seconds]);
			} catch (err) {
				reject(err);
			}
		});
    });
}

function downloadFromYT(bot, msg, sSuffix) {
	return Promise
	.all([
		promiseTitle(sSuffix)
	])
	.then(function(results) {
		let stream = ytdl(sSuffix, {filter : 'audioonly',});
		let aData = [];
		
		stream.on('data', function(data) {
		  aData.push(data);
		});
		
		stream.on('end', function() {
			let buffer = Buffer.concat(aData);
			let title = results[0][0].replace(/[^a-zA-Z0-9]/g,' ');
			console.log(title);
			msg.channel.sendFile(buffer, `${title}.mp3`, '', '');
		});
	})
	.catch(error => console.error(error));
}

function promiseLink(query) {
    return new Promise(function(resolve, reject) {
		ytdlsearch.search(query, 1, function(error, result) {
		  if (error) {
				reject(error);
		  } else {
				if (!result) reject("no result!?");
				if (result.items.length != 1) reject("No title");
				let url = "https://www.youtube.com/watch?v=";
				resolve(url + result.items[0].id.videoId);
			}
		});
	});
}

exports.volume = function(bot, msg, sSuffix) {
	const voiceConnection = bot.voiceConnections.get(msg.guild.id);
	if (voiceConnection == null) return;
	if (voiceConnection.player.dispatcher) {
		if(sSuffix == ""){
			let nVolume = Math.pow(voiceConnection.player.dispatcher.volume, 0.6020600085251697) * 100.0;
			msg.channel.sendMessage("Current volume: " + nVolume + "%");
		} else {
			volume = sSuffix;
			voiceConnection.player.dispatcher.setVolumeLogarithmic(sSuffix/100.0);
		}
	}
}

exports.pause = function(bot, msg) {
	const voiceConnection = bot.voiceConnections.get(msg.guild.id);
	if (voiceConnection == null) return msg.channel.sendMessage("There's no music playback to pause ;=;");
	if (voiceConnection.player.dispatcher) {
		voiceConnection.player.dispatcher.pause();
		bPause = true;
	}
}

function resume(msg, bot) {
	const voiceConnection = bot.voiceConnections.get(msg.guild.id);
	if (voiceConnection == null) return msg.channel.sendMessage("There's no music playback to resume ;=;");
	if (voiceConnection.player.dispatcher) voiceConnection.player.dispatcher.resume();
}

exports.play = function(bot, msg, sSuffix) {
	if (bPause) {
		resume(msg, bot);
		bPause = false;
	}
	if (sSuffix.length === 0) return;
	if (aQueue.length === 99) {
		msg.channel.sendMessage("The queue contains a shitload of songs dude. No need to add more, damn..");
		return;
	}
	if (!sSuffix.toLowerCase().startsWith('http')) {
		promiseLink(sSuffix).then(function(result) {
			playLink(bot, msg, result);
		}).catch(error => {
			console.error(error)
			playLink(bot, msg, sSuffix);
		});
	} else {
		playLink(bot, msg, sSuffix);
	}
}

function playLink(bot, msg, sSuffix) {
	const voiceConnection = bot.voiceConnections.get(msg.guild.id);
	//const voiceChannel = msg.member.voiceChannel;
	const voiceChannel = bot.channels.get("305816313656246273");
	if (!voiceChannel) {
	  return msg.reply('Please join a voice channel first.');
	}
	if (voiceConnection == null) {
		voiceChannel.join().then(connnection => {
			addToQueue(bot, msg, sSuffix, true);
		});
	} else {
		addToQueue(bot, msg, sSuffix, false);
	}
}

exports.queue = function(bot, msg) {
	if (aQueue.length < 1 && aCurSong.length < 1) {
		msg.channel.sendMessage("The queue is currently empty. Use !play to add a song! :D");
		return;
	}
	
	let durationInSeconds = Math.floor((new Date()).getTime() / 1000) - startTime;
	let minutes = Math.floor(durationInSeconds / 60);
	let seconds = Math.floor(durationInSeconds - (minutes * 60));
	
	
	let sQueue = "Music queue:```\r\n";
	if (aCurSong.length > 0) {
		sQueue += "Currently playing/ downloadable: " + aCurSong[2] 
		+ " " + aCurSong[1] + "\r\nThis song has been playing for: " 
		+ minutes + "m " + seconds + "s" + "\r\n\r\n";
	}
	for (let i = 0; i < aQueue.length && sQueue.length < 1800; i++) {
		let num = i + 1;
		num = ("0" + num).slice(-2); //format to 2 digit for alignment
		sQueue += num + ". " + aQueue[i][2]
		+ " " + aQueue[i][1] + "\r\n";
	}
	sQueue += "```";
	
	msg.channel.sendMessage(sQueue);
}

exports.clearqueue = function(bot, msg) {
	aQueue = [];
	msg.channel.sendMessage("Queue cleared!");
}

exports.shuffle = function(bot, msg) {
	shuffle(aQueue);
	msg.channel.sendMessage("Queue shuffled!");
}

exports.skip = function(bot, msg) {
	const voiceConnection = bot.voiceConnections.get(msg.guild.id);
	if (voiceConnection == null) {
		msg.channel.sendMessage("The bot isn't in any voice channels. There's nothing to skip.");
		return;
	}
	if (voiceConnection.player.dispatcher) voiceConnection.player.dispatcher.end();
	if (aQueue > 0) playNext(bot, msg);
}

function addToQueue(bot, msg, sSuffix, bFirst) {
	return Promise
	.all([
		promiseTitle(sSuffix)
	])
	.then(function(results) {
		let title = results[0][0];
		
		let duration = results[0][1]; 
		let minutes = Math.floor(duration / 60);
		let seconds = Math.floor(duration - minutes * 60);
		
		//format minutes/seconds to 2 digits
		minutes = ("0" + minutes).slice(-2);
		seconds = ("0" + seconds).slice(-2);
		
		let sDuration = "[" + minutes + ":" + seconds + "]";
		let queueObject = [sSuffix, title, sDuration, duration];
		aQueue.push(queueObject);
		
		msg.channel.sendMessage("Added to queue: " + aQueue.length + "."
		+ " " + sDuration + " " + title);
		
		if (bFirst) {
			playNext(bot, msg);
		}
	})
	.catch(error => {
		console.error(error);
		msg.channel.sendMessage("Unable to resolve your request into a song :(");
	});
}

function playNext(client, msg) {
	const voiceConnection = client.voiceConnections.get(msg.guild.id);
	if (voiceConnection == null) {
		aQueue = [];
		msg.channel.sendMessage("Bot was somehow removed from the voice channel. Music engine was reset.");
		return;
	}
	
	let next = aQueue.shift();
	aCurSong = next;
	
	msg.channel.sendMessage("Now playing: " + next[2] + " " + next[1]);
	let stream = ytdl(next[0], {
		filter : 'audioonly',
	});
	
	startTime = (new Date()).getTime() / 1000;
	
	const dispatcher = voiceConnection.playStream(stream);
	dispatcher.setVolumeLogarithmic(volume/100.0);
	dispatcher.on('end', () => {
		setTimeout(() => {
			msg.channel.sendMessage("Finished playing " + next[1]);
			aCurSong = []; //reset so old songs are not listed as currently playing
			if (aQueue.length > 0) {
				playNext(client, msg);
			} else {
				msg.channel.sendMessage("Queue finished! Leaving voice channel!");
				voiceConnection.disconnect();
			}
		}, 1000);
	});
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}