//Utilized node packages.
var schedule = require('node-schedule');
var util = require('util');
var mysql = require('mysql');
var cleanStack = require('clean-stack');
var beautify = require('js-beautify');

//DiscordJS client
var authDetails;
var bot;

//SQL connection pool
var con;

//Thread ID
var bMaster;

//Guild configuration
var sLogChannelID;
var sPanicRoomID;
var sWelcomeChannel;
var sMainChannel;
var aGuildRanks = [0, 0];

//Load external handlers
var logHandler = require("./handling/logging.js");
var moderationHandler = require("./handling/moderation.js");
var googleAPI = require("./handling/google.js");
var imageWiz = require("./handling/imagewiz.js");
var levelHandler = require("./handling/levels.js");
var profileHandler = require("./handling/profiles.js");
var gameHandler = require("./handling/games.js");

const commands = "!help    -	List this list.\r\n"
			   + "!ship    -	Ship 2 mentioned members.\r\n"
			   + "!urban   -	Define a word.\r\n"
			   + "!profile -    Show your profile.\r\n"
			   + "!ytdl    -    Download a youtube video as mp3.\r\n"
			   + "!play    -    Play a youtube video in your VC.\r\n"
			   + "!queue   -    List queued songs.\r\n"
			   + "!getsong -    Download the playing song.\r\n"
			   + "!shuffle -    Shuffle the existing queue.\r\n"
			   + "!pause   -    Pause music playback.\r\n"
			   + "!volume  -    Set music playback volume.\r\n"
			   + "!hangman -    Start a game of hangman.\r\n"
			   + "!guess   -    Guess the hangman word.\r\n"
			   + "!daily   -    Get free daily cash.\r\n"
			   + "!50/50   -    Bet cash against 50% odds.\r\n"
			   + "!pto     -    Bet cash against your odds .\r\n"
			   + "!trade   -    Trade cash to someone.\r\n"
			   + "!cash    -    Show your current cash.\r\n"
			   + "!level   -    Show your level card.\r\n"
			   + "!backgrounds - list available bg's.\r\n"
			   + "!background - Change your background.\r\n";
			   

exports.init = function(bIsMaster) {
	
	bMaster = bIsMaster;

	try {
		var Discord = require("discord.js");
	} catch (e) {
		console.log(e.stack);
		console.log(process.version);
		console.log("Please run npm install and ensure it passes with no errors!");
		process.exit();
	}

	// Get bot auth data
	try {
		authDetails = require("./auth.json");
	} catch (e){
		console.log("Please create an auth.json file following the example of auth.json.example with a bot token and/or client ID!");
		process.exit();
	}
	
	// Get SQL config
	try {
		let SQLConfig = require("./database.json");
		con = mysql.createPool(SQLConfig);
	} catch (e){
		console.log("Please create an database.json file following the example of database.json.example and make sure the SQL server is valid!");
		process.exit();
	}
	
	// Get guild config
	try {
		var guildConfig = require("./config.json");
		sLogChannelID = guildConfig.sLogChannelID;
		aGuildRanks[0] = guildConfig.sAdminRole;
		aGuildRanks[1] = guildConfig.sModRole;
		sWelcomeChannel = guildConfig.sWelcomeChannel;
		sMainChannel = guildConfig.sMainChannel;
		sPanicRoomID = guildConfig.sPanicRoomID;
	} catch (e){
		console.log(e);
		console.log("Please create an config.json file following the example of config.json.example.");
		process.exit();
	}
	
	//Initialize external handlers config.
	logHandler.setLogChannel(sLogChannelID);
	gameHandler.setCon(con);
	
	bot = new Discord.Client();
	if(authDetails.bot_token){
		bot.login(authDetails.bot_token);
	} else {
		console.log("Please set the bot token in auth.json.");
	}

	bot.on("ready", function () {
		console.log("MellyBOT " + (bMaster ? "master" : "worker") + " succesfully connected to discord!");
	});
	bot.on("message", (msg) => handleMessage(bot, msg));

	//log the original message here
	bot.on("messageUpdate", (oldMessage, newMessage) => {
		if (bMaster) logHandler.logEdited(bot, oldMessage, newMessage);
	});

	//log removing messages
	bot.on("messageDelete", msg => {
		if (bMaster) logHandler.logDeleted(bot, msg);
	});

	//log removing messages
	bot.on("messageDeleteBulk", collection => {
		if (bMaster) logHandler.logBulkDeleted(bot, collection);
	});

	//Log user status changes
	bot.on("presence", function(user, status, nGameID) {
		//could be used for logging people coming online
	});

	//log people joining guilds
	/* disabled
	bot.on("guildMemberAdd", member => {
		if(!bMaster) {
			logHandler.guildMemberMigration(bot, member, false);
			let oWelcomeChannel = bot.channels.get(sWelcomeChannel);
			let oMainChannel = bot.channels.get(sMainChannel);
			
			let sMemberName = member.displayName;
			let sMemberAvatarURL = member.user.avatarURL;
			if (sMemberAvatarURL == null) sMemberAvatarURL = "https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png";
		
			imageWiz.createWelcomeImage(member.guild.name, sMemberName, sMemberAvatarURL)
			.then(pngImage => oWelcomeChannel.sendFile(pngImage, 'welcome.png', '', ''))
			.catch(err => {
				console.log(err); 
				console.log(err.stack);
				throw err;
			});
		
			oMainChannel.sendMessage("Hey everyone! Please welcome " + member.toString() + " to " + member.guild.name);
		}
	});
	*/
	
	//log people leaving guilds
	bot.on("guildMemberRemove", member => {
		if (bMaster) logHandler.guildMemberMigration(bot, member, true);
	});
	
	//catch discord connection error
	bot.on("error", error => {
		console.log(error);
		process.exit(1);
	});
	
	//catch discord disconnection
	bot.on("disconnected", function () {
		console.log("Disconnected!");
		process.exit(1);
	});
};

function handleMessage(bot, msg) {
	//commands (eval and schedule only atm)
	let channel = bot.channels.get(sLogChannelID);
	if (msg.author.id != bot.user.id) {
			
		//Handle EXP
		if (!bMaster) levelHandler.gainExp(bot, msg, con).catch(error => console.log(error));
				
		//Get message
		let sMessage = msg.toString();
		if (sMessage[0] != "!") return; //Return if first char isn't command prefix
				
		//assign command/suffix/params
		let sCmd = sMessage.substr(1, sMessage.indexOf(' ') == -1 ? sMessage.length : sMessage.indexOf(' '));
		let sSuffix = sMessage.substr(sMessage.indexOf(' ') + 1);
		let aParams = sSuffix.split(' ');
		let aMentions = msg.mentions.users.array();
				
		//user level
		let bAdmin = msg.guild.member(msg.author).roles.has(aGuildRanks[0]) || msg.author.id == 145997830052380674;
		let bMod = msg.guild.member(msg.author).roles.has(aGuildRanks[1]);
		let bOwner = (msg.guild.ownerID == msg.author.id);
				
		console.log("User command " + sCmd + ":\r\n" + sSuffix + "\r\n" + aParams);
				
		if (bMaster) {
			//handle master commands
			switch (sCmd.replace(" ", "")) {
				case "kick":
					if(!bAdmin &&!bMod) return;//user isn't moderator
					if(aMentions.length >= 1 && aMentions[0].id != bot.user.id) {
						let user = aMentions[0];
						let bSuccess = true;
						moderationHandler.kick(bot, msg, user).catch(function(e) {
							console.log(e);
							bSuccess = false;
						});
						if (bSuccess) logHandler.guildMemberPunish(bot, user, msg.author.username, msg.guild.name, false);
					} else {
						msg.channel.sendMessage("You did not mention a kickable user.");
					}
					break;
				case "ban":
					if(!bAdmin && !bOwner) return;//user isn't admin
					if(aMentions.length >= 1 && aMentions[0].id != bot.user.id) {
						let user = aMentions[0];
						moderationHandler.kick(bot, msg, user)
						.then(logHandler.guildMemberPunish(bot, user, msg.author.username, msg.guild.name, true))
						.catch(function(err) {
							console.log(err);
							throw err;
						});
					} else {
						msg.channel.sendMessage("You did not mention a bannable user.");
					}
					break;
				case "clear":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					let nCount = parseInt(sSuffix);
					if(aMentions.length >= 1 && aMentions[0].id != bot.user.id) {
						let user = aMentions[0];
						moderationHandler.clearUserMessages(bot, msg, user);
					} else if (nCount){
						moderationHandler.clearMessages(bot, msg, nCount);
					}
					break;
				case "google":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					googleAPI.google(bot, msg, sSuffix, authDetails);
					break;
				case "image":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					googleAPI.searchImage(bot, msg, sSuffix, authDetails);
					break;
				case "gif":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					googleAPI.searchGif(bot, msg, sSuffix, authDetails);
					break;
				case "urban":
					googleAPI.urban(bot, msg, sSuffix);
					break;
				
				case "help":
					msg.channel.sendMessage("", {
						embed: {
							title: "My services:",
							description: "```\r\n" + commands + "\r\n```",
							color: 16030530
						}
					});
					break;
				case "ytdl":
					googleAPI.downloadMP3(bot, msg, sSuffix);
					break;
				case "play":
					googleAPI.play(bot, msg, sSuffix);
					break;
				case "queue":
					googleAPI.queue(bot, msg);
					break;
				case "shuffle":
					googleAPI.shuffle(bot, msg);
					break;
				case "getsong":
					googleAPI.getSong(bot, msg);
					break;
				case "pause":
					googleAPI.pause(bot, msg);
					break;
				case "resume":
					googleAPI.resume(bot, msg);
					break;
				case "volume":
					googleAPI.volume(bot, msg, sSuffix);
					break;
				case "resetqueue":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					googleAPI.clearqueue(bot, msg);
					break;
				case "skip":
					if(!bAdmin &&!bMod && !bOwner) return;//user isn't moderator
					googleAPI.skip(bot, msg);
					break;
				case "hangman":
					gameHandler.startHangman(bot, msg);
					break;
				case "guess":
					gameHandler.guessHangman(bot, msg, sSuffix);
					break
				case "daily":
					gameHandler.daily(bot, msg);
					break;
				case "50/50":
					gameHandler.doubledown(bot, msg, aParams);
					break;
				case "pto":
					gameHandler.pto(bot, msg, aParams);
					break;
				case "trade":
					gameHandler.trade(bot, msg, aParams);
					break;
				case "cash":
					profileHandler.cash(bot, msg, con);
					break;
				case "restart":
					if(!bAdmin && !bOwner) return;
					process.exit(1);
					break;
				default:
					break;
			}
		
		//handle worker commands
		} else {
			switch(sCmd.replace(" ", "")) {
				case "ship":
					if(aMentions.length >= 2) {
						let bride = aMentions[0];
						let groom = aMentions[1];
								
						let bridename = bride.username;
						let groomname = groom.username;
						let ship = "Ship name: ";
						ship += bridename.substr(0, Math.floor(bridename.length/2));
						ship += groomname.substr(Math.floor(groomname.length/2), groomname.length -1);
						ship += " // "
						ship += groomname.substr(0, Math.floor(groomname.length/2));
						ship += bridename.substr(Math.floor(bridename.length/2), bridename.length -1);
						msg.channel.sendMessage(ship);
								
						imageWiz.createShip(bride, groom)
						.then(pngImage => msg.channel.sendFile(pngImage, 'welcome.png', '', ''))
						.catch(err => {
							console.log(err); 
							console.log(err.stack);
							throw err;
						});
					} else {
						msg.channel.sendMessage("You have to mention the two members you wish to ship.");
					}
				break;
				case "profile":
					profileHandler.imageProfile(bot, msg, con, imageWiz);
					break;
				case "backgrounds":
					profileHandler.backgrounds(msg, sSuffix);
					break;
				case "background":
					profileHandler.background(msg, sSuffix, con);
					break;
				case "level":
					profileHandler.sendProfile(bot, msg, con);
					break;
				case "eval":
					if(!bOwner && !bMod && !bAdmin) return;//user isn't admin
					runEval(msg, sSuffix);
					break;
				case "restart":
					if(!bAdmin && !bOwner) return;
					process.exit(1);
					break;
				default:
					break;
			}
		}
	}
}

function runEval(msg, sSuffix) {
	let nStart = Date.now();
	let oRes;
	try {
		oRes = util.inspect(eval(sSuffix, bot));
	} catch(err) {
		oRes = cleanStack(err.stack);
	}
	let nExecTime = Date.now() - nStart;
	msg.channel.sendMessage("", {
		embed: {
			title: "Eval Result",
			fields: [
					{
						name : "Input",
						value: "```JavaScript\r\n" + beautify(msg.toString().replace("!eval", ""), { indent_size: 2 }) + "\r\n```",
						inline: true
					},
					{
						name : "Output",
						value: "```JavaScript\r\n" + oRes + "\r\n```",
						inline: true
					}
				],
			footer : {
				text : "Took " + nExecTime + "ms to excecute."
			},
			color: 13956162
		}
	});
}

function hex(nDec) {
	let sHex = nDec.toString(16).toUpperCase() + ((sHex.length % 2) === 0) ? "0x" : "0x0";
	return sHex;
}

function parseBin(bin) {
    let nRet = 0; 
    let sBin = (typeof bin === 'string') ? bin : bin.toString().split("");
    for(let i = 0; i < sBin.length; i++) nRet = (nRet << 1) | ((sBin[i] === "0") ? 0 : 1);
	return nRet;
}

function getBin(nDec) {
	return (nDec >>> 0).toString(2);
}

function getMask(aFlags, nCount) {
	let aMask = new Array(nCount).fill(0);
	for (let i = 0; i < aFlags.length; i++) {
		aMask[nCount - (aFlags[i] >> 5)] |= (1 << (0x1F - (aFlags[i] & 0x1F)));
	}
	return aMask;
}

function reverseMask(aMask) {
	let aReversedMask = new Array(aMask.length).fill(0);
	for (let i = aMask.length - 1; i > 0; i--) {
		aReversedMask[(aMask.length - 1) - i] = aMask[i];
	}
	return aReversedMask;
}

function stringMask(aMask) {
	let sMask = "";
	for (let i = 0; i < aMask.length; i++) {
		sMask += hex(aMask[i], 4) + "\r\n";
	}
	return sMask;
}

function hex(nDec, nSize) {
	let sHex = nDec.toString(16).toUpperCase();
	if (sHex.length & 1 != 0) sHex = "0" + sHex;
	while (sHex.length / 2 < nSize) {
		sHex = "00" + sHex;
	}
	console.log(sHex);
	for (let i = 2; i < sHex.length; i += 2) {
		let sFront = sHex.substring(0, i);
		let sBack = sHex.substring(i, sHex.length);
		sHex = sFront + " " + sBack;
		i++;
	}
	return sHex;
}