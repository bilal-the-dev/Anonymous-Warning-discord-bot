const UserData = require("../../models/UserData");
const generateEmbed = require("../../utils/generateEmbed");

module.exports = async (message) => {
	try {
		const {
			content,
			client,
			author: { id, username, bot },
		} = message;

		if (message.inGuild() || bot) return;

		const userDoc = await UserData.findOne({ userId: id });

		if (!userDoc) return;

		await message.react("✅");

		const embed = generateEmbed(
			content,
			username,
			message.author.displayAvatarURL(),
		);

		const guild = client.guilds.cache.get(process.env.GUILD_ID);
		const channel = await guild.channels.fetch(userDoc.channelId);

		await channel.send({
			embeds: [embed],
		});
	} catch (error) {
		console.log(error);
	}
};
