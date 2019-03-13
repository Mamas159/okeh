const sLevelImageDir = "http://api.kazvoeten.com/discord/img"
const aLevelMessageUserData = [
	//Array's of messages
	["Good job on leveling up %name%! Level %level% already!", "Oooh~ %name% your level %level% intrigues me~!", "Hmmm level %level% That's amazing %name%!"],
	["Meow~~ Congratulations on level %level% %name%-senpai!", "Meow~~ Bring it on %name%, I can handle level %level%~!"],
	["Hehe finally level %level% I see? About time you start pulling your own weight around here %name%", "Hmm level %level% huh?. Don't even think you're ready to match up to me yet %name%..", "Level %level%? Cute. Just keep working on it %name%"],
	["Woa watch out over there %name%! Suddenly jumping up to level %level% almost made her trip!"],
	["Great job reaching level %level% %name%. I wish you best of luck advancing even further.", "This new height you've reached at level %level% acts as a shining beacon of hope for the survival of this server. Thank you %name%.."],
	["Hey %name% you leveled up again didn't you? Level %level% already! Wow!", "Hey look at you go! Level up to %level% huh %name%? We could all take example from you!", "Woooow is that really you %name%!? You're already level %level%!"],
	["Oh is that you %name%? I almost didn't recognise you. You've become such high level.. %level% wow..","Oh my. Level %level% already. You're doing well %name%"],
	["Congratulations on level %level% %name%-sama!", "Wow! Congratulation on reaching level %level%! That's super impressive %name%!", "Level %level%! What an amazing achievement %name%!"],
	["Congratulations on level %level% %name%! Here have this yummy treat!", "I made this delicious treat for you %name%~<3 You deserve it for reaching level %level%!", "I present you this declicious suprise %name% for reaching level %level%!"],
	["Congratulations on level %level%. That's pretty good %name%."],
	["Dear %name%: Me and my sister would like to congratulate you on reaching level %level%!", "Hey there hotshot. Me and my sis would like to congratulate you on reaching level %level%! Good job %name%."],
	["Hey boss! We'd like to tell you it's awesome that you've reached %level%! Seeing %name% work so hard makes us all want to put in more effort!", "You keep amazing us %name% with the levels you keep reaching! %level% already, wow!"],
	["Heya master %name% great job on reaching level %level%", "Wow. I love it when you level like that %name%. Which level did you reach? %level% huh? Amazing."]
];

const aLevelImageUserData = [ 
	//Array's of images
	["0.jpg", "0&.jpg", "0&&.jpg", "0&&&.jpg"],
	["1.jpg", "1&.jpg"],
	["2.jpg", "2&.jpg", "2&&.png"],
	["3.jpg"],
	["4.jpg", "4&.jpg"],
	["5.jpg", "5&.jpg", "5&&.jpg"],
	["6.jpg", "6&.jpg"],
	["7.jpg", "7&.jpeg", "7&&.jpeg"],
	["8.jpg", "8&.jpg", "8&&.jpg"],
	["9.jpg"],
	["10.jpg", "10&.jpg"],
	["11.jpeg", "11&.jpg"],
	["12.jpg", "12&.jpg"]
];

var aExpCurve = [];
let nLevelIndex = 0;

aExpCurve[1] = 10;
aExpCurve[2] = 12;
aExpCurve[3] = 14;
aExpCurve[4] = 16;
aExpCurve[5] = 18;
aExpCurve[6] = 32;
aExpCurve[7] = 42;
aExpCurve[8] = 52;
aExpCurve[9] = 62;

// level 10-15's curve
for (nLevelIndex = 10; nLevelIndex < 15; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.05;
}

// level 15-29 curve
for (nLevelIndex = 15; nLevelIndex < 30; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.1;
}

// level 30-34's curve
for (nLevelIndex = 30; nLevelIndex < 35; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.15;
}

//level 35-39 curve
for (nLevelIndex = 35; nLevelIndex < 40; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.2;
}

//level 40-59 curve
for (nLevelIndex = 40; nLevelIndex < 60; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.08;
}

// level 60-64's curve
for (nLevelIndex = 60; nLevelIndex < 65; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.02;
}

// level 65 - 74 curve
for (nLevelIndex = 65; nLevelIndex < 75; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.08;
}

// level 75 - 99 curve
for (nLevelIndex = 75; nLevelIndex < 100; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.07;
}
// level 100 - 104 curve
for (nLevelIndex = 100; nLevelIndex < 105; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1];
}

// level 105 - 159 curve
for (nLevelIndex = 105; nLevelIndex < 160; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.07;
}

// level 160 - 199 curve
for (nLevelIndex = 160; nLevelIndex < 200; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.06;
}

aExpCurve[200] = aExpCurve[199] * 2;

// level 201 - 209 curve
for (nLevelIndex = 201; nLevelIndex < 210; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.2;
}

aExpCurve[210] = aExpCurve[209] * 2;

// level 210 - 219 curve
for (nLevelIndex = 211; nLevelIndex < 220; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.06;
}

aExpCurve[220] = aExpCurve[219] * 2;

// level 220 - 229 curve
for (nLevelIndex = 221; nLevelIndex < 230; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.04;
}

aExpCurve[230] = aExpCurve[229] * 2;

// level 230 - 239 curve
for (nLevelIndex = 231; nLevelIndex < 240; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.02;
}

aExpCurve[240] = aExpCurve[239] * 2;

// level 240 - 249's curve
for (nLevelIndex = 241; nLevelIndex < 250; nLevelIndex++) {
    aExpCurve[nLevelIndex] = aExpCurve[nLevelIndex - 1] * 1.01;
}

aExpCurve[250] = aExpCurve[149] + 1337; //meme level

exports.getCurve = function(nLower, nUpper) {
	if ((nLower > nUpper) || (nLower < 1)) return "Invalid upper/lower limit. Try 1-250.";
	let sExpCurve = "";
	for (let i = nLower; (i < aExpCurve.length) && (i < nUpper); i++) {
		sExpCurve += parseInt(aExpCurve[i]) + "\r\n";
	}
	return sExpCurve;
}

exports.nextLevelEXP = function(nLevel) {
	return aExpCurve[nLevel + 1];
}

exports.gainExp = function(bot, msg, con) {
	return new Promise((resolve, reject) => {
        con.getConnection(function(err, connection) {
            if (err) {
                reject(`Error connecting to aUserDatabase: \r\n\r\n{$err}`);
                return;
            }

            let aQueryData = [msg.guild.id, msg.author.id];
            let query = con.query("SELECT * FROM users WHERE guild = ? AND userid = ?", aQueryData, function(err, result) {
                if (err) {
                    reject(`Query Error (user_fetch): ${query}`);
                    return;
                }

                if (result.length != 0) {
                    let nLevel = result[0].level;
                    let nExp = result[0].exp;
					
					nExp++; //Add 1 exp/message
					if (Math.random > 0.95) { //5% chance for bonus exp
						nExp += (Math.ceil(0.05 * aExpCurve[nLevel + 1] * Math.random())); //add bonus of 5% of req exp max.
					}

                    if (nExp >= aExpCurve[nLevel]) {

                        const nMessageCategory = getRandomInt(0, aLevelMessageUserData.length);//category index
                        const sImageName = aLevelImageUserData[nMessageCategory][getRandomInt(0, aLevelImageUserData[nMessageCategory].length)];//actual image filename
                        let sLevelMessage = aLevelMessageUserData[nMessageCategory][getRandomInt(0, aLevelMessageUserData[nMessageCategory].length)];//string message

                        const sImageURL = sLevelImageDir + "/0/" + sImageName;

                        nExp = 0;
                        nLevel++;

                        sLevelMessage = sLevelMessage.replace("%level%", nLevel.toString());
                        sLevelMessage = sLevelMessage.replace("%name%", msg.author.toString());

                        let nMsgColor = 0;

                        try {
                          let aRoles = msg.member.roles.array();
                          for(let i = 0; i < aRoles.length; i++) {
                            if (aRoles[i].color != 0) {
                              nMsgColor = aRoles[i].color;
                              continue;
                            }
                          }
                        } catch (e) {
                          console.log("No role information was found:\r\n" + e)
                        }
						
						console.log(sImageURL);
						
						/* Levels disabled rn.
                        msg.channel.sendMessage("", {
                            embed: {
                                title: 'Level up!',
                                description: sLevelMessage,
                                color: nMsgColor,
                                image: {
                                  url: sImageURL,
                                  height: 15
                                }
                            }
                        });
						*/
                    }
                    let aUserData = [nLevel, nExp, msg.guild.id, msg.author.id];
                    let query = con.query("UPDATE users SET level = ?, exp = ? WHERE guild = ? AND userid = ?", aUserData, function(err, result) {
                          if (err) {
                            reject(`Query Error (user_update): ${query}`);
                            return;
                          }
                    });
                } else {
                  console.log("User not found: " + msg.author.username + " - " + msg.author.id);
                  let query = con.query("INSERT INTO users (guild, userid, level, exp, status) VALUES (?, ?, 1, 1, '')", aQueryData, function(err, result) {
                    if (err) {
                      reject(`Query Error (user_create): ${err}`);
                      return;
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

