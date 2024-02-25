const { EmbedBuilder } = require("discord.js");
module.exports = function (message, name, iconURL) {
	const embed = new EmbedBuilder()
		.setColor("#02f506")
		.setTitle("Message Received")

		.setAuthor({
			name,
			iconURL,
		})
		.setDescription(message)

		.setTimestamp();

	return embed;
};
