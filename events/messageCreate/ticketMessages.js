const UserData = require("../../models/UserData");
const generateEmbed = require("../../utils/generateEmbed");

module.exports = async (message) => {
	try {
		const { content, guild, author, channel } = message;

		const guard =
			!message.inGuild() ||
			author.bot ||
			content === "!close" ||
			channel.parentId !== process.env.WARNING_CATEGORY;

		if (guard) return;

		const userDoc = await UserData.findOne({ channelId: channel.id });

		console.log("trying to get inside ticket channel");
		if (!userDoc) return;

		console.log("inside ticket channel");

		const memberToWarn = await guild.members.fetch(userDoc.userId);

		if (!memberToWarn) return;

		await message.delete();

		const {
			user: { username },
		} = memberToWarn;

		// // DM the member
		const embed = generateEmbed(
			content,
			username,
			memberToWarn.displayAvatarURL(),
		);

		await memberToWarn.send({ embeds: [embed] });

		// // send embed to warning channel
		embed
			.setColor("#f50202")
			.setTitle("Message Sent")
			.setFooter({
				text: `Sent by ${author.username}`,
				iconURL: `${author.displayAvatarURL()}`,
			});

		await channel.send({ embeds: [embed] });
	} catch (error) {
		console.log(error);
	}
};
