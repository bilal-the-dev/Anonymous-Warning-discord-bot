const UserData = require("../../models/UserData");

const discordTranscripts = require("discord-html-transcripts");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
	try {
		const { content, guild, author, channel } = message;

		const guard = !message.inGuild() || author.bot || content !== "!close";
		// ||
		// channel.parentId !== process.env.WARNING_CATEGORY;

		if (guard) return;

		const userDoc = await UserData.findOne({ channelId: channel.id });

		if (!userDoc) return;

		const fetchedMember = await guild.members.fetch(userDoc.userId).catch(()=> null)

		const attachment = await discordTranscripts.createTranscript(channel, {
			poweredBy: false,
			filename: `${fetchedMember?.user?.username ?? 'Logs'}.html`,
		});

		const embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("Ticket closed")

			.setDescription(`**Member:** <@${userDoc.userId}>\n**Closed by:** ${author}`)

			.setTimestamp();

		await userDoc.deleteOne();
		await channel.delete();

		const logsChannel = await guild.channels.fetch(
			process.env.WARNING_LOGS_CHANNEL,
		);

		await logsChannel.send({
			embeds: [embed],
			files: [attachment],
		});
	} catch (error) {
		console.log(error);
		await message.reply(`Err! \`${error.message}.\``);
	}
};
