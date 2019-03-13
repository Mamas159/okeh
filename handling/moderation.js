exports.kick = function(bot, msg, user) {
	return new Promise((resolve, reject) => {
		msg.guild.member(user).kick();
		channel.sendMessage(`Kicked ${user.name}`);
	});
}

exports.ban = function(bot, msg, user) {
	return new Promise((resolve, reject) => {
		msg.guild.member(user).ban();
		channel.sendMessage(`Banned ${user.name}`);
	});
}

exports.clearMessages = function(bot, msg, count) {
	return new Promise((resolve, reject) => {
		msg.channel.bulkDelete(count);
	});
}

exports.clearUserMessages = function(bot, msg, user) {
	return new Promise((resolve, reject) => {
		let aMessages = msg.channel.messages.findAll('author',  user);
		msg.channel.bulkDelete(aMessages);
	});
}