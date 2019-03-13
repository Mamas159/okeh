/*
    This file is part of MellyBOT.

    MellyBOT is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MellyBOT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MellyBOT.  If not, see <http://www.gnu.org/licenses/>.
*/

const request = require('request');
var schedule = require('node-shedule');
var feedparser = require('feedparser');
var HashMap = require('hashmap');

const nEntryCount = 5;
var map = new HashMap();
var config;

try {
	config = require("../config.json");
} catch (e){
	console.log("Please create an auth.json file following the example of auth.json.example with a bot token and/or client ID!");
	process.exit();
}

var aFeeds = [];
for (let i = 0; i < config.aNewsRSSFeeds.length; i++) {
	let feed = aNewsRSSFeeds[i];
	aFeeds.push([
		feed.sChannelID, 
		feed.sTitle,
		feed.sUrl
	]);
}

var recurrence = new schedule.RecurrenceRule();
recurrence.minute = 5;

exports.init = function(bot) {
	var updateFeed = schedule.scheduleJob(rule, function(bot) {
		let aFeedsPromises = [];
		for (let i = 0; i < aFeeds.length; i++) {
			aFeedsPromises.push(
				fetchFeed(bot, aFeeds[i][2])
			);
		}
		Promise.all(aFeedsPromises)
		.then(
			
		)
	});
}

aRssFeeds = [];
aStreamers = [];

function fetchFeed(bot, url){
	return new Promise(function(resolve, reject) {
		
		let fp = new feedparser();
			
		request(url).pipe(feedparser);
		
		request.on('error', function (error) {
			reject(error);
		});
		
		feedparser.on('error', function(error){
			reject(error);
		});
		
		feedparser.on('readable',function() {
			let nStep = 0;
			
			let stream = this;
			let meta = this.meta;
			let item;
			
			while (item = stream.read() && nStep < 5) {
				nStep++;
				map.set(url, map.get(url).push(item));
			}
			
			resolve(map.get(url));
		});
		
	});
}
