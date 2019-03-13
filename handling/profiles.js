var levelHandler = require("./levels.js");

var aBackgrounds = [];
for (let i = 0; i <= 5; i++) {
	aBackgrounds[i] = "";
}
for (let i = 1; i <= 56; i++) {
	aBackgrounds[Math.floor(i / 10)] += i + ": https://api.kazvoeten.com/discord/img/profiles/Profile_" + i + ".png\tLevel req: " + Math.ceil((i * 2) / 10) * 5 + "\r\n";
}

exports.sendProfile = function(bot, msg, con) {
	return new Promise((resolve, reject) => {
        con.getConnection(function(err, connection) {
            if (err) {
                reject(`Error connecting to database: \r\n\r\n{$err}`);
                return;
            }

			let sUserID = msg.author.id;
			let sAvatarURL = msg.author.avatarURL;
			let sUserName = msg.author.username;

			let aMentions = msg.mentions.users.array();
			if(aMentions.length >= 1) {
				sUserID = aMentions[0].id;
				sAvatarURL = aMentions[0].avatarURL;
				sUserName = aMentions[0].username;
			}

			let nAnnouncementColor = 0;
			try {
				let aRoles = msg.member.roles.array();
				for(let i = 0; i < aRoles.length; i++) {
					if (aRoles[i].color != 0) {
						nAnnouncementColor = aRoles[i].color;
						continue;
					}
				}
			} catch (e) {
				console.log("No role information was found:\r\n" + e)
			}

			let aUserQueryData = [msg.guild.id, sUserID];

            let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", aUserQueryData, function(err, result) {
                if (err) {
                    reject(`Query Error (user_fetch): ${query} - ${err}`);
                    return;
                }

                if (result.length != 0) {
                    let nLevel = result[0].level;
                    let nExp = result[0].exp;
					let nCuteness = result[0].cuteness
					let nGameScore = result[0].gamescore;
					let nCash = result[0].cash;
					let sStatus = result[0].status;
					
					let nNextLevelExp = levelHandler.nextLevelEXP(nLevel);
					
					let sResult = "";
					sResult += "\r\nLevel: " + nLevel;
					sResult += "\r\nExp: " + nExp + "/" + Math.ceil(nExp + nNextLevelExp) + " (" + parseInt(nExp/(nExp + nNextLevelExp)*100) + "%)";
					
					let sScores = "";
					sScores += "\r\nCuteness: " + nCuteness;
					sScores += "\r\nGames Score: " + nGameScore;
					
					if (sStatus === "") sStatus = `Character card for ${sUserName}`;

					msg.channel.sendMessage("", {
						embed: {
							title: `${sUserName}`,
							description: sStatus,
							fields: [
								{
									name : "Level Information:",
									value: sResult,
									inline: true
								},
								{
									name : "Stats:",
									value: sScores,
									inline: true
								},
								{
									name : "Wallet:",
									value: "£" + nCash,
									inline: true
								}
							],
							thumbnail : {
								url: sAvatarURL
							},
							color: nAnnouncementColor
						}
					});
                } else {
					let errorMessage = "Could not find the mentioned user in my database.";
					msg.channel.sendMessage("", {
						embed: {
							title: 'User error!',
							description: `${errorMessage} ${sUserID}`,
							color: 16711680
						}
					});
                }
            });
            connection.release();
        });
    });
}

exports.cash = function(bot, msg, con) {
	return new Promise((resolve, reject) => {
        con.getConnection(function(err, connection) {
            if (err) {
                reject(`Error connecting to database: \r\n\r\n{$err}`);
                return;
            }
			
			let aUserQueryData = [msg.guild.id, msg.author.id];
            let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", aUserQueryData, function(err, result) {
                if (err) {
                    reject(`Query Error (user_fetch): ${query} - ${err}`);
                    return;
                }

                if (result.length != 0) {
					let nCash = result[0].cash;
					msg.channel.sendMessage("You currently have: £" + nCash);
                } else {
					let errorMessage = "Could not find the mentioned user in my database.";
					msg.channel.sendMessage("", {
						embed: {
							title: 'User error!',
							description: `${errorMessage} ${sUserID}`,
							color: 16711680
						}
					});
                }
            });
            connection.release();
        });
    });
}

exports.imageProfile = function(bot, msg, con, imageWiz) {
	return new Promise((resolve, reject) => {
        con.getConnection(function(err, connection) {
            if (err) {
                reject(`Error connecting to database: \r\n\r\n{$err}`);
                return;
            }

			let sUserID = msg.author.id;
			let sAvatarURL = msg.author.avatarURL;
			let sUserName = msg.author.username;

			let aMentions = msg.mentions.users.array();
			if(aMentions.length >= 1) {
				sUserID = aMentions[0].id;
				sAvatarURL = aMentions[0].avatarURL;
				sUserName = aMentions[0].username;
			}

			let aUserQueryData = [msg.guild.id, sUserID];
            let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", aUserQueryData, function(err, result) {
                if (err) {
                    reject(`Query Error (user_fetch): ${query} - ${err}`);
                    return;
                }

                if (result.length != 0) {
                    let nLevel = result[0].level;
                    let nExp = result[0].exp;
					let nCuteness = result[0].cuteness
					let nGameScore = result[0].gamescore;
					let nCash = result[0].cash;
					let sStatus = result[0].status;
					let nProfile = result[0].background;
					
					let nNextLevelExp = levelHandler.nextLevelEXP(nLevel);
					let sExpProgress = nExp + "/" + Math.ceil(nExp + nNextLevelExp) + " (" + parseInt(nExp/(nExp + nNextLevelExp)*100) + "%)";
					if (sStatus === "") sStatus = `Character card for ${sUserName}`;
					
					let sRoles = "";
					try {
						let maxNum = 2;
						let aRoles = msg.guild.members.get(sUserID).roles.array();
						for(let i = 0; i < aRoles.length && i < maxNum; i++) {
							if (aRoles[i].name == "@everyone" || aRoles[i].name == "") {
								maxNum++;
								continue;
							}
							sRoles += aRoles[i].name;
							if (i < maxNum - 1) sRoles += ", ";
						}
					} catch (e) {
						console.log("No role information was found:\r\n" + e)
					}
					
					imageWiz.createProfile(sUserName, sAvatarURL, nLevel, nExp, nCuteness, nGameScore, nCash, sStatus, nNextLevelExp, sExpProgress, sRoles, nProfile)
						.then(pngImage => msg.channel.sendFile(pngImage, 'profile.png', '', ''))
						.catch(err => {
							console.log(err); 
							console.log(err.stack);
							throw err;
						});
					
                } else {
					let errorMessage = "Could not find the mentioned user in my database.";
					msg.channel.sendMessage("", {
						embed: {
							title: 'User error!',
							description: `${errorMessage} ${sUserID}`,
							color: 16711680
						}
					});
                }
            });
            connection.release();
        });
    });
}

exports.backgrounds = function(msg, sSuffix) {
	let page = parseInt(sSuffix) - 1;
	if (page < 0 || page > 4 || isNaN(page)) {
		msg.channel.sendMessage("Please specify which page of backgrounds you'd like to see (1-5).");
		return;
	}
	msg.channel.sendMessage("", {
		embed: {
			title: "Page: " + (page + 1) + "/5",
			description: aBackgrounds[page],
			color: 16711680
		}
	});
}

exports.background = function(msg, sSuffix, con) {
	let nProfile = parseInt(sSuffix);
	if (nProfile < 1 || nProfile > 56 || isNaN(nProfile)) {
		msg.channel.sendMessage("This is not an available background number.");
		return;
	}
	buyBackground(msg, nProfile, con);
}

function buyBackground(msg, nProfile, con) {
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
				reject(`Error connecting to database: \r\n\r\n{$err}`);
				return;
			}
			
			let request = [msg.guild.id, msg.author.id];
			let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", request, function(err, result) {
				if (err) {
					reject(`Query Error (user_fetch): ${query}`);
					return;
				}

				if (result.length != 0) {
					let bg = result[0].background;
					let level = result[0].level;
					
					if (level < (Math.ceil((nProfile * 2) / 10) * 5)) {
						msg.channel.sendMessage("You do not meet this background's level requirement.");
						return;
					}
					
					if (nProfile == bg) {
						msg.channel.sendMessage("You already have this background enabled. I won't charge you for it.");
						return;
					}
					
					updateBackground(msg, nProfile, con).then(result => result).catch(error => console.log(error));
					msg.channel.sendMessage("I have changed your background!");
				} else {
					msg.channel.sendMessage("Unable to retrieve your current wallet information. Please try again later.");
				}
			});
			connection.release();
		});
	});
}

function updateWallet(msg, cash, con) {
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
				reject(`Error connecting to database: \r\n\r\n{$err}`);
				return;
			}

			let request = [cash, msg.guild.id, msg.author.id];
			let query = con.query("UPDATE users SET cash = ? WHERE guild = ? AND userid = ?", request, function(err, result) {
				if (err) {
					reject(`Query Error (user_fetch): ${query}`);
					return;
				}
			});
			connection.release();
		});
	});
}

function updateBackground(msg, nBackground, con) {
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
				reject(`Error connecting to database: \r\n\r\n{$err}`);
				return;
			}

			let request = [nBackground, msg.guild.id, msg.author.id];
			let query = con.query("UPDATE users SET background = ? WHERE guild = ? AND userid = ?", request, function(err, result) {
				if (err) {
					reject(`Query Error (user_fetch): ${query}`);
					return;
				}
			});
			connection.release();
		});
	});
}