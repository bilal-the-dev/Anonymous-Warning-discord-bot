const UserData = require("../../models/UserData");
const generateEmbed = require("../../utils/generateEmbed");
const General = require("../../models/General");

module.exports = async (message) => {
	try {
		const { content, guild, author, channel, mentions } = message;

		const guard =
			!message.inGuild() ||
			author.bot ||
			channel.id !== process.env.WARNING_CHANNEL ||
			!content.startsWith("!anonym");

		if (guard) return;

		const [_, mentionedMember] = content.split(" ");
		console.log({ content });
		console.log(typeof content);

		const warning_message = content.replace(/^(\S+\s+\S+\s+)/, "");

		const userToWarn = mentions.users.first();

		const extractedId = mentionedMember.replace(/[\\<>@#&!]/g, "");

		if (
			!userToWarn ||
			!warning_message ||
			!mentionedMember ||
			userToWarn?.id !== extractedId
		)
			return;

		const { id: userId, username } = userToWarn;

		// // DM the member
		const embed = generateEmbed(
			warning_message,
			username,
			userToWarn.displayAvatarURL(),
		);

		await userToWarn.send({ embeds: [embed] });

		// // send embed to warning channel
		embed
			.setColor("#f50202")
			.setTitle("Message Sent")
			.setFooter({
				text: `Sent by ${author.username}`,
				iconURL: `${author.displayAvatarURL()}`,
			});

		// find the document then see if channel exists

		const userDoc = await UserData.findOne({ userId });
		let generalDoc = await General.findOne({ guildId: guild.id });

		if (!generalDoc) generalDoc = await General.create({ guildId: guild.id });

		let userTicket = await guild.channels.fetch(userDoc?.channelId);

		if (!userDoc) {
			userTicket = await guild.channels.create({
				name: `${username}-${generalDoc.ticketNo + 1}
				`,
				parent: process.env.WARNING_CATEGORY,
			});

			await UserData.create({
				userId,
				channelId: userTicket.id,
			});

			await generalDoc.updateOne({ $inc: { ticketNo: 1 } });
		}

		await userTicket.send({ embeds: [embed] });
	} catch (error) {
		console.log(error);
		// await message.reply(`Err! \`${error.message}.\``);
	}
};
