var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('words.txt')
});

var aHangmanWords = [];
var bCurHangManGame = false;
var aGuesses = [];
var aCurword = [];
var aGuessedWord = [];
var con;

exports.setCon = function(connection) {
	con = connection;
}

lineReader.on('line', function (line) {
  aHangmanWords.push(line.toLowerCase());
});

exports.startHangman = function(bot, msg) {
	if (!bCurHangManGame) {
		bCurHangManGame = true;
		aGuesses = [];
		aGuessedWord = [];
		aCurword = Array.from(aHangmanWords[Math.floor(Math.random() * aHangmanWords.length)]);
		for (index in aCurword) {
			aGuessedWord[index] = "."; 
		}
	}
	let sGuesses = getGuessesString();
	let sWord = getCurrentGuessedWordString();
	msg.channel.sendMessage("Starting a new hangman game!");
	printGameStatus(msg, sWord, sGuesses);
}

exports.guessHangman = function(bot, msg, sSuffix) {
	if (!bCurHangManGame) {
		msg.channel.sendMessage("There is no hangman game going on currently. Please use !hangman to start one!");
		return;
	}
	let guess = sSuffix[0].toLowerCase();
		
	//Check if right word was guessed in whole
	let sWord = getCurrentWordString();
	if (sWord === sSuffix.toLowerCase()) {
		winGame(msg);
		return;
	}
		
	//Check if guessed letter was guessed before
	for (index in aGuesses) {
		if(aGuesses[index] === guess) {
			msg.channel.sendMessage("This letter was already guessed!");
			return;
		}
	}
		
	//Put guessed letters in right positions
	bCorrect = false;
	for (index in aCurword) {
		if(aCurword[index] === guess) {
			aGuessedWord[index] = guess;
			bCorrect = true;
		}
	}
	if (!bCorrect) aGuesses.push(guess);
		
	//Check if game won
	let sGuessed = getCurrentGuessedWordString();
	if (sGuessed === sWord) {
		console.log(sGuessed);
		console.log(sWord);
		winGame(msg);
		return;
	}
		
	//Check if game lost
	if (aGuesses.length === 7) {
		bCurHangManGame = false;
		msg.channel.sendMessage("", {
			embed: {
				title: "You lost the game! :(",
				fields: [
					{
						name : "Secret word:",
						value: getCurrentWordString(),
						inline: true
					},
					{
						name : "Guessed word:",
						value: getCurrentGuessedWordString(),
						inline: true
					}
				],
				image : {
					url: "http://api.kazvoeten.com/discord/img/hangman/" + aGuesses.length + ".png"
				},
				color: 16711680
			}
		});
		return;
	}
	printGameStatus(msg, sGuessed, getGuessesString());
}

function winGame(msg) {
	bCurHangManGame = false;
	msg.channel.sendMessage("", {
		embed: {
			title: "You won the game! :D",
			description: msg.author.username + " just guessed the word!",
			fields: [
				{
					name : "Secret word:",
					value: getCurrentWordString(),
					inline: true
				}
			],
			image : {
				url: "http://api.kazvoeten.com/discord/img/hangman/" + aGuesses.length + ".png"
			},
			color: 65535
		}
	});
	updateHangmanScore(msg, msg.author.id, msg.guild.id, ((aCurword.length - 1) * (aCurword.length / 2)));
}

function getGuessesString() {
	let sGuesses = "";
	for (index in aGuesses) {
		sGuesses += aGuesses[index] + ", "; 
	}
	return sGuesses;
}

function getCurrentGuessedWordString() {
	let sWord = "";
	for (index in aGuessedWord) {
		sWord += aGuessedWord[index]; 
	}
	return sWord;
}

function getCurrentWordString() {
	let sWord = "";
	for (index in aCurword) {
		sWord += aCurword[index]; 
	}
	return sWord;
}

function printGameStatus(msg, sWord, sGuesses) {
	msg.channel.sendMessage("", {
		embed: {
			title: "Current hangman game status",
			description: "",
			fields: [
				{
					name : "Secret word:",
					value: sWord,
					inline: true
				},
				{
					name : "Wrong guesses:",
					value: sGuesses == "" ? "None" : sGuesses,
					inline: true
				}
			],
			image : {
				url: "http://api.kazvoeten.com/discord/img/hangman/" + aGuesses.length + ".png"
			},
			color: 6750054
		}
	});
}

function updateHangmanScore(msg, userId, guildId, score) {
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
			  reject(`Error connecting to database: \r\n\r\n{$err}`);
			  return;
			}

			let queryData = [guildId, userId];

			let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", queryData, function(err, result) {
				if (err) {
					reject(`Query Error (user_hangman_fetch): ${query}`);
					return;
				}

				if (result.length != 0) {
					let gamescore = result[0].gamescore;
					let bonusExp = result[0].bonusExp;
					let cash = result[0].cash;
					bonusExp = bonusExp + score;
					gamescore++;
					cash += bonusExp/3;

					let data = [gamescore, bonusExp, cash, guildId, userId];
				
					let query = con.query("UPDATE users SET gamescore = ?, bonusExp = ?, cash = ? WHERE guild = ? AND userid = ?", data, function(err, result) {
					
						if (err) {
							reject(`Query Error (user_update_hangmanScore): ${query}`);
							return;
						}
						
						msg.channel.sendMessage("Your hangman win has been registered! You earned: £" + parseInt(bonusExp/3) + " and " + bonusExp + " experience.");
					});

				} else {
					let errorMessage = "Could not find the user!";
						msg.channel.sendMessage("", {
							embed: {
								title: 'User error!',
								description: `${errorMessage}`,
								color: 16711680
							}
					 });
				}
			});
		connection.release();
		});
	});
}

exports.doubledown = function(bot, msg, aParams) {
	let cash = parseInt(aParams[0]);
	if(isNaN(cash)) {
		msg.channel.sendMessage("Your bet needs to be nummeric.");
		return;
	}
	if (cash < 10) {
		msg.channel.sendMessage("You must bet a positive integer amount of cash bigger than or equal to 10.");
		return;
	}
	gamble(msg, cash, 50).then(result => result).catch(error => console.log(error));
}

exports.pto = function(bot, msg, aParams) {
	if (aParams.length != 2) {
		msg.channel.sendMessage("Please specify the cash you want to bet and the odds to bet against");
	}
	let cash = parseInt(aParams[0]);
	let odds = parseInt(aParams[1]);
	if(isNaN(cash)) {
		msg.channel.sendMessage("Your bet and odds need to be nummeric.");
		return;
	}
	if (cash < 10 || odds < 1 || odds > 90) {
		msg.channel.sendMessage("Your parameters are out of range. Cash has to be at least 10, odds have to be between 0-90, excluding 0.");
		return;
	}
	gamble(msg, cash, odds).then(result => result).catch(error => console.log(error));
}

exports.daily = function(bot, msg) {
	if(msg.author.id != bot.user.id) {
		getDaily(msg).then(result => result).catch(error => console.log(error));
	}
}

exports.trade = function(bot, msg, aParams) {
	if(msg.author.id != bot.user.id) {
		let cash = parseInt(aParams[0]);
		if(isNaN(cash)) {
			msg.channel.sendMesage("Your cash ammount needs to be nummeric.");
			return;
		}
		if (cash < 1) {
			msg.channel.sendMesage("Cash has to be more than 0!");
			return;
		}
		trade(msg, cash).then(result => result).catch(error => console.log(error));
	}
}

function gamble(msg, cash, odds) {
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
					let wallet = result[0].cash;
					
					if (wallet < cash) {
						msg.channel.sendMessage("You don't have that much cash in your wallet.");
						return;
					}
					
					//gamble
					let odd = getRandomInt(0, 101);
					let lose = true;
					if (odd < odds) lose = false;
					console.log(lose);
					
					//create reward
					let base = cash;
					let inc = Math.ceil((2 - ((odds/100) * 2)) * cash);
					let winpool = base + inc; 
					console.log(winpool);
					
					wallet -= cash;
					
					if (!lose) {
						wallet += winpool;
					}
					
					updateWallet(msg, wallet).then(result => result).catch(error => console.log(error));
					
					let message = "";
					if (lose) {
						message += "You rolled " + odd + " on " + odds + "% odds and lost £" + base;
					} else {
						message += "You rolled " + odd + " on " + odds + "% odds and won £" + inc + " resulting in a total return of: £" + winpool;
					}
					
					console.log(message);
					msg.channel.sendMessage(message);
					
				} else {
					msg.channel.sendMessage("Unable to retrieve your current wallet information. Please try again later.");
				}
			});
			connection.release();
		});
	});
}

function trade(msg, cash) {
	console.log("trade");
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
				reject(`Error connecting to database: \r\n\r\n{$err}`);
				return;
			}
			
			let user = msg.author.id;

			let mentions = msg.mentions.users.array();
			if(mentions.length >= 1) {
				user = mentions[0].id;
			} else {
				msg.channel.sendMessage("You have to tag an user to vote!");
				reject(`No user tagged.`);
				return;
			}

			let request = [msg.guild.id, msg.author.id];
			let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", request, function(err, result) {
				if (err) {
					reject(`Query Error (user_fetch): ${query}`);
					return;
				}
				
				console.log("requested wallet");

				if (result.length != 0) {
					let wallet = result[0].cash;
					
					if (wallet < cash) {
						msg.channel.sendMessage("You don't have that much cash in your wallet. You can play some hangman for some quick cash though!");
						return;
					}
					wallet -= cash;
					
					updateOtherWallet(msg.guild.id, user, cash).then(result => result).catch(error => {
						console.log(error); 
						msg.channel.sendMessage("Trading failed, please try again later.");
						return;
					});
					updateWallet(msg, wallet).then(result => result).catch(error => console.log(error));
					msg.channel.sendMessage("You successfully traded!");
				} else {
					msg.channel.sendMessage("Unable to retrieve your current wallet information. Please try again later.");
				}
			});
			connection.release();
		});
	});
}

function updateWallet(msg, cash) {
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

function updateOtherWallet(guild, user, cash) {
	return new Promise((resolve, reject) => {
		con.getConnection(function(err, connection) {
			if (err) {
				reject(`Error connecting to database: \r\n\r\n{$err}`);
				return;
			}
			
			let request = [guild, user];
			let query1 = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", request, function(err, result) {
				if (err) {
					reject(`Query Error (user_fetch): ${err}`);
					return;
				}
				
				console.log("requested wallet");

				let wallet;
				if (result.length != 0) {
					wallet = result[0].cash;
					wallet = wallet + cash;
				} else {
					reject(`No wallet found ;-;`);
					return;
				}
				
				let update = [wallet, guild, user];
				let query2 = con.query("UPDATE users SET cash = ? WHERE guild = ? AND userid = ?", update, function(err, result) {
					if (err) {
						reject(`Query Error (user_fetch): ${err}`);
						return;
					}
				});
			});
			connection.release();
		});
	});
}

function getDaily(msg) {
	return new Promise((resolve, reject) => {
    con.getConnection(function(err, connection) {
	  	if (err) {
	    	reject(`Error connecting to database: \r\n\r\n{$err}`);
	      return;
	    }
		
		let queryData = [msg.guild.id, msg.author.id];
	    
		let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", queryData, function(err, result) {
      	if (err) {
        	reject(`Query Error (user_fetch_dailies): ${query}`);
          return;
        }

        if (result.length != 0) {
			let lastUse = result[0].lastdaily;
			let curcash = result[0].cash;

			//Get the last vote +12 hours
			let lastDaily = new Date(lastUse);
			lastDaily.setHours(lastDaily.getHours()+24);

			//get the current time
			let currDate = new Date();

			if (currDate < lastDaily) {
				msg.channel.sendMessage("You have to wait until " + lastDaily + " before you can get free cash again.");
				reject(`Too early to get free cash.`);
				return;
			}

			let cash = getRandomInt(10, 30);
			updateWallet(msg, cash + curcash).then(result => result).catch(error => console.log(error));

			let newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
			let data = [newDate, msg.guild.id, msg.author.id];
			let query = con.query("UPDATE users SET lastdaily = ? WHERE guild = ? AND userid = ?", data, function(err, result) {
				if (err) {
					reject(`Query Error (user_update_last_daily): ${query}`);
					return;
				}
			});
			
			msg.channel.sendMessage("You gained £" + cash + " today!");
        } else {
			let errorMessage = "Could not find the user!";
				msg.channel.sendMessage("", {
					embed: {
						title: 'User error!',
						description: `${errorMessage}`,
						color: 16711680
					}
				});
			}
        });
      connection.release();
    });
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

