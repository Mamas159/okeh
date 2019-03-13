var sLogChannelID;

exports.setLogChannel = function(sChannelID) {
	sLogChannelID = sChannelID;
}

exports.logEdited = function(bot, oldMsg, newMsg) {
	return new Promise((resolve, reject) => {
		if (oldMsg.author.bot || oldMsg.author.id == bot.user.id) return;
		if (oldMsg.toString() === newMsg.toString()) return;

		let sGuild = "DM";
		try {
			sGuild = oldMsg.guild.name;
		} catch (e) {
			sGuild = "DM";
		}

		let sChannel = "DM"
		try {
			sChannel = oldMsg.channel.name;
		} catch (e) {
			sChannel = oldMsg.author.username;
		}

		let channel = bot.channels.get(sLogChannelID);
		channel.sendMessage("", {
			embed: {
				title: "Message by " + oldMsg.author.username + " Edited",
				description: "Guild: " + sGuild + "\r\nChannel: " + sChannel,
				fields: [
					{
						name : "Old Message",
						value: oldMsg.toString(),
						inline: true
					},
					{
						name : "New Message",
						value: newMsg.toString(),
						inline: true
					}
				],
				thumbnail : {
					url: oldMsg.author.avatarURL
				},
				footer : {
					text : (new Date()).toString()
				},
				color: 16750899
			}
		});
	});
}

exports.logDeleted = function(bot, msg) {
	logDeleted(bot, msg);
}

function logDeleted(bot, msg) {
	return new Promise((resolve, reject) => {
		if (msg.author.bot || msg.author.id == bot.user.id) return;
		let sGuild = "DM";
		try {
			sGuild = msg.guild.name;
		} catch (e) {
			sGuild = "DM";
		}
			let sChannel = "DM"
		try {
			sChannel = msg.channel.name;
		} catch (e) {
			sChannel = msg.author.username;
		}
			let channel = bot.channels.get(sLogChannelID);
		channel.sendMessage("", {
			embed: {
				title: "Message by " + msg.author.username + " Deleted",
				description: "Guild: " + sGuild + "\r\nChannel: " + sChannel,
				fields: [
					{
						name : "Message",
						value: msg.toString(),
						inline: true
					}
				],
				thumbnail : {
					url: msg.author.avatarURL
				},
				footer : {
					text : (new Date()).toString()
				},
				color: 16711680
			}
		});
	});
}

exports.guildMemberMigration = function(bot, member, bLeave) {
	return new Promise((resolve, reject) => {

		let sGuild = member.guild.name;
		let nColor = bLeave ? 16711680 : 8716172;
		let sAction = bLeave ? "' left guild." : "' joined guild.";
		let channel = bot.channels.get(sLogChannelID);

		channel.sendMessage("", {
			embed: {
				title: "Guild Member '" + member.displayName + sAction,
				description: "Guild: " + sGuild,
				thumbnail : {
					url: member.user.avatarURL
				},
				footer : {
					text : (new Date()).toString()
				},
				color: nColor
			}
		});
	});
}

exports.logBulkDeleted = function(bot, collection) {
	return new Promise((resolve, reject) => {
		let aMessages = collection.array();
		for (let i = 0; i < aMessages.length; i++) {
			logDeleted(bot, aMessages[i]);
		}
	});
}

exports.guildMemberPunish = function(bot, user, moderator, guild, banned) {
	return new Promise((resolve, reject) => {

		let channel = bot.channels.get(sLogChannelID);

		channel.sendMessage("", {
			embed: {
				title: "User " + user.username + " was " + banned ? "banned" : "kicked" + " by " + moderator,
				description: "Guild: " + guild,
				thumbnail : {
					url: user.avatarURL
				},
				footer : {
					text : (new Date()).toString()
				},
				color: 16711680
			}
		});
	});
}